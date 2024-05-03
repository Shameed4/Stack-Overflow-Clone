import Question from "./question";
import QstnButton from "../askQstnBtn";
import { renderNewestQuestions, renderActiveQuestions, renderUnansweredQuestions } from "../../request-functions/request-functions";

export default function AllPosts({ renderedQuestions, setRenderedQuestions, setVisitedQuestion, setMode, user}) {
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
                {renderedQuestions.map((qstn) => (
                    <Question key={qstn._id} qstn={qstn} visitThisQstn={() => { setVisitedQuestion(qstn); setMode(2) }} />
                ))}
                {renderedQuestions.length === 0 && <h4>No questions found</h4>}
            </div>
        </div>
    );
}
