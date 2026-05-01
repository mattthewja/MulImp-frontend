import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router';
import { getLobby, leaveLobby } from '../../api/lobbyApi.ts'
import { startGame, getState, getPlayerState, postAnswer, postVote } from '../../api/gameApi.ts'

export default function LobbyPage() {
    const { lobbyId } = useParams();
    const [lobby, setLobby] = useState<any>(null);
    const [game, setGame] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const navigate = useNavigate();

    const [answer, setAnswer] = useState("");

    // https://dev.to/tangoindiamango/polling-in-react-3h8a
    //https://medium.com/@sfcofc/implementing-polling-in-react-a-guide-for-efficient-real-time-data-fetching-47f0887c54a7
    useEffect(() => {
        if (!lobbyId) return;

        async function load() {
            const lobbyData = await getLobby(lobbyId);
            const gameData = await getState(lobbyId);
            const playerData = await getPlayerState(lobbyId, localStorage.getItem("playerId"));
            setLobby(lobbyData);
            setGame(gameData);
            setData(playerData);
        }

        load();
        const id = setInterval(load, 1000);
        return () => clearInterval(id);
    }, [lobbyId]);

    async function handleLeave() {
        const playerId = localStorage.getItem("playerId");

        await leaveLobby(lobbyId, playerId);

        localStorage.removeItem("playerId");
        navigate("/")
    }

    async function handleStart() {
        // const playerId = localStorage.getItem("playerId");
        await startGame(lobbyId);
    }

    if (!lobby) { // stop failure
        return <p>Loading lobby...</p>
    }

    return (<>
        // https://stackoverflow.com/questions/39501289/in-reactjs-how-to-copy-text-to-clipboard
        <h1>{lobby.lobbyId}</h1>

        <ul>
            {lobby.players.map((p: string) => (
                <li key={p}>{p}</li>
            ))}
        </ul>

        {game?.gameState === "IN_LOBBY" && (<>
            <button onClick={handleLeave}>leave</button>
            <button onClick={handleStart}>start</button>
        </>)}

        {game?.gameState === "ANSWERING" && (<>
            <p>Question: {data?.question}</p>
            <input value={answer} onChange={(event) => {
                setAnswer(event.target.value);
            }} />
            <button onClick={() => {
                postAnswer(lobbyId, localStorage.getItem("playerId"), answer)
            }}>Submit Answer</button>
        </>)}

        {game?.gameState === "DISCUSSION" && (<>
            <h2>Answers</h2>
            {game.answers.map((answer) => (
                <p key={answer.username}>
                    {/* make a card for this in making it look good */}
                    <strong>{answer.username}:</strong> {answer.answer}
                </p>
            ))}
            <h2>Vote</h2>
            {game.players.map((player) => (
                <button key={player} onClick={() => {
                    postVote(lobbyId, localStorage.getItem("playerId"), player)
                }}>Vote {player}</button>
            ))}
        </>)}

        {game?.gameState === "RESULTS" && (<>
            <h2>Results</h2>
            <p>Imposter: {game.gameResult.imposterName}</p>
            <p>Voted out: {game.gameResult.votedOutName}</p>
        </>)}
    </>)
}
