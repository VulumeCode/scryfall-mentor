import { useEffect, useRef, useState } from 'react';
import './App.css';
import { useImmer } from "use-immer";
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider, TreeRef } from 'react-complex-tree';
import "react-complex-tree/lib/style.css";

import { longTree } from "./data";

type QueryPart = {
  enabled: boolean | "locked"
  query: string
}


function App() {
  const [searchHistory, setSearchHistory] = useState<Array<browser.history.HistoryItem>>([]);
  // useEffect(() => {
  //   async function fetchData() {
  //     setSearchHistory(await browser.history.search({
  //       text: "://scryfall.com/search",
  //       maxResults: 20,
  //       startTime: new Date(0)
  //     }));
  //   }
  //   fetchData();
  //   browser.webNavigation.onCompleted.addListener(fetchData, {
  //     url:
  //       [
  //         { urlContains: "://scryfall.com/search" }
  //       ]
  //   });
  // }, []);

  const [queries, setQueries] = useImmer<{ [id: string]: Array<QueryPart> }>({
    "Hans": [
      { enabled: true, query: "Hans" },
      { enabled: false, query: "Ach" },
      { enabled: false, query: "" },
    ],
    "Toxrill": [
      { enabled: true, query: "t:slug" },
      { enabled: true, query: "t:legendary" },
      { enabled: true, query: "c:b" },
      { enabled: false, query: "" },
    ],
    "Gingerbrute": [
      { enabled: true, query: "t:food" },
      { enabled: true, query: "t:creature" },
      { enabled: false, query: "" },
    ],
  });

  const [queryParts, setQueryParts] = useImmer<Array<QueryPart>>(Object.values(queries)[0]);

  console.log("Update", Date.now())


  const tree = useRef<TreeRef>(null);

  return (
    <div className="App">
      <header className="App-header inverted">

        {// history
          searchHistory.map((historyItem, i) =>
            <button
              key={"history" + i}
              className='button-n inverted'
              onClick={() => goto(historyItem.url)}
              title={historyItem.url}
            >
              {historyItem.title?.replace(" · Scryfall Magic: The Gathering Search", "")}
            </button>
          )
        }


        {// workspace
          // Object.keys(queries).map((queryName, i) =>
          //   <button
          //     key={"workspace" + i}
          //     className='button-n inverted'
          //     onClick={() => setQueryParts(queries[queryName])}
          //     title={queryName}
          //   >
          //     {queryName}
          //   </button>
          // )
        }
        <UncontrolledTreeEnvironment
          dataProvider={new StaticTreeDataProvider(longTree.items, (item, data) => ({ ...item, data }))}
          getItemTitle={item => item.data}
          viewState={{}}
          canReorderItems
          canDragAndDrop
        >
          <Tree
            treeId="tree-1"
            rootItem="root"
            treeLabel="Tree Example"
            ref={tree}
            renderItemArrow={(props) => props.item.hasChildren
              ? <span className='blueprint-icons-standard' onClick={() => tree.current?.toggleItemExpandedState(props.item.index)}> {props.context.isExpanded
                ? "\uF1BA"
                : "\uF1B8"}</span>
              : null}
            renderItemTitle={({ title, item }) => <div onDoubleClick={() => tree.current?.startRenamingItem(item.index)}>{title}</div>}
          />
        </UncontrolledTreeEnvironment>


        <div key='pushDownSpacer' className='pushDownSpacer'></div>
        <div key='activeQueryName' className='activeQueryName'>
          Search for Magic cards...
        </div>
        {
          queryParts.map((queryPart, i) => {
            const last = i === queryParts.length - 1
            return <label
              key={"queryPart" + i}
              className="advanced-search-checkbox">
              <input
                key={"queryPartCheckbox" + i}
                className={'button-n inverted ' + queryPart.enabled}
                type="checkbox"
                checked={!!queryPart.enabled}
                disabled={last}
                onChange={
                  (e) => setQueryParts(draft => { draft[i].enabled = e.target.checked; })
                }
                onDoubleClick={(e) => setQueryParts(draft => {
                  draft[i].enabled = "locked";
                })}></input>
              <input
                key={"queryPartText" + i}
                className='button-n inverted'
                type="text"
                value={queryPart.query}
                placeholder={last ? "Query" : undefined}
                onChange={
                  (e) => setQueryParts(draft => {
                    draft[i].query = e.target.value;
                    if (last) {
                      draft[i].enabled = true;
                      draft.push({ enabled: false, query: "" })
                    }
                  })
                } ></input>
              {<button
                className='remove'
                disabled={last}
                onClick={() =>
                  setQueryParts(draft => {
                    draft.splice(i, 1);
                  })
                }>🞪</button>}
            </label>
          }
          )
        }

        <div className='queryEditor'>
          <button
            key={"searh"}
            className='button-n inverted'
            onClick={() => search(queryParts)}
          >
            Search
          </button>
          <button
            key={"save"}
            className='button-n inverted'
            onClick={() => setQueries(draft => { draft[Date.now()] = queryParts })}
          >
            Save
          </button>
          <button
            key={"random"}
            className='button-n inverted'
            onClick={() => goto("https://scryfall.com/random")}
          >
            Random card
          </button>
        </div>
      </header>
    </div >
  );
}

function search(queryParts: QueryPart[]) {
  let queryUrl = "https://scryfall.com/search?q=";

  queryUrl += encodeURIComponent(queryParts.filter(p => !!p.enabled).map(p =>
    "(" + (p.query) + ")"
  ).join(' '));

  goto(queryUrl)
}

async function goto(url?: string) {
  const activeTab = (await browser.tabs.query({ currentWindow: true, active: true }))[0]
  browser.tabs.update(activeTab.id, { url });
}

export default App;
