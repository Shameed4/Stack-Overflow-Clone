import React, { useState } from 'react';
import { renderNewestQuestions, renderSearchedQuestions } from '../request-functions/request-functions';
const logo = require('../images/stcakOverFlowHeader.png');

export default function Header({ model, setRenderedQuestions, setMode, user }) {
    const [searchText, setSearchText] = useState('');

    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const searchText = event.target.value.toLowerCase().trim();

            if (searchText === '') {
                console.log('Search bar is empty.');
                renderNewestQuestions(setRenderedQuestions);
                setMode(0);
            } else {
                console.log('Search text:', searchText);
                renderSearchedQuestions(setRenderedQuestions, searchText);
                setMode(0);
            }
        }
    };

    return (
        <div id="header" className="header">
            <h1><img src={logo} className='logo'></img><span className='stackoverflow'>Fake stack <span className='overflow'>overflow</span></span></h1>
            {
                user && <input
                    type="text"
                    placeholder="Search..."
                    id="searchBar"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyPress={handleEnterKeyPress}
                />
            }
        </div>
    );
}
