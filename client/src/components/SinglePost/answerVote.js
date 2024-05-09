import Vote from "./vote"

export default function AnswerVote({ ans }) {
    return <Vote type="answers" obj={ ans }></Vote>
}