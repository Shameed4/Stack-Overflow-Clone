import React, { useEffect, useState } from 'react';
import { timeToString } from "../../modules/helper-funtions";
import { renderQuestionTagNames, handleQuestionClick } from "../../request-functions/request-functions";

export default function Question({ qstn, visitThisQstn }) {
    const [tagNames, setTagNames] = useState([]);
    useEffect(() => {
        renderQuestionTagNames(qstn, setTagNames);
    }, [qstn]);

    return (
        <div className="question">
            <div className="question-left">
                <span className="answerCount">{qstn.answers.length} answer{qstn.answers.length !== 1 ? 's' : ''}</span><br />
                <span className="viewCount">{qstn.views} view{qstn.views !== 1 ? 's' : ''}</span>
            </div>
            <div className="question-mid">
                <span className="question-title" onClick={()=>{handleQuestionClick(visitThisQstn, qstn)}}>{qstn.title}</span><br></br>
                <span className="questions-summary">{qstn.text}</span>
                <div className="tag-list">
                    {tagNames.map((tagName, index) => (
                        <span className="tag" key={index}>{tagName}</span>
                    ))}
                </div>
            </div>
            <div className="question-right">
                <span className="asker">{qstn.asked_by} </span>
                <span className="posted-time">asked {timeToString(qstn.ask_date_time)}</span>
            </div>
        </div>
    );
}
