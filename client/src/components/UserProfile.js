import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { timeToString } from "../modules/helper-funtions";  // Corrected typo in filename
import AllPosts from "./AllPosts/allPosts";
import Tags from "../components/TagsPage/tagsPage";

export default function UserProfile({ setMode, visitedQuestion, setVisitedQuestion, userToView, signedInuser, renderedQuestions, setRenderedQuestions }) {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [tags, setTags] = useState([]);
    console.log("User to view in user page", userToView);
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/users/${userToView.username}/details`);
                setQuestions(response.data.questions);
                setAnswers(response.data.answers);
                setTags(response.data.tags);// Use the directly fetched questions
                console.log(response.data);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
                setRenderedQuestions([]); // Assuming you want to clear or handle error state
            }
        };

        if (userToView && userToView.username) {
            fetchUserDetails();
        }
    }, [userToView]); // Include setRenderedQuestions in the dependency array if it's not stable

    return (
        <div className='profile-container'>
            <h1 className='ProfileName'>{userToView.name}</h1>
            <span className='since'>Since: {timeToString(userToView.since)}</span>
            <div className='UserQuestions'>
                <div>
                    <h2 className='userQuestions'>Questions asked by the user:</h2>
                    <AllPosts renderedQuestions={questions} setRenderedQuestions={setRenderedQuestions}
                              setVisitedQuestion={setVisitedQuestion} setMode={setMode} user={userToView}/>
                    <h2>Questions answered by the user:</h2>
                    <AllPosts renderedQuestions={answers} setRenderedQuestions={setRenderedQuestions}
                              setVisitedQuestion={setVisitedQuestion} setMode={setMode} user={userToView}/>
                    <h2>All the tags created by the user:</h2>
                    <Tags setRenderedQuestions={setRenderedQuestions} setMode={setMode} tagsUser={tags}/>
                </div>
            </div>
        </div>
    );
}
