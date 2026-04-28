import { Routes, Route } from "react-router";
import HomePage from "./pages/home/HomePage.tsx";
import LobbyPage from "./pages/lobby/LobbyPage.tsx";

import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lobby/:lobbyId" element={<LobbyPage />} />
    </Routes>
  )
}

export default App
