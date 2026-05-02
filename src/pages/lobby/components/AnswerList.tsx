type answer = {
    username: string,
    answer: string
}

type AnswerListProps = {
    answers: answer[] | null
}

export default function AnswerList({ answers }: AnswerListProps) {
    if (!answers) return null;

    return (<>
        {answers.map((answer) => (
            <div className="game-answer-card" key={answer.username}>
                <strong>{answer.username}</strong>
                <p>{answer.answer}</p>
            </div>
        ))}
    </>)
}