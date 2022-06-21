import React, { useEffect, useMemo, useState } from "react";

import "./App.css";
import { useImmer } from "use-immer";

import {
    defaultTemplate, defaultNames, defautlQueries,
    Names, Template, QueryLibrary, QueryPart, newQueryPart,
} from "./data";
import Collections, { TreeData } from "./Collections";
import { WritableDraft } from "immer/dist/internal";
import { TreeItemIndex } from "react-complex-tree";

import Textarea from "react-expanding-textarea";

const buildCollectionsTree = (names: Names, filter: string, collection: Template, data: TreeData = {}): [TreeData, boolean] => {
    let hasMatch = false;
    for (const [key, value] of Object.entries(collection)) {
        const isDir = typeof value === "object";
        const isQueryId = typeof value === "number";

        const title = names[key];

        let doesMatchFilter = matchFilter(title, filter);

        if (isDir) {
            const [_, childMatch] = buildCollectionsTree(names, doesMatchFilter ? "" : filter, value, data);
            doesMatchFilter ||= childMatch;
        }
        if (doesMatchFilter) {
            hasMatch ||= doesMatchFilter;
            data[key] = {
                index: key,
                canMove: true,
                hasChildren: isDir,
                children: isDir ? Object.keys(value) : undefined,
                data: {
                    title: title,
                    queryId: isQueryId ? value : null,
                },
                canRename: true,
            };
        }
    }
    return [data, hasMatch];
};

const matchFilter = (value: string, filter: string): boolean => {
    if (filter === "") {
        return true;
    } else {
        const filters = filter.toLowerCase().split(" ");
        const testValue = value.toLowerCase();
        return filters.every((f) => testValue.indexOf(f) >= 0);
    }
};

const removeProp = (obj: Template, match: TreeItemIndex): void => {
    for (const key in obj) {
        if (key === match) {
            delete obj[key];
            return;
        } else {
            const children = obj[key];
            if (typeof children === "object") {
                removeProp(children, match);
            }
        }
    }
};

const duplicate = (obj: Template, match: TreeItemIndex, newIndex: TreeItemIndex, newValue: number): Template => {
    return Object.keys(obj).reduce((ac: Template, key) => {
        const value = obj[key];
        if (typeof value === "object") {
            ac[key] = duplicate(value, match, newIndex, newValue);
        } else {
            ac[key] = value;
            if (key === match) {
                ac[newIndex] = newValue;
            }
        }
        return ac;
    }, {});
};

const addCollection = (obj: Template, match: TreeItemIndex, newIndex: TreeItemIndex, stub: Template): Template => {
    return Object.keys(obj).reduce((ac: Template, key) => {
        const value = obj[key];
        if (typeof value === "object") {
            const updatedChildren = addCollection(value, match, newIndex, stub);
            if (key === match) {
                ac[key] = { [newIndex]: stub, ...updatedChildren };
            } else {
                ac[key] = updatedChildren;
            }
        } else {
            ac[key] = value;
        }
        return ac;
    }, {});
};

