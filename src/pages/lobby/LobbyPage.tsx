import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router';
import { getLobby, leaveLobby } from '../../api/lobbyApi.ts'
import { startGame, getState, getPlayerState, postAnswer, postVote } from '../../api/gameApi.ts'
import { motion } from 'motion/react';

import './LobbyPage.css';

import PlayerList from './components/PlayerList.tsx'
import AnswerList from './components/AnswerList.tsx'

export default function LobbyPage() {
    const { lobbyId } = useParams();
    const playerId = sessionStorage.getItem("playerId");
    const [lobby, setLobby] = useState<any>(null);
    const [game, setGame] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const navigate = useNavigate();

    const [answer, setAnswer] = useState("");

    // https://dev.to/tangoindiamango/polling-in-react-3h8a
    //https://medium.com/@sfcofc/implementing-polling-in-react-a-guide-for-efficient-real-time-data-fetching-47f0887c54a7
    useEffect(() => {
        if (!lobbyId || !playerId) return;

        async function load() {
            const lobbyData = await getLobby(lobbyId!);
            const gameData = await getState(lobbyId!);
            const playerData = await getPlayerState(lobbyId!, playerId!);
            setLobby(lobbyData);
            setGame(gameData);
            setData(playerData);
        }

        load();
        const id = setInterval(load, 1000);
        return () => clearInterval(id);
    }, [lobbyId]);

    useEffect(() => {
        if (game?.gameState === "ANSWERING") {
            setAnswer("");
        }
    }, [game?.gameState]);

    if (!lobbyId || !playerId || !lobby || !game || !data) { // stop failure
        return (<div>
            <h1>Loading game state...</h1>
            <p>If this page does not load after 5 seconds, please return and try again.</p>
            <button className="loading-page-return" onClick={() => navigate("/")}>Click to return to main menu</button>
        </div>)
    }

    async function handleLeave() {
        if (lobbyId && playerId) {
            await leaveLobby(lobbyId!, playerId!);
        }

        sessionStorage.removeItem("playerId");
        navigate("/")
    }

    async function handleStart() {
        // const playerId = sessionStorage.getItem("playerId");
        if (lobbyId) {
            await startGame(lobbyId);
        }
    }

    async function handleSubmitAnswer() {
        setData((prev: any) => ({ ...prev, hasAnswered: true }));
        if (!lobbyId || !playerId) return;
        await postAnswer(lobbyId, playerId, answer.trim())
    }

    async function handleVote(player: string) {
        setData((prev: any) => ({ ...prev, hasVoted: true }))
        if (!lobbyId || !playerId) return;
        await postVote(lobbyId, playerId, player)
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
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="game-copy-btn" onClick={() => {
                                    navigator.clipboard.writeText(lobby.lobbyId)
                                }}>📋</motion.button>
                        </div>
                    </div>

                    <div className="game-phase-card">
                        <p>{game.gameState.replace("_", " ")}...</p>
                    </div>
                </header>

                <section className="game-grid">
                    <aside className="game-card players-card">
                        {!(game.gameState === "DISCUSSION") && (<>
                            <h2>Players</h2>
                            {/* https://theodorusclarence.com/blog/list-animation */}
                            <PlayerList players={lobby.players} />
                        </>)}
                    </aside>

                    <section className="game-card main-card">
                        {game.gameState === "IN_LOBBY" && (<>
                            <h2>Ready to find the Imposter?</h2>
                            <p className="muted">Share the lobby code with other players.
                                Start when everyone has joined!
                            </p>

                            <div className="game-btn-row">
                                {/* just realised, forgot to add check for owner for starting game... */}
                                <motion.button
                                    whileHover={{ scale: 1.025 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="game-start-btn dim-hover" onClick={handleStart}>Start</motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.025 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="game-leave-btn dim-hover" onClick={handleLeave}>Leave</motion.button>
                            </div>
                        </>)}

                        {game.gameState === "ANSWERING" && (<>
                            <h2>{data.question}</h2>
                            <div className="game-answer-form">
                                <input className="game-form-answer-box dim-hover"
                                    value={answer}
                                    disabled={data.hasAnswered}
                                    placeholder="Type your answer..."
                                    onChange={(event) => setAnswer(event.target.value)}
                                />

                                <motion.button className="game-form-submit-btn dim-hover"
                                    whileTap={{ scale: .9 }}
                                    disabled={data.hasAnswered || !answer.trim()}
                                    onClick={handleSubmitAnswer}
                                >
                                    {data.hasAnswered ? "Answer Submitted..." : "Submit Answer"}
                                </motion.button>
                            </div>
                        </>)}

                        {game.gameState === "DISCUSSION" && (<>
                            <h2>Real Question: {data.question}</h2>
                            <AnswerList answers={game.answers} onVote={handleVote} hasVoted={data.hasVoted} />
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
                                <div className={
                                    game.gameResult.imposterName === game.gameResult.votedOutName
                                        ? "game-result-bool game-green" : "game-result-bool game-red"}>
                                    {game.gameResult.imposterName === game.gameResult.votedOutName
                                        ? "Imposter Voted Out!" : "Imposter Got Away!"}
                                </div>
                            </div>
                        </>)}
                    </section>
                </section>
            </section>
        </div>
    )
}
