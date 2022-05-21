import React from 'react';
import logo from './scryfall.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button
          className="App-link"
          onClick={search}
        >
          Learn React
        </button>
      </header>
    </div>
  );
}

async function search() {
  
  const activeTab = (await browser.tabs.query({ currentWindow: true, active: true }) )[0]
  browser.tabs.update(activeTab.id, { url: "https://scryfall.com/random" });
}

export default App;
