import React from "react";

import "./App.css";
import { useImmer } from "use-immer";

import { defaultTemplate, defaultNames, defautlQueries } from "./data";
import Collections, { TreeData } from "./Collections";
import { WritableDraft } from "immer/dist/internal";
import { TreeItemIndex } from "react-complex-tree";
import ContextMenu from "./ContextMenu";

type QueryPart = {
    enabled: boolean | "locked",
    query: string,
};

type Template = { [index: TreeItemIndex]: number | Template };
type Names = { [index: string]: string };

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
        return filters.every(f => testValue.indexOf(f) >= 0);
    }
};


const removeProp = (obj: Template, match: TreeItemIndex): void => {
    for (const prop in obj) {
        if (prop === match) {
            delete obj[prop];
            return;
        }
        else {
            const children = obj[prop];
            if (typeof children === "object") {
                removeProp(children, match);
            }
        }
    }
};

function App(): JSX.Element {
    const [queryCollection, setQueryCollection] = useImmer<Template>(defaultTemplate);
    const [names, setNames] = useImmer<Names>(defaultNames);

    const [filter, setFilter] = useImmer<string>("");

    const [queries, setQueries] = useImmer<{ [id: number]: Array<QueryPart> }>(defautlQueries);

    const [queryParts, setQueryParts] = useImmer<Array<QueryPart>>(Object.values(queries)[0]);

    console.log("Update", Date.now());

    return (
        <div className="App">
            <header className="App-header inverted">


                {/* <ContextMenu yPos={80} /> */}
                <Collections
                    treeData={buildCollectionsTree(names, filter, queryCollection)[0]}
                    onSelectQuery={(queryKey): void => {
                        console.log("onSelectQuery", queryKey);
                        setQueryParts(queries[queryKey]);
                    }}
                    onAddCollection={() => {
                        const newIndex = crypto.randomUUID();
                        setQueryCollection((draft) => {
                            (draft.root as WritableDraft<Template>)[newIndex] = {};
                        });
                        setNames((draft) => { draft[newIndex] = "New collection"; });
                        return newIndex;
                    }}
                    onRenameItem={(item, name) => {
                        setNames((draft) => { draft[item.index] = name; });
                    }}
                    onDeleteItem={item => {
                        setQueryCollection((draft) => {
                            removeProp(draft, item.index);
                        });
                    }}
                    {...{ filter, setFilter }}
                />

                <div key="pushDownSpacer" className="pushDownSpacer"></div>
                <div key="activeQueryName" className="activeQueryName">
                    Search for Magic cards...
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
                                onDoubleClick={() =>
                                    setQueryParts((draft) => {
                                        draft[i].enabled = "locked";
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
                })}

                <div className="queryEditor" style={{ display: "flex", width: "100%" }}>
                    <button key={"searh"} className="button-n inverted"
                        onClick={(e) => search(queryParts, e)}>
                        Search
                    </button>
                    <button
                        key={"save"}
                        className="button-n inverted"
                        onClick={() =>
                            setQueries((draft) => {
                                draft[Date.now()] = queryParts;
                            })
                        }
                    >
                        Save
                    </button>
                    <button
                        key={"random"}
                        className="button-n inverted"
                        onClick={(e) => goto("https://scryfall.com/random", e)}
                    >
                        Random card
                    </button>
                </div>
            </header>
        </div>
    );
}

function search(queryParts: QueryPart[], e?: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    let queryUrl = "https://scryfall.com/search?q=";

    queryUrl += encodeURIComponent(
        queryParts
            .filter((p) => !!p.enabled)
            .map((p) => `(${p.query})`)
            .join(" "),
    );

    goto(queryUrl, e);
}

async function goto(url?: string, e?: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    if ((!!e?.ctrlKey) || (!!e?.metaKey)) {
        browser.tabs.create({ active: true, url: url });
    } else {
        const activeTab = (await browser.tabs.query({ currentWindow: true, active: true }))[0];
        browser.tabs.update(activeTab.id, { url });
    }
}

export default App;

