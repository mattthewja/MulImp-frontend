import { motion, AnimatePresence } from 'motion/react'

type PlayerListProps = {
    players: string[] | null
}

export default function PlayerList(props: PlayerListProps) {
    if (!props.players) return null;

    return (
        <div className="game-player-wrapper">
            <AnimatePresence initial={false}>
                {props.players.map((p: string) => (
                    <motion.div
                        key={p}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        <motion.div className="game-player-card"
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
                            <p className="game-player-card-text">{p}</p>
                        </motion.div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}