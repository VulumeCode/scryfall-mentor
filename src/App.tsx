import { useEffect, useRef, useState } from 'react';
import './App.css';
import { useImmer } from "use-immer";


import { longTree } from "./data";
import Collections from './Collections';

type QueryPart = {
  enabled: boolean | "locked"
  query: string
}


function App() {
  // const [searchHistory, setSearchHistory] = useState<Array<browser.history.HistoryItem>>([]);
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

  const [queryCollection, setQueryCollection] = useImmer<{ [id: number]: Array<QueryPart> }>({
    1: [
      { enabled: true, query: "Hans" },
      { enabled: false, query: "Ach" },
      { enabled: false, query: "" },
    ],
    2: [
      { enabled: true, query: "t:slug" },
      { enabled: true, query: "t:legendary" },
      { enabled: true, query: "c:b" },
      { enabled: false, query: "" },
    ],
    3: [
      { enabled: true, query: "t:food" },
      { enabled: true, query: "t:creature" },
      { enabled: false, query: "" },
    ],
  });

  const [queryParts, setQueryParts] = useImmer<Array<QueryPart>>(Object.values(queryCollection)[0]);

  console.log("Update", Date.now())

  return (
    <div className="App">
      <header className="App-header inverted">

        {// history
          // searchHistory.map((historyItem, i) =>
          //   <button
          //     key={"history" + i}
          //     className='button-n inverted'
          //     onClick={() => goto(historyItem.url)}
          //     title={historyItem.url}
          //   >
          //     {historyItem.title?.replace(" · Scryfall Magic: The Gathering Search", "")}
          //   </button>
          // )
        }

        <Collections
          treeData={longTree.items}
          onSelectQuery={(queryKey) => {
            console.log(queryKey)
            setQueryParts(queryCollection[queryKey])
          }
          }
        />


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
            onClick={() => setQueryCollection(draft => { draft[Date.now()] = queryParts })}
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
