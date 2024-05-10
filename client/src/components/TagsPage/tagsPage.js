import React, { useEffect, useState } from 'react';
import QstnButton from "../askQstnBtn";
import {fetchTags, fetchQuestionsSet, renderTaggedQuestions} from "../../request-functions/request-functions";

export default function Tags({ setRenderedQuestions, setMode, tagsUser }) {
    const [tags, setTags] = useState([]);
    const [allQuestions, setAllQuestions] = useState([]);

    useEffect(() => {
        const updateTagsAndQuestions = async () => {
            if (tagsUser) {
                let set = new Set(tagsUser.map(tag => tag.name));  // Ensure uniqueness based on tag name
                let uniqueTags = Array.from(set).map(name => ({ name, _id: tagsUser.find(tag => tag.name === name)._id }));
                setTags(uniqueTags);
                console.log(tagsUser);
                fetchQuestionsSet(setAllQuestions);
            } else {
                // Fetch all tags
                fetchTags(setTags);
                fetchQuestionsSet(setAllQuestions);
            }
        };
        updateTagsAndQuestions();
    }, [tagsUser]);

    return (
        <div className="AllTags">
            <div className="tagHeadings">
                <div className='titleAndTags'>
                    <h1>All Tags</h1>
                    <h1>{tags.length} Tags</h1>
                </div>
                <QstnButton setMode={setMode}/>
            </div>
            <div className="tagsAndQuestions">
                {tags.map(t => {
                    let tagQuestions = allQuestions.filter(q => q.tags.includes(t._id));
                    let numTagQuestions = tagQuestions.length;
                    if(numTagQuestions > 0) {
                        return (
                            <div className="tag" key={t._id}>
                                <button className="tagLink" onClick={() => {setMode(0); renderTaggedQuestions(setRenderedQuestions, t._id)}}>{t.name}</button>
                                <h4 className='tagHeading'>{numTagQuestions} Question{numTagQuestions !== 1 ? 's' : ''}</h4>
                            </div>
                        )
                    }
                    else
                        return null;
                })}
            </div>
        </div>
    );
}
