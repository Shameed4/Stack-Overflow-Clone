import { useState, useEffect } from "react"
import { toggleUpvote, toggleDownvote, getQstnRating, getUserQstnVote } from "../../request-functions/request-functions";

export default function Vote({ qstn, user }) {
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
        toggleUpvote(qstn, user);
        fetchData();
    }

    const downvoteClick = () => {
        toggleDownvote(qstn, user);
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
