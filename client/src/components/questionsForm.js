import React, { useState } from 'react';
import axios from "axios";

export default function QuestionsForm({setMode}) {
    const [title, setTitle] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [tags, setTags] = useState('');
    const [username, setUsername] = useState('');
    const [errors, setErrors] = useState({});

    const validateAndConvertHyperlinks = (text) => {
        let isValid = true;
        let convertedText = text;
        let errors = {};

        let startIndex = 0;
        while (startIndex < convertedText.length) {
            const openBracketIndex = convertedText.indexOf('[', startIndex);
            const closeBracketIndex = convertedText.indexOf(']', openBracketIndex);
            const openParenIndex = convertedText.indexOf('(', closeBracketIndex);
            const closeParenIndex = convertedText.indexOf(')', openParenIndex);

            if (openBracketIndex !== -1 && closeBracketIndex !== -1 && openParenIndex !== -1 && closeParenIndex !== -1 &&
                closeBracketIndex === openParenIndex - 1) {
                const linkText = convertedText.substring(openBracketIndex + 1, closeBracketIndex);
                const linkUrl = convertedText.substring(openParenIndex + 1, closeParenIndex);

                if (linkText === '' || linkUrl === '' || (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://'))) {
                    isValid = false;
                    errors["questionText"] = "Hyperlink format is empty or invalid";
                    break;
                }

                const anchorTag = `<a href="${linkUrl}" target="_blank">${linkText}</a>`;
                convertedText = convertedText.substring(0, openBracketIndex) + anchorTag + convertedText.substring(closeParenIndex + 1);
                startIndex = openBracketIndex + anchorTag.length;
            } else {
                // No more hyperlinks to process
                break;
            }
        }

        if (!isValid) {
            setErrors(errors);
        }

        return { isValid, convertedText };
    };

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

        if (!username) {
            formIsValid = false;
            errors["username"] = "Please enter a username.";
        }

        const { isValid } = validateAndConvertHyperlinks(questionText);
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
            username,
        };

        try {
            await axios.post('http://localhost:8000/api/questions', questionData);
            // Update the UI based on the response or refetch questions
            setMode(0);

            // Reset the form fields after posting
            setTitle('');
            setQuestionText('');
            setTags('');
            setUsername('');
            setErrors({});
            console.log("question posted succesfully")
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
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /><br></br>
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
                <div className="username" id="questionUsernames">
                    <h2>Username*</h2>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /><br></br>
                    {errors.username && <span className="errorIndicate" style={{color: 'red'}}>{errors.username}</span>}
                </div>
                <div>
                    <button id="postQstnBtn" onClick={postQuestion}>Post Question</button><br></br>
                    <span className="red">* indicates mandatory fields</span>
                </div>
            </div>
        </div>
    );
}
