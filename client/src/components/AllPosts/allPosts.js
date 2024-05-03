import React, { useState } from 'react';
import Question from "./question";
import QstnButton from "../askQstnBtn";
import { renderNewestQuestions, renderActiveQuestions, renderUnansweredQuestions } from "../../request-functions/request-functions";

export default function AllPosts({ renderedQuestions, setRenderedQuestions, setVisitedQuestion, setMode, user}) {
    const [currentPage, setCurrentPage] = useState(0);
    const questionsPerPage = 5;

    const lastQuestionIndex = (currentPage + 1) * questionsPerPage;
    const firstQuestionIndex = lastQuestionIndex - questionsPerPage;
    const currentQuestions = renderedQuestions.slice(firstQuestionIndex, lastQuestionIndex);

    const handleNext = () => {
        const nextPage = currentPage + 1;
        if (lastQuestionIndex < renderedQuestions.length) {
            setCurrentPage(nextPage);
        }
    };

    const handlePrev = () => {
        const prevPage = currentPage - 1;
        if (prevPage >= 0) {
            setCurrentPage(prevPage);
        }
    };

    return (
        <div className="AllPosts">
            <div id="questionsGrid">
                <h2 className='AllQuestions'>All Questions</h2>
                <div className="right-align">
                    <QstnButton setMode={setMode} user={user}/>
                </div>
                <span id="questionCount">{renderedQuestions.length} question{renderedQuestions.length === 1 ? '' : 's'}</span>
                <div className="right-align sortButtonsOut">
                    <div className='sortButtons'>
                        <button id="newestBtn" onClick={() => renderNewestQuestions(setRenderedQuestions)}>Newest</button>
                        <button id="activeBtn" onClick={() => renderActiveQuestions(setRenderedQuestions)}>Active</button>
                        <button id="unansweredBtn" onClick={() => renderUnansweredQuestions(setRenderedQuestions)}>Unanswered</button>
                    </div>
                </div>
            </div>
            <div id="questions">
                {currentQuestions.map((qstn) => (
                    <Question key={qstn._id} qstn={qstn} visitThisQstn={() => { setVisitedQuestion(qstn); setMode(2) }} />
                ))}
                {currentQuestions.length === 0 && <h4>No questions found</h4>}
            </div>
            {
                renderedQuestions.length > 5 ? (
                    <div className="pagination-buttons">
                        <div className='prevAndNext'>
                            <button disabled={currentPage === 0} onClick={handlePrev}>Prev</button>
                            <button disabled={lastQuestionIndex >= renderedQuestions.length} onClick={handleNext}>Next
                            </button>
                        </div>
                    </div>

                ): null
            }
        </div>
    );
}
