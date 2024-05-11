import { useEffect, useState } from "react"
import { fetchComments } from "../../request-functions/request-functions";
import { timeToString } from "../../modules/helper-funtions";
import CommentVote from "./Voting/commentVote";
import Pagination from "../pagination";

export default function CommentCollection({ obj, setObjToComment, setMode }) {
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageComments, setCurrentPageComments] = useState([]);

    useEffect(() => {
        fetchComments(obj, setComments);
    }, []);
    
    return (
        <div className="comments">
            <button onClick={() => {
                setObjToComment(obj);
                setMode(6);
            }}>Comment</button>
            
            {currentPageComments.map(comment => {
                return (
                    <div className="comment">
                        <CommentVote com={comment}></CommentVote>
                        <span>
                            <span className="answerer"> {comment.com_by} </span>
                            <span className="posted-time">commented {timeToString(comment.com_date_time)} </span>
                        </span>
                        <span className="commentText">{comment.text}</span>
                    </div>
                );
            })}
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} setLoadedItems={setCurrentPageComments} allItems={comments} itemsPerPage={3}></Pagination>
        </div>
    )
}