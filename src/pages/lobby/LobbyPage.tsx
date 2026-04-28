import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router';
import { getLobby, leaveLobby } from '../../api/lobbyApi.ts'

export default function LobbyPage() {
    const { lobbyId } = useParams();
    const [lobby, setLobby] = useState<any>(null);
    const navigate = useNavigate();

    // https://dev.to/tangoindiamango/polling-in-react-3h8a
    //https://medium.com/@sfcofc/implementing-polling-in-react-a-guide-for-efficient-real-time-data-fetching-47f0887c54a7
    useEffect(() => {
        if (!lobbyId) return;

        async function load() {
            const data =await getLobby(lobbyId);
            setLobby(data);
        }

        load();
        const id = setInterval(load, 1000);

        return () => clearInterval(id);
    }, [lobbyId]);

    async function handleLeave() {
        const playerId = localStorage.getItem("playerId")

        await leaveLobby(lobbyId, playerId);

        localStorage.removeItem("playerId");
        navigate("/")
    }

    if (!lobby) { // stop failure
        return <p>Loading lobby...</p>
    }

    return (<>
        <h1>{lobby.lobbyId}</h1>
        <button onClick={handleLeave}>leave</button>

        <ul>
            {lobby.players.map((p: string) => (
                <li key={p}>{p}</li>
            ))}
        </ul>
    </>)
}