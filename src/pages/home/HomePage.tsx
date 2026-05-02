import { useNavigate } from 'react-router'
import { useState } from 'react'
import { joinLobby, createLobby } from '../../api/lobbyApi.ts'
import { motion } from 'motion/react'
import { AnimatePresence } from 'motion/react'

import logo from '../../assets/logo.png'

import './HomePage.css'

function getErrorMessage(err: any): string {
    return err.response?.data?.message || err.message || "Something went wrong"
}

export default function HomePage() {
    const [username, setUsername] = useState("");
    const [lobbyId, setLobbyId] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleJoin() {
        try {
            setError("");
            const data = await joinLobby(lobbyId, username);

            sessionStorage.setItem("playerId", data.playerId);
            sessionStorage.setItem("username", username);

            navigate(`/lobby/${data.lobbyId}`);
        } catch (err: any) {
            console.log("Failure to join");
            // alert(err);
            setError(getErrorMessage(err));
        }
    }

    async function handleCreate() {
        try {
            setError("");
            const data = await createLobby(username);

            sessionStorage.setItem("playerId", data.playerId);
            sessionStorage.setItem("username", username);

            navigate(`/lobby/${data.lobbyId}`);
        } catch (err: any) {
            console.log("Failure to create lobby");
            // alert(err);
            setError(getErrorMessage(err));
        }
    }

    return (
        <div className="home-page">
            <div className="home-wrapper">
                <div className="home-hero">
                    <motion.img className="home-logo"
                        src={logo}
                        animate={{
                            scale: [.9, 1.1]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                        }}
                    />
                    <h1 className="light-text">MulImp</h1>
                </div>
                <div className="home-err">
                    <AnimatePresence mode="popLayout">
                        {error && <motion.div
                            layout
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="error-card">{error}</motion.div>}
                    </AnimatePresence>
                </div>
                <div className="home-main">
                    <motion.div layout className="home-user-input">
                        <input
                            className="gray-on-hover"
                            placeholder="Username"
                            value={username}
                            onChange={(event) => {
                                setUsername(event.target.value)
                            }}
                        />
                    </motion.div>
                    <motion.div layout className="home-lobby-input">
                        <input
                            className="gray-on-hover"
                            placeholder="Lobby ID"
                            value={lobbyId}
                            onChange={(event) => {
                                setLobbyId(event.target.value)
                            }}
                        />
                    </motion.div>
                    <motion.div layout className="home-btns">
                        <motion.button onClick={handleCreate}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="home-create-btn dim-hover"
                        >
                            Create
                        </motion.button>
                        <motion.button onClick={handleJoin}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="home-join-btn dim-hover"
                        >
                            Join
                        </motion.button>
                    </motion.div>
                </div>
            </div>
            <footer className="home-footer">
                <div className="home-footer-how-to-grid">
                    <div className="home-footer-card">
                        <h3>1 Premise</h3>
                        <p>
                            MulImp is a social deduction game where players answer a prompt
                            without knowing whether or not they are the imposter, then discuss
                            to figure out whose answer is to a different question than theirs!
                        </p>
                    </div>

                    <div className="home-footer-card">
                        <h3>2 Answering</h3>
                        <p>
                            When you start a game, you will be prompted with a question. Answer
                            the prompt and wait for your friends to give theirs!
                        </p>
                    </div>

                    <div className="home-footer-card">
                        <h3>3 Discussion</h3>
                        <p>
                            Everyone's answer will become public and the REAL question will be released.
                            Everyone beware as this is when you need to quickly gauge whether or not you
                            were the imposter and then try to vote/hide the imposter!
                        </p>
                    </div>
                    
                    <div className="home-footer-card">
                        <h3>4 Results</h3>
                        <p>
                            At the end of the game, there will be a 10 second results screen to see
                            who won and who was the imposter!
                        </p>
                    </div>
                </div>

                <div className="attribution">
                    The owner of this site is not responsible for any user generated
                    content such as usernames or responses
                </div>
            </footer>
        </div>
    )
}