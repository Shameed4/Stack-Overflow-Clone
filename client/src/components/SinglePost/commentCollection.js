import { useEffect, useState } from "react"
import { fetchComments } from "../../request-functions/request-functions";
import { timeToString } from "../../modules/helper-funtions";
import CommentVote from "./Voting/commentVote";

export default function CommentCollection({ obj, setObjToComment, setMode }) {
    const [comments, setComments] = useState([]);
    useEffect(() => {
        fetchComments(obj, setComments);
        console.log("Obj", obj);
    }, [])
    
    return (
        <div className="comments">
            <button onClick={() => {
                setObjToComment(obj);
                setMode(6);
            }}>Comment</button>
            
            {comments.map(comment => {
                return (
                    <div className="comment">
                        <CommentVote com={comment}></CommentVote>
                        <span className="answerer">{comment.com_by}</span>
                        <span className="posted-time"> commented {timeToString(comment.com_date_time)}</span>
                        <span>{comment.text}</span>
                    </div>
                );
            })}
        </div>
    )
}