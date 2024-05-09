import React, { useEffect, useState } from 'react';
import QstnButton from "../askQstnBtn";
import timeToString from "../../modules/timeToString";
import { fetchAnswers } from "../../request-functions/request-functions";
import QuestionVote from './questionVote';

export default function SinglePost({ qstn, setMode, user }) {
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        fetchAnswers(qstn, setAnswers);
    }, [qstn]);

    return (
        <div id="singlePostPage">
            <div id="postQuestionInfo">
                <div id="postTop1">
                    <span className="answerCount bold">{qstn.answers.length} answer{qstn.answers.length !== 1 ? 's' : ''}</span>
                    <span id="question-title" className="bold">{qstn.title}</span>
                    <span className="btn-container"><QstnButton setMode={setMode}/></span>
                </div>

                <div id="postTop2">
                    <span className="viewCount bold">{qstn.views} view{qstn.views !== 1 ? 's' : ''}</span>
                    <div className="question-description" dangerouslySetInnerHTML={{__html: qstn.text}}></div>
                    <div id="askedInfo" className="column-right">
                        <span className="asker">{qstn.asked_by}</span>
                        <span className="posted-time"> asked {timeToString(qstn.ask_date_time)}</span>
                        <QuestionVote qstn={qstn} user={user}></QuestionVote>
                    </div>
                </div>
            </div>

            <div id="answers">
                {answers.map(ans => (
                    <div className="answer" key={ans._id}>
                        <div className="answer-description" dangerouslySetInnerHTML={{__html: ans.text}}></div>
                        <div className="column-right">
                            <span className="answerer">{ans.ans_by}</span>
                            <span className="posted-time"> answered {timeToString(ans.ans_date_time)}</span>
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
