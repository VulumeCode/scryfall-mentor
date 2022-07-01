import React, { useEffect, useMemo, useRef, useState } from "react";

import "./App.css";
import { useImmer } from "use-immer";
import { produce } from "immer";

import { defaultDataTree, defaultNames, defautlQueries, Names, DataNode, DataTree, QueryLibrary, QueryPart, newQueryPart } from "./data";
import Collections, { FlatTreeData } from "./Collections";
import { WritableDraft } from "immer/dist/internal";
import { DraggingPosition, TreeItemIndex, TreeRef } from "react-complex-tree";

import Textarea from "react-expanding-textarea";
import icons from "./icons";

const buildCollectionsTree = (
    names: Names,
    filter: string,
    editingQuery: TreeItemIndex,
    collection: DataTree,
    path: TreeItemIndex[] = [],
): [FlatTreeData, boolean] => {
    let data: FlatTreeData = {};
    let hasMatch = false;
    for (const [key, value] of Object.entries(collection)) {
        const isDir = typeof value === "object";
        const isQueryId = typeof value === "number";

        const title = names[key];

        let doesMatchFilter = matchFilter(title, filter) || editingQuery === key;

        let childData: FlatTreeData = {};
        if (isDir) {
            let childMatch: boolean;
            [childData, childMatch] = buildCollectionsTree(names, doesMatchFilter ? "" : filter, editingQuery, value, [...path, key]);
            doesMatchFilter ||= childMatch;
        }
        if (doesMatchFilter) {
            hasMatch ||= doesMatchFilter;

            const childKeys = Object.keys(childData);

            data[key] = {
                index: key,
                canMove: true,
                hasChildren: isDir,
                children: isDir ? Object.keys(value).filter((v) => childKeys.includes(v)) : undefined,
                data: {
                    title: title,
                    queryId: isQueryId ? value : null,
                    path,
                },
                canRename: true,
            };
        }
        data = { ...data, ...childData };
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
                if (!!removed) {
                    return removed;
                }
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
            return placeProp(
                obj,
                match,
                moved,
                target.parentItem,
                treeData[target.parentItem].children?.[target.childIndex - 1],
                treeData[target.parentItem].children?.[target.childIndex],
            );
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

const saveUnder = (obj: DataTree, path: TreeItemIndex[], newIndex: TreeItemIndex, newValue: number): void => {
    if (path.length == 0) {
        obj[newIndex] = newValue;
    } else {
        const [head, ...rest] = path;
        saveUnder(obj[head] as DataTree, rest, newIndex, newValue);
    }
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
    const [queryCollection, sync_queryCollection] = useState<DataTree>(defaultDataTree);
    const [names, sync_names] = useState<Names>(defaultNames);
    const [queries, sync_queries] = useState<QueryLibrary>(defautlQueries);
    const [editingQuery, set_editingQuery] = useState<TreeItemIndex>("Hans");

    const set_names = (p: (draft: WritableDraft<Names>) => void): Promise<void> => browser.storage.sync.set({ names: produce(names, p) });
    const set_queries = (p: (draft: WritableDraft<QueryLibrary>) => void): Promise<void> => browser.storage.sync.set({ queries: produce(queries, p) });
    const set_queryCollection = (p: (draft: WritableDraft<DataTree>) => void): Promise<void> => browser.storage.sync.set({ queryCollection: produce(queryCollection, p) });

    useEffect(() => {
        browser.storage.onChanged.addListener((changes) => {
            console.log(changes);
            for (const change in changes) {
                switch (change) {
                    case "queries": { sync_queries(changes[change].newValue); break; }
                    case "names": { sync_names(changes[change].newValue); break; }
                    case "queryCollection": { sync_queryCollection(changes[change].newValue); break; }
                }
            }
        });
    }, []);

    const [filter, set_filter] = useImmer<string>("");

    const treeData = useMemo(() => buildCollectionsTree(names, filter, editingQuery, queryCollection)[0], [names, filter, editingQuery, queryCollection]);

    const [editingQueryPath, set_editingQueryPath] = useState(() => treeData[editingQuery]?.data.path);
    useEffect(() => {
        const editingQueryNode = treeData[editingQuery];
        if (!!editingQueryNode) {
            set_editingQueryPath(treeData[editingQuery]?.data.path);
        }
    }, [treeData, editingQuery]);

    const editingQueryId = useMemo(() => treeData[editingQuery]?.data.queryId, [treeData, editingQuery]);

    const [queryParts, set_queryParts] = useImmer<Array<QueryPart>>(!!editingQueryId ? queries[editingQueryId] : []);

    const [autoSave, set_autoSave] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData(): Promise<void> {
            const stored = await browser.storage.sync.get();
            stored.queryCollection && sync_queryCollection(stored.queryCollection as DataTree);
            stored.names && sync_names(stored.names as Names);
            stored.queries && sync_queries(stored.queries as QueryLibrary);
            if (!!stored.editingQuery) {
                set_editingQuery(stored.editingQuery as TreeItemIndex);
                const editingQueryId = treeData[stored.editingQuery as TreeItemIndex].data.queryId as number;
                set_queryParts(queries[editingQueryId]);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        browser.storage.sync.set({ editingQuery });
    }, [editingQuery]);

    const dirty = useMemo(() => {
        return !!editingQueryId ? JSON.stringify(queries[editingQueryId]) !== JSON.stringify(queryParts) : false;
    }, [queries, queryParts, editingQueryId]);

    const [maskQueryParts, set_maskQueryParts] = useImmer<Array<QueryPart>>([]);

    const [modal, set_modal] = useState<JSX.Element | undefined>(undefined);

    console.log("Update", Date.now());

    const tree = useRef<TreeRef>(null);

    const saveEditingQueries = (): void => {
        !!editingQueryId &&
            set_queries((draft) => {
                draft[editingQueryId] = queryParts;
            });
    };

    useEffect(() => {
        if (autoSave) {
            saveEditingQueries();
        }
    }, [queryParts, autoSave]);

    const version = useMemo(() => browser.runtime.getManifest().version, []);

    return (
        <div className="App">
            {modal}
            <header className="App-header inverted">
                <Collections
                    ref={tree}
                    focusedItem={editingQuery}
                    treeData={treeData}
                    onSelectQuery={(queryKey): void => {
                        console.log("set_editingQuery", queryKey);
                        if (!dirty || confirm("Unsaved changes. Load anyways?")) {
                            set_editingQuery(queryKey);
                            const editingQueryId = treeData[queryKey].data.queryId as number;
                            set_queryParts(queries[editingQueryId]);
                        }
                    }}
                    onAddRootCollection={() => {
                        const newIndex = crypto.randomUUID();
                        set_names((draft) => {
                            draft[newIndex] = "New collection";
                        });
                        set_queryCollection((draft) => {
                            (draft.root as WritableDraft<DataTree>)[newIndex] = {};
                        });
                        return newIndex;
                    }}
                    onAddCollection={(underIndex) => {
                        const newQueryIndex = crypto.randomUUID();
                        const newQueryNumber = Date.now();
                        const newCollectionIndex = crypto.randomUUID();
                        set_names((draft) => {
                            draft[newQueryIndex] = "New query";
                            draft[newCollectionIndex] = "New collection";
                        });
                        set_queries((draft) => {
                            draft[newQueryNumber] = [];
                        });
                        set_queryCollection((draft) => addCollection(draft, underIndex, newCollectionIndex, { [newQueryIndex]: newQueryNumber }));
                        return newCollectionIndex;
                    }}
                    onDuplicate={(afterIndex) => {
                        const newIndex = crypto.randomUUID();
                        set_names((draft) => {
                            draft[newIndex] = duplicateName(names[afterIndex]);
                        });
                        const newQueryNumber = Date.now();
                        set_queries((draft) => {
                            draft[newQueryNumber] = draft[treeData[afterIndex].data.queryId as number];
                        });
                        set_queryCollection((draft) => duplicate(draft, afterIndex, newIndex, newQueryNumber));
                        set_editingQuery(newIndex);
                        return newIndex;
                    }}
                    onRenameItem={(item, name) => {
                        set_names((draft) => {
                            draft[item.index] = name;
                        });
                    }}
                    onDeleteItem={(item) => {
                        set_queryCollection((draft) => {
                            const removed = removeProp(draft, item.index);
                            console.log(removed);
                        });
                    }}
                    onDrop={(item, target) => {
                        set_queryCollection((draft) => {
                            dragAndDropProp(draft, item.index, target, treeData);
                        });
                        console.log(item, target);
                    }}
                    onLoadAsMask={(queryKey) => {
                        const queryId = treeData[queryKey].data.queryId as number;
                        set_maskQueryParts(queries[queryId]);
                    }}
                    onAppendToMask={(queryKey) => {
                        const queryId = treeData[queryKey].data.queryId as number;
                        set_maskQueryParts((draft) => [...draft, ...queries[queryId]]);
                    }}
                    {...{ filter, set_filter, set_modal }}
                />

                {/* <div key="pushDownSpacer" className="pushDownSpacer"></div> */}

                <div className="queryEditor">
                    <button key={"search"} className="button-n inverted" onMouseUp={(e) => search([...queryParts, ...maskQueryParts], e)}>
                        <i className="blueprint-icons-big">{icons["search"].utf}</i> Search
                    </button>
                    {/* <button key={"random"} className="button-n inverted" onMouseUp={(e) => goto("https://scryfall.com/random", e)}>
                        Random card
                    </button> */}
                </div>

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
                                        set_queryParts((draft) => {
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
                                        set_queryParts((draft) => {
                                            if (last) {
                                                draft[i] = { ...newQueryPart };
                                                draft[i].enabled = true;
                                            }
                                            draft[i].query = e.target.value;
                                        })
                                    }
                                    placeholder={last ? "Query" : undefined}
                                    tabIndex={0}
                                />
                                {
                                    <button
                                        className="remove"
                                        disabled={last}
                                        onClick={() =>
                                            set_queryParts((draft) => {
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

                    <div className="queryEditor">
                        <button
                            key={"autosave"}
                            className="button-n inverted"
                            onClick={() => {
                                set_autoSave(!autoSave);
                            }}
                        >
                            Autosave {autoSave ? "✓" : "✗"}
                        </button>
                        {!autoSave && (
                            <button
                                key={"save"}
                                className="button-n inverted"
                                disabled={!dirty}
                                onClick={() => {
                                    saveEditingQueries();
                                }}
                            >
                                Save
                            </button>
                        )}
                        <button
                            key={"saveas"}
                            className="button-n inverted"
                            onClick={() => {
                                const newIndex = crypto.randomUUID();
                                set_names((draft) => {
                                    draft[newIndex] = duplicateName(names[editingQuery]);
                                });
                                const newQueryNumber = Date.now();
                                set_queries((draft) => {
                                    draft[newQueryNumber] = queryParts;
                                });
                                // set_queryCollection((draft) => duplicate(draft, editingQuery, newIndex, newQueryNumber));
                                set_queryCollection((draft) => saveUnder(draft, editingQueryPath, newIndex, newQueryNumber));
                                set_editingQuery(newIndex);
                                tree.current?.startRenamingItem(newIndex);
                            }}
                        >
                            Save as...
                        </button>
                    </div>
                </div>

                <div key="activeMaskName" className="activeMaskName">
                    <i className="ms ms-ability-menace"></i> Mask
                </div>
                <div className="queryPartsContainer">
                    {[...maskQueryParts, newQueryPart].map((queryPart, i) => {
                        const last = i === maskQueryParts.length;
                        return (
                            <label key={"queryPart" + i} className="advanced-search-checkbox">
                                <input
                                    key={"queryPartCheckbox" + i}
                                    className={"button-n inverted " + queryPart.enabled}
                                    type="checkbox"
                                    checked={!!queryPart.enabled}
                                    disabled={last}
                                    onChange={(e) =>
                                        set_maskQueryParts((draft) => {
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
                                        set_maskQueryParts((draft) => {
                                            if (last) {
                                                draft[i] = { ...newQueryPart };
                                                draft[i].enabled = true;
                                            }
                                            draft[i].query = e.target.value;
                                        })
                                    }
                                    placeholder={last ? "Query" : undefined}
                                    tabIndex={0}
                                />
                                {
                                    <button
                                        className="remove"
                                        disabled={last}
                                        onClick={() =>
                                            set_maskQueryParts((draft) => {
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
                    <div className="queryEditor">
                        <button key={"clear"} className="button-n inverted" onClick={() => set_maskQueryParts([])}>
                            Clear mask
                        </button>
                        <button
                            key={"saveas"}
                            className="button-n inverted"
                            onClick={() => {
                                const newIndex = crypto.randomUUID();
                                set_names((draft) => {
                                    draft[newIndex] = duplicateName(names[editingQuery]) + " {m}";
                                });
                                const newQueryNumber = Date.now();
                                set_queries((draft) => {
                                    draft[newQueryNumber] = maskQueryParts;
                                });
                                // set_queryCollection((draft) => duplicate(draft, editingQuery, newIndex, newQueryNumber));
                                set_queryCollection((draft) => saveUnder(draft, editingQueryPath, newIndex, newQueryNumber));
                                tree.current?.startRenamingItem(newIndex);
                            }}
                        >
                            Save mask as...
                        </button>
                    </div>
                </div>
                <div style={{ opacity: 0.5, fontSize: "50%" }}>Version {version}</div>
                <a style={{ opacity: 0.5, fontSize: "50%", position: "relative" }} href="about:devtools-toolbox?id=scryfall-mentor%40VulumeCode&type=extension">
                    Debug
                </a>
                <a
                    style={{ opacity: 0.5, fontSize: "50%", position: "relative" }}
                    href={"data:text/json," + JSON.stringify({ queryCollection, queries, names }, undefined, 1)}
                    download="export.json"
                >
                    Export
                </a>
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
    if (!!e?.ctrlKey || !!e?.metaKey || e?.button === 1) {
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
