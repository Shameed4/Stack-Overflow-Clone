import React, { useState } from 'react';
import { renderNewestQuestions, renderSearchedQuestions } from '../request-functions/request-functions';
import logo from '../images/Fake.svg';

export default function Header({ model, setRenderedQuestions, setMode, user, page, setUser, setPage }) {
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
            <h1><img src={logo} className='logo' alt="Logo" onClick={()=>{setMode(0)}}></img></h1>
            <div className='SearchAndName'>
                {
                    page ? (
                        <input
                            type="text"
                            placeholder="Search..."
                            id="searchBar"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyPress={handleEnterKeyPress}
                        />
                    ) : null
                }
                {
                    user ? (
                        <div className='nameAndLogOut'>
                            <p>{user.name}</p>
                            <a className='logOut' onClick={()=>{
                                setUser(null)
                                setPage(0)
                            }}>Log out</a>
                        </div>
                    ) : null

                }
            </div>
        </div>
    );
}
