import React from 'react';
import { useState } from 'react';
import AllPosts from './AllPosts/allPosts';
import Tags from './TagsPage/tagsPage';
import SinglePost from './SinglePost/singlePost';
import QuestionsForm from "../Forms/questionsForm";
import AnswerForm from "../Forms/answerForm";
import UserProfile from './UserProfile';
import CommentForm from '../Forms/commentForm';
import AdminPage from './AdminPage/adminPage';

export default function Col2({ mode, setMode, renderedQuestions, setRenderedQuestions, visitedQuestion, setVisitedQuestion, user, userToView, setUserToView}) {
    const [objToComment, setObjToComment] = useState(null);
    const [editQuestion, setEditQuestion] = useState(null);
    const [editAnswer, setEditAnswer] = useState(null);
    console.log("Setting user to view on col2 page", setUserToView);
    console.log("Signed in user on col2 page", user);
    console.log("User to view on col2 page", userToView);

    return (
        <div id="col2">
            {
                (() => {
                    switch (mode) {
                        case -1:
                            return <AdminPage signedInUser={user} setUserToView={setUserToView} setMode={setMode}></AdminPage>
                        case 0:
                            return <AllPosts renderedQuestions={renderedQuestions} setRenderedQuestions={setRenderedQuestions} setMode={setMode} setVisitedQuestion={setVisitedQuestion} user={user}/>;
                        case 1:
                            return <Tags setRenderedQuestions={setRenderedQuestions} setMode={setMode}/>;
                        case 2:
                            return <SinglePost qstn={visitedQuestion} setQstn={setVisitedQuestion} setMode={setMode} user={user} setObjToComment={setObjToComment} setEditQuestion={setEditQuestion} setEditAnswer={setEditAnswer}/>
                        case 3:
                            return <QuestionsForm setMode={setMode} setRenderedQuestions={setRenderedQuestions} user={user} question={editQuestion}/>
                        case 4:
                            return <AnswerForm setMode={setMode} qstn={visitedQuestion} setVisitedQuestion={setVisitedQuestion} user={user} editAnswer={editAnswer}/>
                        case 5:
                            return <UserProfile setMode={setMode} qstn={visitedQuestion} setVisitedQuestion={setVisitedQuestion} userToView={userToView} signedInUser={user} renderedQuestions={renderedQuestions} setRenderedQuestions={setRenderedQuestions}/>;
                        case 6:
                            return <CommentForm setMode={setMode} obj={objToComment} qstn={visitedQuestion} setVisitedQuestion={setVisitedQuestion}></CommentForm>
                        default:
                            return null; // Handle default case if needed
                    }
                })()
            }
        </div>
    );
}
