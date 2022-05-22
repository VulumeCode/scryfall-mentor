import { useState } from 'react';
import './App.css';
import { useImmer } from "use-immer";

type QueryPart = {
  enabled: boolean
  part: string
}

function App() {
  const [searchHistory, setSearchHistory] = useState<Array<browser.history.HistoryItem>>([]);

  const [queryParts, setQueryParts] = useImmer<Array<QueryPart>>([{ enabled: true, part: "Hans" }, { enabled: false, part: "Ach" }]);

  // useEffect(() => {
  //   async function fetchData() {
  //     setSearchHistory(await browser.history.search({
  //       text: "://scryfall.com/search",
  //       maxResults: 1000000000000,
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

  console.log("Update", Date.now())

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
        {
          queryParts.map((queryPart, i) =>
            <label
              id={"queryPart" + i}
              key={"queryPart" + i}
              className="advanced-search-checkbox">
              <input
                id={"queryPartCheckbox" + i}
                key={"queryPartCheckbox" + i}
                className='button-n inverted'
                type="checkbox" checked={queryPart.enabled} onChange={
                  (e) => setQueryParts(draft => { draft[i].enabled = e.target.checked; })
                } ></input>
              <input
                id={"queryPartText" + i}
                key={"queryPartText" + i}
                className='button-n inverted' type="text" value={queryPart.part} onChange={
                  (e) => setQueryParts(draft => { draft[i].part = e.target.value; })
                } ></input>
            </label>
          )
        }
        <label
          id={"queryPart" + queryParts.length}
          key={"queryPart" + queryParts.length}
          className="advanced-search-checkbox">
          <input
            id={"queryPartCheckbox" + queryParts.length}
            key={"queryPartCheckbox" + queryParts.length}
            className='button-n inverted'
            type="checkbox" checked={false} disabled={true}
          ></input>
          <input
            id={"queryPartText" + queryParts.length}
            key={"queryPartText" + queryParts.length}
            className='button-n inverted' type="text" value={""} placeholder="query" onChange={
              (e) => setQueryParts(draft => { draft.push({ enabled: true, part: e.target.value }) })
            } ></input>
        </label>



        <button
          key={"searh"}
          className='button-n inverted'
          onClick={() => search(queryParts)}
        >
          Search
        </button>
        <button
          key={"random"}
          className='button-n inverted'
          onClick={() => goto("https://scryfall.com/random")}
        >
          Random card
        </button>
      </header>
    </div >
  );
}

async function search(queryParts: QueryPart[]) {
  let queryUrl = "https://scryfall.com/search?q=";

  queryUrl += encodeURIComponent(queryParts.filter(p => p.enabled).map(p =>
    "(" + (p.part) + ")"
  ).join(' '));

  goto(queryUrl)
}

async function goto(url?: string) {
  const activeTab = (await browser.tabs.query({ currentWindow: true, active: true }))[0]
  browser.tabs.update(activeTab.id, { url });
}

export default App;
