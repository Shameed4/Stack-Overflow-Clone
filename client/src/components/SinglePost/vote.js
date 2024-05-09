import { useState, useEffect } from "react"
import { getRating, getUserVote, toggleUserDownvote, toggleUserUpvote } from "../../request-functions/request-functions";

export default function Vote({ type, obj }) {
    const [ userRated, setUserRated ] = useState(0); // -1 if downvoted, 0 if unrated, 1 if upvoted
    const [ totalRated, setTotalRated ] = useState(0);

    async function fetchData() {
        try {
            const rating = await getRating(type, obj);
            setTotalRated(rating);
            const userVote = await getUserVote(type, obj);
            setUserRated(userVote);
        } catch (error) {
            console.error("Error fetching rating:", error);
        }
    }

    const upvoteClick = () => {
        toggleUserUpvote(type, obj);
        fetchData();
    }

    const downvoteClick = () => {
        toggleUserDownvote(type, obj);
        fetchData();
    }

    useEffect(() => {
        fetchData();
    });

    return (
    <div className='votingButtons'>
        <button onClick={upvoteClick}>Up</button>
        <span className='rank'>{totalRated}</span>
        <button onClick={downvoteClick}>Down</button>
    </div>
    )
}
