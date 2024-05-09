import Vote from "./vote"

export default function CommentVote({ com }) {
    return <Vote type="comments" obj={com}></Vote>
}