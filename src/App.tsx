import React from "react";

import "./App.css";
import { useImmer } from "use-immer";

import { defaultTemplate, defaultNames, defautlQueries } from "./data";
import Collections, { TreeData } from "./Collections";
import { WritableDraft } from "immer/dist/internal";

type QueryPart = {
    enabled: boolean | "locked",
    query: string,
};

const buildCollectionsTree = (names: Names, collection: Template, data: TreeData = {}): TreeData => {
    for (const [key, value] of Object.entries(collection)) {
        const isDir = typeof value === "object";
        const isQueryId = typeof value === "number";

        if (isDir) {
            buildCollectionsTree(names, value, data);
        }
        data[key] = {
            index: key,
            canMove: true,
            hasChildren: isDir,
            children: isDir ? Object.keys(value) : undefined,
            data: {
                title: names[key],
                queryId: isQueryId ? value : null,
            },
            canRename: true,
        };

    }
    return data;
};

type Template = { [index: string]: number | Template };
type Names = { [index: string]: string };

function App(): JSX.Element {
    const [queryCollection, setQueryCollection] = useImmer<Template>(defaultTemplate);
    const [names, setNames] = useImmer<Names>(defaultNames);

    const [queries, setQueries] = useImmer<{ [id: number]: Array<QueryPart> }>(defautlQueries);

    const [queryParts, setQueryParts] = useImmer<Array<QueryPart>>(Object.values(queries)[0]);

    console.log("Update", Date.now());

    return (
        <div className="App">
            <header className="App-header inverted">
                <Collections
                    treeData={buildCollectionsTree(names, queryCollection)}
                    onSelectQuery={(queryKey): void => {
                        console.log("onSelectQuery", queryKey);
                        setQueryParts(queries[queryKey]);
                    }}
                    onAddCollection={() => {
                        const newIndex = Date.now().toString();
                        setQueryCollection((draft) => {
                            (draft.root as WritableDraft<Template>)[newIndex] = {};
                        });
                        setNames((draft) => { draft[newIndex] = "New collection"; });
                        return newIndex;
                    }}
                    onRenameItem={(item, name) => {
                        console.log(item, name);
                        setNames((draft) => { draft[item.index] = name; });
                    }}
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
                    <button key={"searh"} className="button-n inverted" onClick={() => search(queryParts)}>
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
                        onClick={() => goto("https://scryfall.com/random")}
                    >
                        Random card
                    </button>
                </div>
            </header>
        </div>
    );
}

function search(queryParts: QueryPart[]): void {
    let queryUrl = "https://scryfall.com/search?q=";

    queryUrl += encodeURIComponent(
        queryParts
            .filter((p) => !!p.enabled)
            .map((p) => "(" + p.query + ")")
            .join(" "),
    );

    goto(queryUrl);
}

async function goto(url?: string): Promise<void> {
    const activeTab = (await browser.tabs.query({ currentWindow: true, active: true }))[0];
    browser.tabs.update(activeTab.id, { url });
}

export default App;

