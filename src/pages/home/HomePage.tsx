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
        <div className="home-wrapper">
            <div className="home-hero">
                <motion.img src={logo}
                    animate={{
                        x: [-5, 5],
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
                    className="home-create"
                >
                    Create
                </motion.button>
                <motion.button onClick={handleJoin}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="home-join"
                >
                    Join
                </motion.button>
            </motion.div>
        </div>
    )
}