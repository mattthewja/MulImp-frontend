import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router';
import { getLobby, leaveLobby } from '../../api/lobbyApi.ts'
import { startGame, getState, getPlayerState, postAnswer, postVote } from '../../api/gameApi.ts'
import { motion, AnimatePresence } from 'motion/react';

import './LobbyPage.css';

import PlayerList from './components/PlayerList.tsx'
import AnswerList from './components/AnswerList.tsx'

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
        await postAnswer(lobbyId, sessionStorage.getItem("playerId"), answer.trim())
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
                        <p className="game-lobby-id-label">Lobby ID</p>
                        <div className="game-lobby-id-card">
                            <h1>{lobby.lobbyId}</h1>
                            <button onClick={() => {
                                navigator.clipboard.writeText(lobbyId)
                            }}>📋</button>
                        </div>
                    </div>

                    <div className="game-phase-card">
                        {game.gameState.replace("_", " ")}
                    </div>
                </header>

                <section className="game-grid">
                    <aside className="game-card players-card">
                        <h2>Players</h2>
                        {/* https://theodorusclarence.com/blog/list-animation */}
                        <PlayerList players={lobby.players} />
                    </aside>

                    <section className="game-card main-card">
                        {game.gameState === "IN_LOBBY" && (<>
                            <h2>Ready to find the Imposter?</h2>
                            <p className="muted">Share the lobby code with other players.
                                Start when everyone has joined!
                            </p>

                            <div className="game-button-row">
                                <button onClick={handleLeave}>Leave</button>
                                {/* just realised, forgot to add check for owner for starting game... */}
                                <button onClick={handleStart}>Start</button>
                            </div>
                        </>)}

                        {game.gameState === "ANSWERING" && (<>
                            <h2>{data.question}</h2>
                            <div className="game-answer-form">
                                <input
                                    value={answer}
                                    disabled={data.hasAnswered}
                                    placeholder="Type your answer..."
                                    onChange={(event) => setAnswer(event.target.value)}
                                />

                                <button
                                    disabled={data.hasAnswered || !answer.trim()}
                                    onClick={handleSubmitAnswer}
                                >
                                    {data.hasAnswered ? "Answer Submitted" : "Submit Answer"}
                                </button>
                            </div>
                        </>)}

                        {game.gameState === "DISCUSSION" && (<>
                            <h2>Real Question: {data.question}</h2>
                            <AnswerList answers={game.answers} />

                            <h3>Vote</h3>
                            <div className="game-vote-grid">
                                {game.players.map((player: string) => (
                                    <button
                                        className="vote-button"
                                        key={player}
                                        disabled={data.hasVoted}
                                        onClick={() => handleVote(player)}
                                    >
                                        {player}
                                    </button>
                                ))}
                            </div>
                        </>)}

                        {game.gameState === "RESULTS" && (<>
                            <h2>Game Over</h2>

                            <div className="game-result-box">
                                <p>
                                    <span>Imposter: </span>
                                    <strong>{game.gameResult.imposterName}</strong>
                                </p>

                                <p>
                                    <span>Voted Out: </span>
                                    <strong>{game.gameResult.votedOutName}</strong>
                                </p>
                            </div>
                        </>)}
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
