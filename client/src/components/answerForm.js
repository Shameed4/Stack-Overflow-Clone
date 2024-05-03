import React, { useState } from 'react';
import axios from 'axios';
export default function AnswerForm({ setMode, qstn, setVisitedQuestion, user}) {
    const username = user.username;
    const [answerText, setAnswerText] = useState('');
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
                    errors["answerText"] = "Hyperlink format is empty or invalid";
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

        if (!username) {
            formIsValid = false;
            errors['username'] = 'Please enter a username.';
        }

        if (!answerText) {
            formIsValid = false;
            errors['answerText'] = 'Please enter an answer.';
        }

        const { isValid } = validateAndConvertHyperlinks(answerText);
        if (!isValid) {
            formIsValid = false;
            errors["answerText"] = `Hyperlink format is empty or invalid`;
        }

        setErrors(errors);
        return formIsValid;
    };

    const postAnswer = async () => {
        if (!validateForm()) {
            return;
        }

        const { convertedText } = validateAndConvertHyperlinks(answerText);

        const answerData = {
            text: convertedText,
            username,
        };

        try {
            await axios.post(`http://localhost:8000/api/questions/${qstn._id}/answers`, answerData);
            // Update the UI based on the response or refetch answers

            // Reset the form fields after posting
            setAnswerText('');
            setErrors({});
        } catch (error) {
            console.error('Error posting answer:', error);
        }

        const updatedQuestion = await axios.get(`http://localhost:8000/api/questions/${qstn._id}`);
        setVisitedQuestion(updatedQuestion.data);
        setMode(2);
    };

    return (
        <div className="form answerForm">
            {/*<div className="username" id="answerUsername">*/}
            {/*    <h2>Username*</h2>*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        value={username}*/}
            {/*        onChange={(e) => setUsername(e.target.value)}*/}
            {/*    />*/}
            {/*    <br />*/}
            {/*    {errors.username && (*/}
            {/*        <span className="errorIndicate" style={{ color: 'red' }}>*/}
            {/*            {errors.username}*/}
            {/*        </span>*/}
            {/*    )}*/}
            {/*</div>*/}
            <div className="answerInput" id="answerInput">
                <h2>Answer Text*</h2>
                <textarea
                    name="answer"
                    id="ans"
                    cols="60"
                    rows="15"
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                ></textarea>
                <br />
                {errors.answerText && (
                    <span className="errorIndicate" style={{ color: 'red' }}>
                        {errors.answerText}
                    </span>
                )}
            </div>
            <div>
                <button onClick={postAnswer}>Post Answer</button>
                <br />
                <span className="red">* indicates mandatory fields</span>
            </div>
        </div>
    );
}