function App(): JSX.Element {
    const [queryCollection, setQueryCollection] = useImmer<Template>(defaultTemplate);
    const [names, setNames] = useImmer<Names>(defaultNames);
    const [queries, setQueries] = useImmer<QueryLibrary>(defautlQueries);


    useEffect(() => {
        async function fetchData(): Promise<void> {
            const stored = await browser.storage.local.get(["queryCollection", "names", "queries"]);
            stored.queryCollection && setQueryCollection(stored.queryCollection as Template);
            stored.names && setNames(stored.names as Names);
            stored.queries && setQueries(stored.queries as QueryLibrary);
        }
        fetchData();
    }, []);

    useEffect(() => { browser.storage.local.set({ queryCollection }); }, [queryCollection]);
    useEffect(() => { browser.storage.local.set({ names }); }, [names]);
    useEffect(() => { browser.storage.local.set({ queries }); }, [queries]);

    const [filter, setFilter] = useImmer<string>("");

    const treeData = useMemo(() => buildCollectionsTree(names, filter, queryCollection)[0], [names, filter, queryCollection]);

    const defaultEditingQuery = Object.keys(treeData).find((key) => !treeData[key].hasChildren) ?? "root";

    const [editingQuery, setEditingQuery] = useState<TreeItemIndex>(defaultEditingQuery);

    const editingQueryId = treeData[editingQuery].data.queryId as number;

    const [queryParts, setQueryParts] = useImmer<Array<QueryPart>>(queries[editingQueryId]);

    const [modal, setModal] = useState<JSX.Element | undefined>(undefined);

    console.log("Update", Date.now());

    return (
        <div className="App">
            {modal}
            <header className="App-header inverted">
                <Collections
                    focusedItem={editingQuery}
                    treeData={treeData}
                    onSelectQuery={(queryKey): void => {
                        console.log("setEditingQuery", queryKey);
                        setEditingQuery(queryKey);
                        const editingQueryId = treeData[editingQuery].data.queryId as number;
                        setQueryParts(queries[editingQueryId]);
                    }}
                    onAddRootCollection={() => {
                        const newIndex = crypto.randomUUID();
                        setNames((draft) => {
                            draft[newIndex] = "New collection";
                        });
                        setQueryCollection((draft) => {
                            (draft.root as WritableDraft<Template>)[newIndex] = {};
                        });
                        return newIndex;
                    }}
                    onAddCollection={(underIndex) => {
                        const newQueryIndex = crypto.randomUUID();
                        const newQueryNumber = Date.now();
                        const newCollectionIndex = crypto.randomUUID();
                        setNames((draft) => {
                            draft[newQueryIndex] = "New query";
                            draft[newCollectionIndex] = "New collection";
                        });
                        setQueries((draft) => {
                            draft[newQueryNumber] = [];
                        });
                        setQueryCollection((draft) => addCollection(draft, underIndex, newCollectionIndex, { [newQueryIndex]: newQueryNumber }));
                        return newCollectionIndex;
                    }}
                    onDuplicate={(afterIndex) => {
                        const newIndex = crypto.randomUUID();
                        setNames((draft) => {
                            draft[newIndex] = "New query";
                        });
                        const newQueryNumber = Date.now();
                        setQueries((draft) => {
                            draft[newQueryNumber] = queryParts; // TODO bug
                        });
                        setQueryCollection((draft) => duplicate(draft, afterIndex, newIndex, newQueryNumber));
                        return newIndex;
                    }}
                    onRenameItem={(item, name) => {
                        setNames((draft) => {
                            draft[item.index] = name;
                        });
                    }}
                    onDeleteItem={(item) => {
                        setQueryCollection((draft) => {
                            removeProp(draft, item.index);
                        });
                    }}
                    {...{ filter, setFilter, setModal }}
                />

                <div key="pushDownSpacer" className="pushDownSpacer"></div>
                <div key="activeQueryName" className="activeQueryName">
                    <i className="ms ms-ability-learn"></i> Search for Magic cards...
                </div>
                <div className="queryPartsContainer">
                    {[...queryParts, newQueryPart].map((queryPart, i) => {
                        const last = i === queryParts.length;
                        return (
                            <label key={"queryPart" + i} className="advanced-search-checkbox">
                                <input
                                    key={"queryPartCheckbox" + i}
                                    className={"button-n inverted " + queryPart.enabled}
                                    type="checkbox"
                                    checked={!!queryPart.enabled}
                                    disabled={last}
                                    onChange={(e) =>
                                        setQueryParts((draft) => {
                                            draft[i].enabled = e.target.checked;
                                        })
                                    }
                                    tabIndex={-1}
                                ></input>
                                <Textarea
                                    className="textarea button-n inverted"
                                    value={queryPart.query}
                                    key={"queryPartTextArea" + i}
                                    rows={1}
                                    onChange={(e) =>
                                        setQueryParts((draft) => {
                                            if (last) {
                                                draft[i] = { ...newQueryPart };
                                                draft[i].enabled = true;
                                            }
                                            draft[i].query = e.target.value;
                                        })}
                                    placeholder={last ? "Query" : undefined}
                                    tabIndex={0}
                                />
                                {
                                    <button
                                        className="remove"
                                        disabled={last}
                                        onClick={() =>
                                            setQueryParts((draft) => {
                                                draft.splice(i, 1);
                                            })
                                        }
                                        tabIndex={-1}
                                    >
                                        🞪
                                    </button>
                                }
                            </label>
                        );
                    })}
                </div>
                <div className="queryEditor" style={{ display: "flex", width: "100%" }}>
                    <button key={"search"} className="button-n inverted" onClick={(e) => search(queryParts, e)}>
                        Search
                    </button>
                    <button
                        key={"save"}
                        className="button-n inverted"
                        onClick={() =>
                            setQueries((draft) => {
                                draft[editingQueryId] = queryParts;
                            })
                        }
                    >
                        Save
                    </button>
                    <button
                        key={"saveas"}
                        className="button-n inverted"
                        onClick={() =>
                            setQueries((draft) => {
                                draft[Object.keys(draft).length + 1] = queryParts;
                            })
                        }
                    >
                        Save as...
                    </button>
                    <button key={"random"} className="button-n inverted" onClick={(e) => goto("https://scryfall.com/random", e)}>
                        Random card
                    </button>
                </div>

                {/* <div key="activeMaskName" className="activeMaskName">
                    <i className="ms ms-ability-menace"></i> Mask
                </div>
                {queryParts.map((queryPart, i) => {
                    const last = i === queryParts.length - 1;
                    return (
                        <label key={"queryPart" + i} className="advanced-search-checkbox">
                            <input
                                key={"queryPartCheckbox" + i}
                                className={"button-n inverted " + queryPart.enabled}
                                type="checkbox"
                                checked={!!queryPart.enabled}
                                disabled={last}
                                onChange={(e) =>
                                    setQueryParts((draft) => {
                                        draft[i].enabled = e.target.checked;
                                    })
                                }
                            ></input>
                            <input
                                key={"queryPartText" + i}
                                className="button-n inverted"
                                type="text"
                                value={queryPart.query}
                                placeholder={last ? "Query" : undefined}
                                onChange={(e) =>
                                    setQueryParts((draft) => {
                                        draft[i].query = e.target.value;
                                        if (last) {
                                            draft[i].enabled = true;
                                            draft.push({
                                                enabled: false,
                                                query: "",
                                            });
                                        }
                                    })
                                }
                            ></input>
                            {
                                <button
                                    className="remove"
                                    disabled={last}
                                    onClick={() =>
                                        setQueryParts((draft) => {
                                            draft.splice(i, 1);
                                        })
                                    }
                                >
                                    🞪
                                </button>
                            }
                        </label>
                    );
                })} */}
            </header>
        </div>
    );
}

function search(queryParts: QueryPart[], e?: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    let queryUrl = "https://scryfall.com/search?q=";

    queryUrl += encodeURIComponent(
        queryParts
            .filter((p) => !!p.enabled)
            .map((p) => p.query.replace(/\n/g, " "))
            .map((q) => `(${q})`)
            .join(" "),
    );

    goto(queryUrl, e);
}

async function goto(url?: string, e?: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    if (!!e?.ctrlKey || !!e?.metaKey) {
        browser.tabs.create({ active: true, url: url });
    } else {
        const activeTab = (await browser.tabs.query({ currentWindow: true, active: true }))[0];
        browser.tabs.update(activeTab.id, { url });
    }
}

export default App;
