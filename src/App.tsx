import { useEffect, useState } from 'react';
import logo from './scryfall.svg';
import './App.css';

function App() {
  const [searchHistory, setSearchHistory] = useState<Array<browser.history.HistoryItem>>([] );

  useEffect(() => {
    async function fetchData() {
      setSearchHistory(await browser.history.search({
        text: "scryfall.com/search",
        maxResults: 1000000000000
      }));
    }
    fetchData();
    browser.webNavigation.onCompleted.addListener(fetchData, {
      url:
      [
        {urlContains: "scryfall.com/search"}
      ]
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header inverted">
        <img src={logo} className="App-logo" alt="logo" />
        {
          searchHistory.map(historyItem => 
            <button
              className='button-n inverted'
            onClick={()=>goto(historyItem.url)}
          >
            {historyItem.title}
          </button>
          )
        }
        <button
              className='button-n inverted'
          onClick={()=>goto("https://scryfall.com/random")}
        >
          Random card
        </button>
      </header>
    </div>
  );
}


async function goto(url?: string) {
  const activeTab = (await browser.tabs.query({ currentWindow: true, active: true }) )[0]
  browser.tabs.update(activeTab.id, { url});
}

export default App;
