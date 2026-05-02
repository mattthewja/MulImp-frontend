import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router';
import { getLobby, leaveLobby } from '../../api/lobbyApi.ts'
import { startGame, getState, getPlayerState, postAnswer, postVote } from '../../api/gameApi.ts'
import { motion, AnimatePresence } from 'motion/react';

import './LobbyPage.css'

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
            const playerData = await getPlayerState(lobbyId, sessionStorage.getItem("playerId"));
            setLobby(lobbyData);
            setGame(gameData);
            setData(playerData);
        }

        load();
        const id = setInterval(load, 1000);
        return () => clearInterval(id);
    }, [lobbyId]);

    async function handleLeave() {
        const playerId = sessionStorage.getItem("playerId");

        await leaveLobby(lobbyId, playerId);

        sessionStorage.removeItem("playerId");
        navigate("/")
    }

    async function handleStart() {
        // const playerId = sessionStorage.getItem("playerId");
        await startGame(lobbyId);
    }

    async function handleSubmitAnswer() {
        await postAnswer(lobbyId, sessionStorage.getItem("playerId"), answer)
    }

    async function handleVote(player: string) {
        await postVote(lobbyId, sessionStorage.getItem("playerId"), player)
    }

    if (!lobby || !game || !data) { // stop failure
        return (<div>
            <p>Loading lobby...</p>
            <p>Click to return to main menu</p>
        </div>)
    }

    // New iteration
    return (
        <div className="game-page">
            <section className="game-wrapper">
                <header className="game-header">
                    <div>
                        <p className="lobby-lobby-id-label">Lobby ID</p>
                        <h1>{lobby.lobbyId}</h1>
                    </div>

                    <div className="game-phase-card">
                        {game.gameState.replace("_", " ")}
                    </div>
                </header>

                <section className="game-grid">
                    <aside className="game-card players-card">
                        <h2>Players</h2>
                        {/* https://theodorusclarence.com/blog/list-animation */}
                        <div className="lobby-player-wrapper">
                            <AnimatePresence initial={false}>
                                {lobby.players.map((p: string) => (
                                    <motion.div
                                        key={p}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                    >
                                        <motion.div className="lobby-player-card"
                                            initial={{
                                                opacity: 0,
                                                y: -8,
                                                scale: 0.98,
                                                filter: 'blur(4px)'
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                                filter: 'blur(0px)'
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: 8,
                                                scale: 0.98,
                                                filter: 'blur(4px)'
                                            }}
                                            transition={{ duration: 0.15, ease: 'easeOut' }}
                                        >
                                            <p className="lobby-player-card-text">{p}</p>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </aside>

                    <section className="game-card main-card">

                    </section>
                </section>
            </section>
        </div>
    )

    // old version
    return (
        <div className="game-page">
            {/* // https://stackoverflow.com/questions/39501289/in-reactjs-how-to-copy-text-to-clipboard */}
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
                <button onClick={() => handleSubmitAnswer()}>Submit Answer</button>
            </>)}

            {game?.gameState === "DISCUSSION" && (<>
                <p>Real Question: {data?.question}</p>
                <h2>Answers</h2>
                {game.answers.map((answer) => (
                    <p key={answer.username}>
                        {/* make a card for this in making it look good */}
                        <strong>{answer.username}:</strong> {answer.answer}
                    </p>
                ))}
                <h2>Vote</h2>
                {game.players.map((player) => (
                    <button key={player} onClick={() => handleVote(player)}>Vote {player}</button>
                ))}
            </>)}

            {game?.gameState === "RESULTS" && (<>
                <h2>Results</h2>
                <p>Imposter: {game.gameResult.imposterName}</p>
                <p>Voted out: {game.gameResult.votedOutName}</p>
            </>)}
        </div>
    )
}
