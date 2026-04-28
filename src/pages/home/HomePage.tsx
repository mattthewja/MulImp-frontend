import { useNavigate } from 'react-router'
import { useState } from 'react'
import { joinLobby, createLobby } from '../../api/lobbyApi.ts'

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

    return (<>
        <div>
            <input
            placeholder="Username"
            value={username}
            onChange={(event) => {
                setUsername(event.target.value)
            }}
            />
        </div>
        <div>
            <input
            placeholder="Lobby ID"
            value={lobbyId}
            onChange={(event) => {
                setLobbyId(event.target.value)
            }}
            />
        </div>
        <div>
            <button onClick={handleCreate}>Create</button>
            <button onClick={handleJoin}>Join</button>
        </div>
    </>)
}