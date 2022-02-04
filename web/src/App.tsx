import React from 'react';
import './App.css';
import NpcDuelContextProvider from "./contexts/NpcDuelContext";
import NpcDuel from "./pages/NpcDuel";
import NpcContextProvider from "./contexts/NpcContext";

function Game() {
  return (
    <NpcDuel />
  );
}

function App() {
  return (
    <NpcContextProvider>
      <NpcDuelContextProvider>
        <Game />
      </NpcDuelContextProvider>
    </NpcContextProvider>
  );
}

export default App;
