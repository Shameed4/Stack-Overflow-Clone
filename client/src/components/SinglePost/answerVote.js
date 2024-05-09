import { useState, useEffect } from "react"
import { toggleAnswerUpvote, toggleAnswerDownvote, getAnswerRating, getAnswerQstnVote } from "../../request-functions/request-functions";

export default function AnswerVote({ ans, user }) {
    const [ userRated, setUserRated ] = useState(0); // -1 if downvoted, 0 if unrated, 1 if upvoted
    const [ totalRated, setTotalRated ] = useState(0);

    async function fetchData() {
        try {
            const rating = await getQstnRating(qstn);
            setTotalRated(rating);
            const userVote = await getUserQstnVote(qstn);
            console.log("User vote:", userVote);
            setUserRated(userVote);
        } catch (error) {
            console.error("Error fetching question rating:", error);
        }
    }

    const upvoteClick = () => {
        toggleQstnUpvote(qstn, user);
        fetchData();
    }

    const downvoteClick = () => {
        toggleQstnDownvote(qstn, user);
        fetchData();
    }
    
    useEffect(() => {
        fetchData();
    });

    return (
    <>
        <button onClick={upvoteClick}>Upvote</button>
        <span>{totalRated}</span>
        <button onClick={downvoteClick}>Downvote</button>
    </>
    )
}