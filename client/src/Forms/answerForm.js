import React, { useState } from 'react';
import axios from 'axios';
import { validateAndConvertHyperlinks } from '../modules/helper-funtions';

export default function AnswerForm({ setMode, qstn, setVisitedQuestion, user}) {
    const [answerText, setAnswerText] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

        if (!answerText) {
            formIsValid = false;
            errors['answerText'] = 'Please enter an answer.';
        }

        const { isValid } = validateAndConvertHyperlinks(answerText, setErrors, "answerText");
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
            text: convertedText
        };

        try {
            await axios.post(`http://localhost:8000/api/questions/${qstn._id}/answers`, answerData);
            // Update the UI based on the response or refetch answers
            console.log("Answer successfully posted");
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
