import React, { useEffect, useMemo, useRef, useState } from "react";

import "./App.css";
import { useImmer } from "use-immer";

import {
    defaultDataTree, defaultNames, defautlQueries,
    Names, DataNode, DataTree, QueryLibrary, QueryPart, newQueryPart,
} from "./data";
import Collections, { FlatTreeData } from "./Collections";
import { WritableDraft } from "immer/dist/internal";
import { DraggingPosition, TreeItemIndex, TreeRef } from "react-complex-tree";

import Textarea from "react-expanding-textarea";

const buildCollectionsTree = (names: Names, filter: string, collection: DataTree, path: TreeItemIndex[] = [], data: FlatTreeData = {}): [FlatTreeData, boolean] => {
    let hasMatch = false;
    for (const [key, value] of Object.entries(collection)) {
        const isDir = typeof value === "object";
        const isQueryId = typeof value === "number";

        const title = names[key];

        let doesMatchFilter = matchFilter(title, filter);

        if (isDir) {
            const [_, childMatch] = buildCollectionsTree(names, doesMatchFilter ? "" : filter, value, [key, ...path], data);
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
                    path,
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

const removeProp = (obj: DataTree, match: TreeItemIndex): DataNode | null => {
    for (const key in obj) {
        if (key === match) {
            const removed = obj[key];
            delete obj[key];
            return removed;
        } else {
            const children = obj[key];
            if (typeof children === "object") {
                const removed = removeProp(children, match);
                if (!!removed) { return removed; }
            }
        }
    }
    return null;
};

const dragAndDropProp = (obj: DataTree, match: TreeItemIndex, target: DraggingPosition, treeData: FlatTreeData): void => {
    const moved = removeProp(obj, match); // updates obj
    if (moved === null) {
        throw Error("Nothing to move");
    }

    switch (target.targetType) {
        case "item":
            return placeProp(obj, match, moved, target.targetItem);
        case "between-items":
            return placeProp(obj,
                match,
                moved,
                target.parentItem,
                treeData[target.parentItem].children?.[target.childIndex - 1],
                treeData[target.parentItem].children?.[target.childIndex]);
    }
};

const placeProp = (obj: DataTree, match: TreeItemIndex, moved: DataNode, under: TreeItemIndex, after?: TreeItemIndex, before?: TreeItemIndex): void => {
    for (const key in obj) {
        if (key === under) {
            const children = obj[key];
            if (typeof children === "object") {
                if (!!after || !!before) {
                    obj[under] = Object.keys(children).reduce((ac: DataTree, key) => {
                        const value = children[key];
                        if (key === before) {
                            ac[match] = moved;
                        }
                        ac[key] = value;
                        if (key === after) {
                            ac[match] = moved;
                        }
                        return ac;
                    }, {});
                } else {
                    children[match] = moved;
                    obj[under] = children;
                }
                return;
            }
        } else {
            const children = obj[key];
            if (typeof children === "object") {
                placeProp(children, match, moved, under, after, before);
            }
        }
    }
};

const duplicate = (obj: DataTree, match: TreeItemIndex, newIndex: TreeItemIndex, newValue: number): DataTree => {
    return Object.keys(obj).reduce((ac: DataTree, key) => {
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

const addCollection = (obj: DataTree, match: TreeItemIndex, newIndex: TreeItemIndex, stub: DataTree): DataTree => {
    return Object.keys(obj).reduce((ac: DataTree, key) => {
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
    const [queryCollection, setQueryCollection] = useImmer<DataTree>(defaultDataTree);
    const [names, setNames] = useImmer<Names>(defaultNames);
    const [queries, setQueries] = useImmer<QueryLibrary>(defautlQueries);


    useEffect(() => {
        async function fetchData(): Promise<void> {
            const stored = await browser.storage.local.get(["queryCollection", "names", "queries"]);
            stored.queryCollection && setQueryCollection(stored.queryCollection as DataTree);
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

    const tree = useRef<TreeRef>(null);

    return (
        <div className="App">
            {modal}
            <header className="App-header inverted">
                <Collections
                    ref={tree}
                    focusedItem={editingQuery}
                    treeData={treeData}
                    onSelectQuery={(queryKey): void => {
                        console.log("setEditingQuery", queryKey);
                        setEditingQuery(queryKey);
                        const editingQueryId = treeData[queryKey].data.queryId as number;
                        setQueryParts(queries[editingQueryId]);
                    }}
                    onAddRootCollection={() => {
                        const newIndex = crypto.randomUUID();
                        setNames((draft) => {
                            draft[newIndex] = "New collection";
                        });
                        setQueryCollection((draft) => {
                            (draft.root as WritableDraft<DataTree>)[newIndex] = {};
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
                            draft[newIndex] = duplicateName(names[afterIndex]);
                        });
                        const newQueryNumber = Date.now();
                        setQueries((draft) => {
                            draft[newQueryNumber] = draft[treeData[afterIndex].data.queryId as number];
                        });
                        setQueryCollection((draft) => duplicate(draft, afterIndex, newIndex, newQueryNumber));
                        setEditingQuery(newIndex);
                        return newIndex;
                    }}
                    onRenameItem={(item, name) => {
                        setNames((draft) => {
                            draft[item.index] = name;
                        });
                    }}
                    onDeleteItem={(item) => {
                        setQueryCollection((draft) => {
                            const removed = removeProp(draft, item.index);
                            console.log(removed);
                        });
                    }}
                    onDrop={(item, target) => {
                        setQueryCollection((draft) => {
                            dragAndDropProp(draft, item.index, target, treeData);
                        });
                        console.log(item, target);
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
                        onClick={() => {
                            const newIndex = crypto.randomUUID();
                            setNames((draft) => {
                                draft[newIndex] = duplicateName(names[editingQuery]);
                            });
                            const newQueryNumber = Date.now();
                            setQueries((draft) => {
                                draft[newQueryNumber] = queryParts;
                            });
                            setQueryCollection((draft) => duplicate(draft, editingQuery, newIndex, newQueryNumber));
                            setEditingQuery(newIndex);
                            tree.current?.startRenamingItem(newIndex);
                        }}
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

function duplicateName(base: string): string {
    base = base.replace(/ \(Copy .+\)/, "");
    return `${base} (Copy ${new Date().toLocaleString("en-GB")})`;
}

export default App;
