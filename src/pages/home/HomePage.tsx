import { useNavigate } from 'react-router'
import { useState } from 'react'
import { joinLobby, createLobby } from '../../api/lobbyApi.ts'
import { motion } from 'motion/react'

import logo from '../../assets/logo.png'

import './HomePage.css'

export default function HomePage() {
    const [username, setUsername] = useState("");
    const [lobbyId, setLobbyId] = useState("");
    // const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleJoin() {
        try {
            // setError("")
            const data = await joinLobby(lobbyId, username);

            localStorage.setItem("playerId", data.playerId);
            localStorage.setItem("username", username);

            navigate(`/lobby/${data.lobbyId}`);
        } catch (err: any) {
            console.log("Failure to join");
            alert(err);
        }
    }

    async function handleCreate() {
        try {
            const data = await createLobby(username);

            localStorage.setItem("playerId", data.playerId);
            localStorage.setItem("username", username);
            
            navigate(`/lobby/${data.lobbyId}`);
        } catch (err: any) {
            console.log("Failure to create lobby");
            alert(err);
        }
    }

    return (<div className="home-wrapper">
        <div className="home-hero">
            <motion.img src={logo} 
            animate={{ 
                x: [-25, 25],
                scale: [.8, 1.2]
            }}
            transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
            }}
            />
        </div>
        <div className="home-user-input">
            <input
            placeholder="Username"
            value={username}
            onChange={(event) => {
                setUsername(event.target.value)
            }}
            />
        </div>
        <div className="home-lobby-input">
            <input
            placeholder="Lobby ID"
            value={lobbyId}
            onChange={(event) => {
                setLobbyId(event.target.value)
            }}
            />
        </div>
        <div className="home-btns">
            <button onClick={handleCreate}>Create</button>
            <button onClick={handleJoin}>Join</button>
        </div>
    </div>)
}