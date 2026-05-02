import { motion } from 'motion/react'

type answer = {
    username: string,
    answer: string
}

type AnswerListProps = {
    answers: answer[] | null,
    onVote: (playerName: string) => void,
    hasVoted: boolean
}

export default function AnswerList({ answers, onVote, hasVoted }: AnswerListProps) {
    if (!answers) return null;

    return (<div className="game-answer-grid">
        {answers.map((answer) => (
            <div className="game-answer-card" key={answer.username}>
                <p>"<strong>{answer.username}</strong>"</p>
                <p className="game-answer-text">{answer.answer}</p>
                <motion.button className="game-vote-btn dim-hover"
                    whileTap={{ scale: 0.9 }}
                    key={answer.username}
                    disabled={hasVoted === true}
                    onClick={() => onVote(answer.username)}
                >
                    vote <strong>"{answer.username}"</strong>
                </motion.button>
            </div>
        ))}
    </div>)
}