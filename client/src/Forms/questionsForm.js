import React, { useState, useEffect } from 'react';
import axios from "axios";
import {renderNewestQuestions} from "../request-functions/request-functions"
import { validateAndConvertHyperlinks } from '../modules/helper-funtions';

export default function QuestionsForm({setMode, setRenderedQuestions, question}) {
    const [title, setTitle] = useState(question ? question.title : '');
    const [questionText, setQuestionText] = useState(question ? question.text : '');
    const [tags, setTags] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (question && question.tags) {
            fetchTagNames(question.tags);
        }
    }, [question]);

    const fetchTagNames = async (tagIds) => {
        try {
            const tagPromises = tagIds.map(tid => axios.get(`http://localhost:8000/api/tags/${tid}`));
            const tagResponses = await Promise.all(tagPromises);
            const tagNames = tagResponses.map(response => response.data.name);
            setTags(tagNames.join(' '));
        } catch (error) {
            console.error('Failed to fetch tags:', error);
            setErrors(prev => ({ ...prev, tags: 'Failed to load tags' }));
        }
    };

    console.log(question);


    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

        let splitTags = tags.toLowerCase().split(" ").filter(tag => tag.length > 0);

        if (!title) {
            formIsValid = false;
            errors["title"] = "Please enter a title.";
        }

        if (title.length > 100) {
            formIsValid = false;
            errors["title"] = "Title must be 100 characters or less.";
        }

        if (!questionText) {
            formIsValid = false;
            errors["questionText"] = "Please enter a description.";
        }

        if (splitTags.some(t => t.length > 20)) {
            formIsValid = false;
            errors["tags"] = "Tag must be 20 characters or less.";
        }

        if (splitTags.length < 1 || splitTags.length > 5) {
            formIsValid = false;
            errors["tags"] = "Please enter between 1 and 5 tags.";
        }

        const { isValid } = validateAndConvertHyperlinks(questionText, setErrors, "questionsText");
        if (!isValid) {
            formIsValid = false;
            errors["questionText"] = `Hyperlink format is empty or invalid`;
        }

        setErrors(errors);
        return formIsValid;
    };

    const postQuestion = async () => {
        if (!validateForm()) {
            return;
        }

        const { convertedText } = validateAndConvertHyperlinks(questionText);

        const questionData = {
            title,
            text: convertedText,
            tags: tags.toLowerCase().split(" ").filter(tag => tag.length > 0),
            _id: question ? question._id : null,
        };

        try {
            await axios.post('http://localhost:8000/api/questions', questionData);
            // Update the UI based on the response or refetch questions
            await renderNewestQuestions(setRenderedQuestions); // Pass setRenderedQuestions to update the parent's state
            setMode(0);

            // Reset the form fields after posting
            setTitle('');
            setQuestionText('');
            setTags('');
            setErrors({});
            console.log("question posted successfully")
        } catch (error) {
            console.error('Error posting question:', error);
        }
    };


    return (
        <div className="form questionForm">
            <div className="form questionForm">
                <div className="title" id="questionsTitle">
                    <h2>Question Title*</h2>
                    <h6>Limit title to 100 characters or less</h6>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className='QUESTIONTITLE'/><br></br>
                    {errors.title && <span className="errorIndicate" style={{color: 'red'}}>{errors.title}</span>}
                </div>
                <div className="questionInput" id="questionInput">
                    <h2>Question Text*</h2>
                    <h6>Add details</h6>
                    <textarea name="question" id="ques" cols="60" rows="15" value={questionText}
                              onChange={(e) => setQuestionText(e.target.value)}></textarea><br></br>
                    {errors.questionText &&
                        <span className="errorIndicate" style={{color: 'red'}}>{errors.questionText}</span>}
                </div>
                <div className="tags" id="questionTags">
                    <h2>Tags*</h2>
                    <h6>Add keywords separated by whitespace.</h6>
                    <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}/><br></br>
                    {errors.tags && <span className="errorIndicate" style={{color: 'red'}}>{errors.tags}</span>}
                </div>
                <div>
                    <button id="postQstnBtn" onClick={postQuestion}>Post Question</button><br></br>
                    <span className="red">* indicates mandatory fields</span>
                </div>
            </div>
        </div>
    );
}
