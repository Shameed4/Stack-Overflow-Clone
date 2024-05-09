import React, { useState } from 'react';
import axios from 'axios';
import { validateAndConvertHyperlinks } from '../modules/helper-funtions';

export default function CommentForm({ setMode, obj}) {
    let commentType = "";
    if (obj["tags"])
        commentType = "questions";
    else
        commentType = "answers";
    
    const [commentText, setCommentText] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

        if (!commentText) {
            formIsValid = false;
            errors['commentText'] = `Please enter an comment.`;
        }

        const { isValid } = validateAndConvertHyperlinks(commentText, setErrors, "commentText");
        if (!isValid) {
            formIsValid = false;
            errors["commentText"] = `Hyperlink format is empty or invalid`;
        }

        setErrors(errors);
        return formIsValid;
    };

    const postComment = async () => {
        if (!validateForm()) {
            return;
        }

        const { convertedText } = validateAndConvertHyperlinks(commentText); 

        const commentData = {
            text: convertedText
        };

        try {
            await axios.post(`http://localhost:8000/api/${commentType}/${obj._id}/comments`, commentData);
            // Update the UI based on the response or refetch comments
            console.log("Comment successfully posted");
            // Reset the form fields after posting
            setCommentText('');
            setErrors({});
        } catch (error) {
            console.error('Error posting comment:', error);
        }

        setMode(2);
    };

    return (
        <div className="form commentForm">
            <div className="commentInput" id="commentInput">
                <h2>Comment Text*</h2>
                <textarea
                    name="comment"
                    id="ans"
                    cols="60"
                    rows="15"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
                <br />
                {errors.commentText && (
                    <span className="errorIndicate" style={{ color: 'red' }}>
                        {errors.commentText}
                    </span>
                )}
            </div>
            <div>
                <button onClick={postComment}>Post Comment</button>
                <br />
                <span className="red">* indicates mandatory fields</span>
            </div>
        </div>
    );
}
