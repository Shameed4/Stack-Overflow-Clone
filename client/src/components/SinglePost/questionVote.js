import Vote from "./vote"

export default function QuestionVote({ qstn }) {
    return <Vote type="questions" obj={qstn}></Vote>
}