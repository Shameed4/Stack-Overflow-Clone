import React from 'react';
import AllPosts from './AllPosts/allPosts';
import Tags from './TagsPage/tagsPage';
import SinglePost from './SinglePost/singlePost';
import QuestionsForm from "./questionsForm";
import AnswerForm from "./answerForm";

export default function Col2({ mode, setMode, renderedQuestions, setRenderedQuestions, visitedQuestion, setVisitedQuestion, user}) {
    return (
        <div id="col2">
            {
                (() => {
                    switch (mode) {
                        case 0:
                            return <AllPosts renderedQuestions={renderedQuestions} setRenderedQuestions={setRenderedQuestions} setMode={setMode} setVisitedQuestion={setVisitedQuestion} user={user}/>;
                        case 1:
                            return <Tags setRenderedQuestions={setRenderedQuestions} setMode={setMode}/>;
                        case 2:
                            return <SinglePost qstn={visitedQuestion} setMode={setMode} user={user}/>
                        case 3:
                            return <QuestionsForm setMode={setMode} setRenderedQuestions={setRenderedQuestions} user={user}/>
                        case 4:
                            return <AnswerForm setMode={setMode} qstn={visitedQuestion} setVisitedQuestion={setVisitedQuestion} user={user}/>
                        default:
                            return null; // Handle default case if needed
                    }
                })()
            }
        </div>
    );
}
