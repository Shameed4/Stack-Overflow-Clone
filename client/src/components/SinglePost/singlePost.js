import React, { useEffect, useState } from 'react';
import QstnButton from "../askQstnBtn";
import { timeToString } from "../../modules/helper-funtions";
import { fetchQuestion, fetchAnswers, fetchComments } from "../../request-functions/request-functions";
import QuestionVote from './Voting/questionVote';
import AnswerVote from './Voting/answerVote';
import CommentCollection from './commentCollection';
import Pagination from '../pagination';

export default function SinglePost({ qstn, setQstn, setMode, user, setObjToComment, setEditQuestion, setEditAnswer}) {
    const [answers, setAnswers] = useState([]);
    const [qstnComments, setQstnComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageAnswers, setCurrentPageAnswers] = useState([]);
    console.log("Question", qstn);

    const updateQuestion = async () => {
        setQstn(await fetchQuestion(qstn));
        fetchAnswers(qstn, setAnswers);
        fetchComments(qstn, setQstnComments);
    }

    useEffect(() => {
        updateQuestion();
    }, []);

    return (
        <div id="singlePostPage">
            <div id="questionAndComments">
                <div id="postQuestionInfo">
                    <div id="postTop1">
                        <span className="answerCount bold">{qstn.answers.length} answer{qstn.answers.length !== 1 ? 's' : ''}</span>
                        <span id="question-title" className="bold">{qstn.title}</span>
                        <span className="btn-container"><QstnButton setMode={setMode}/></span>
                        {user.username === qstn.asked_by ?
                            <button onClick={()=>{
                                setMode(3);
                                setEditQuestion(qstn);
                            }}
                            >Edit</button>
                            : null}
                    </div>

                    <div id="postTop2">
                        <div>
                            <span className="viewCount bold">{qstn.views} view{qstn.views !== 1 ? 's' : ''}</span>
                            <QuestionVote qstn={qstn}/>
                        </div>

                        <div className="question-description" dangerouslySetInnerHTML={{__html: qstn.text}}></div>
                        <div id="askedInfo" className="column-right">
                            <span className="asker">{qstn.asked_by}</span>
                            <span className="posted-time"> asked {timeToString(qstn.ask_date_time)}</span>
                        </div>
                    </div>
                </div>
                <CommentCollection obj={qstn} setObjToComment={setObjToComment} setMode={setMode}></CommentCollection>
            </div>

            <div id="answers">
                {currentPageAnswers.map(ans => (
                    <div className="answer">
                        <div className="answer-top" key={ans._id}>
                            <div className="answer-description" dangerouslySetInnerHTML={{__html: ans.text}}></div>
                            <div className="column-right">
                                <span className="answerer">{ans.ans_by}</span>
                                <span className="posted-time"> answered {timeToString(ans.ans_date_time)}</span>
                            </div>
                            <AnswerVote ans={ans}></AnswerVote>
                        </div>
                        <CommentCollection obj={ans} setObjToComment={setObjToComment}
                                           setMode={setMode}></CommentCollection>
                        {
                            user.username === ans.ans_by ? <button onClick={()=>{
                                setMode(4)
                                setEditAnswer(ans)
                            }}>Edit</button> : null
                        }
                    </div>
                ))}
            </div>

            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} setLoadedItems={setCurrentPageAnswers} allItems={answers} itemsPerPage={5}></Pagination>

            {/* Console log to check the user state just before rendering the button */}
            {console.log("Current user:", user)}

            {/* Conditional rendering of the "Answer question" button */}
            {
                user && <button id="ansQstnBtn" className="btn" onClick={() => {setMode(4)}}>Answer question</button>
            }

        </div>
    );
}
