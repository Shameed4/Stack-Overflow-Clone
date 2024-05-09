import React, { useEffect, useState } from 'react';
import QstnButton from "../askQstnBtn";
import { timeToString } from "../../modules/helper-funtions";
import { fetchQuestion, fetchAnswers, fetchQstnComments } from "../../request-functions/request-functions";
import QuestionVote from './Voting/questionVote';
import AnswerVote from './Voting/answerVote';

export default function SinglePost({ qstn, setQstn, setMode, user, setObjToComment }) {
    const [answers, setAnswers] = useState([]);
    const [qstnComments, setQstnComments] = useState([]);

    const updateQuestion = async () => {
        setQstn(await fetchQuestion(qstn));
    }

    useEffect(() => {
        fetchAnswers(qstn, setAnswers);
        fetchQstnComments(qstn, setQstnComments);
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

                <div className="comments">
                    <button onClick={() => {
                        setObjToComment(qstn);
                        setMode(6);
                    }
                    }>Comment</button>
                    {qstnComments.map(comment => {
                        return (
                            <div className="comment">
                                <QuestionVote qstn={qstn}></QuestionVote>
                                <span className="answerer">{comment.com_by}</span>
                                <span className="posted-time"> commented {timeToString(comment.com_date_time)}</span>
                                <span>{comment.text}</span>
                            </div>
                        );
                    })}

                    <div className="comment">
                        <QuestionVote qstn={qstn}></QuestionVote>
                        <span className="answerer">{"goat"}</span>
                        <span className="posted-time"> commented {timeToString(Date.now())}</span>
                        <span>Here's my question comment</span>
                    </div>
                </div>
            </div>

            <div id="answers">
                {answers.map(ans => (
                    <div className="answer">
                        <div className="answer-top" key={ans._id}>
                            <div className="answer-description" dangerouslySetInnerHTML={{__html: ans.text}}></div>
                            <div className="column-right">
                                <span className="answerer">{ans.ans_by}</span>
                                <span className="posted-time"> answered {timeToString(ans.ans_date_time)}</span>
                            </div>
                            <AnswerVote ans={ans}></AnswerVote>
                        </div>
                        <div className="comments">
                            <div className="comment">
                                <AnswerVote ans={ans}></AnswerVote>
                                <span className="answerer">{"goat"}</span>
                                <span className="posted-time"> commented {timeToString(Date.now())}</span>
                                <span>Here's my comment</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Console log to check the user state just before rendering the button */}
            {console.log("Current user:", user)}

            {/* Conditional rendering of the "Answer question" button */}
            {
                user && <button id="ansQstnBtn" className="btn" onClick={() => {setMode(4)}}>Answer question</button>
            }

        </div>
    );
}