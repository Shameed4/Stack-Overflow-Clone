import axios from "axios";

export const fetchAnswers = async (qstn, setAnswers) => {
    try {
        const answersPromises = qstn.answers.map(answerId =>
            axios.get(`http://localhost:8000/api/answers/${answerId}`)
        );
        const answersResponses = await Promise.all(answersPromises);
        const fetchedAnswers = answersResponses.map(response => response.data);
        setAnswers(fetchedAnswers);
    } catch (error) {
        console.error('Error fetching answers:', error);
    }
};

export const fetchQuestions = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/questions/');
        return response.data;
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

export const renderNewestQuestions = async setRenderedQuestions => {
    try {
        const response = await axios.get('http://localhost:8000/api/questions');
        console.log(response.data)
        setRenderedQuestions(response.data.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time)));
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
};

export const renderActiveQuestions = async setRenderedQuestions => {
    try {
        const response = await axios.get('http://localhost:8000/api/questions');
        const questions = await Promise.all(response.data.map(async question => {
            const answerObjects = await Promise.all(
                question.answers.map(async answerId => await axios.get(`http://localhost:8000/api/answers/${answerId}`))
            );
            const lastActivity = Math.max(...answerObjects.map(ans => new Date(ans.data.ans_date_time)))
            return { ...question, lastActivity: lastActivity };
        }));
        setRenderedQuestions(questions.sort((a, b) => {
            if (b.answers.length === 0)
                return -1;
            if (a.answers.length === 0)
                return 1;
            console.log(b.lastActivity - a.lastActivity);
            return b.lastActivity - a.lastActivity;
        }));
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

export const renderUnansweredQuestions = async setRenderedQuestions => {
    try {
        const response = await axios.get('http://localhost:8000/api/questions');
        console.log(response.data)
        setRenderedQuestions(response.data.filter(a => a.answers.length === 0));
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
};

export const renderTaggedQuestions = async (setRenderedQuestions, tagId) => {
    console.log("Fetch by tag", tagId)
    try {
        const response = await axios.get('http://localhost:8000/api/questions');
        const questions = response.data;
        const filteredQuestions = questions.filter(q => q.tags.some(t => t === tagId));
        console.log("Filtered questions:", filteredQuestions);
        setRenderedQuestions(filteredQuestions);
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
};

export const renderSearchedQuestions = async (setRenderedQuestions, keyword) => {
    const questions = await fetchQuestions();
    const searchResults = new Set();
    let keywords = keyword.split(" ");

    for (const kw of keywords) {
        let isTag = kw.includes('[') && kw.includes(']');
        let formattedKw = isTag ? kw.replace(/[\[\]]/g, '') : kw.toLowerCase();
        console.log("Keyword", kw, formattedKw);

        for (const question of questions) {
            if (searchResults.has(question))
                continue;

            if (isTag) {
                const questionTagNames = await fetchQuestionTagNames(question);
                if (questionTagNames.includes(formattedKw)) {
                    console.log("Tag", formattedKw, "Found in", questionTagNames);
                    searchResults.add(question);
                }
                else {
                    console.log("Tag", formattedKw, "Not found in", questionTagNames);
                }
            } else {
                console.log(question);
                if (question.title.toLowerCase().includes(formattedKw) || question.text.toLowerCase().includes(formattedKw)) {
                    searchResults.add(question);
                }
            }
        }
    }
    console.log(searchResults);
    setRenderedQuestions(Array.from(searchResults));
};

export const fetchTags = async (setTags) => {
    try {
        const tagsResponse = await axios.get('http://localhost:8000/api/tags');
        setTags(tagsResponse.data);
        console.log(tagsResponse.data)
    } catch (error) {
        console.error('Error fetching tags:', error);
    }
};

// Fetch all questions
export const fetchQuestionsSet = async (setAllQuestions) => {
    try {
        const questionsResponse = await axios.get('http://localhost:8000/api/questions');
        setAllQuestions(questionsResponse.data);
        console.log(questionsResponse.data)
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
};

export const fetchQuestionTagNames = async qstn => {
    const names = await Promise.all(qstn.tags.map(async (tagId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/tags/${tagId}`);
            return response.data.name;
        } catch (error) {
            console.error('Error fetching tag name:', error);
            return tagId; // Fallback to showing the tag ID if the name can't be fetched
        }
    }));
    return names;
}

export const renderQuestionTagNames = async (qstn, setTagNames) => {
    const names = await fetchQuestionTagNames(qstn);
    setTagNames(names);
};

export const handleQuestionClick = async (visitThisQstn, qstn) => {
    try {
        await axios.patch(`http://localhost:8000/api/questions/${qstn._id}/increment-views`);
        visitThisQstn(); // Call the visitThisQstn function to navigate to the question
    } catch (error) {
        console.error('Error incrementing views:', error);
    }
};

export const getQstnRating = async qstn => {
    try {
        console.log(qstn);
        const votes = await axios.get(`http://localhost:8000/api/questions/${qstn._id}/votes`);
        return votes.data;
    } catch (error) {
        console.error('Error finding rating', error)
        return -Infinity;
    }
}

export const getUserQstnVote = async qstn => {
    try {
        const vote = await axios.get(`http://localhost:8000/api/questions/${qstn._id}/votes/user`);
        console.log("User voted", vote);
        return vote.data;
    } catch (error) {
        console.error("Failed to check user vote", error);
        return 0;
    }
}

export const toggleUpvote = async qstn => {
    try {
        await axios.patch(`http://localhost:8000/api/questions/${qstn._id}/votes/toggle-upvote`);
        return true;
    } catch (error) {
        console.error('Error toggling upvote', error)
        return false;
    }
}

export const toggleDownvote = async qstn => {
    try {
        await axios.patch(`http://localhost:8000/api/questions/${qstn._id}/votes/toggle-downvote`);
        return true;
    } catch (error) {
        console.error('Error toggling downvote', error)
        return false;
    }
}