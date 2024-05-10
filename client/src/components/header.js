import React, { useState } from 'react';
import { renderNewestQuestions, renderSearchedQuestions } from '../request-functions/request-functions';
import logo from '../images/Fake.svg';
import axios from "axios";
axios.defaults.withCredentials = true;

export default function Header({ model, setRenderedQuestions, setMode, user, page, setUser, setPage, isOnline, setIsOnline }) {
    const [searchText, setSearchText] = useState('');

    const handleLogout = () => {
        axios.get('http://localhost:8000/logout')  // using GET, switch to axios.post if needed
            .then(() => {
                setUser(null);  // Set user state to null
                setPage(0);     // Reset the page state
                console.log("Logged out!")
            })
            .catch(error => console.error('Logout failed', error));
    };



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
            {
                !isOnline &&
                <div className="independent-element">Please check your internet connection! Connection Timeout.</div>
            }
            <h1><img src={logo} className='logo' alt="Logo" onClick={() => {
                setMode(0)
            }}></img></h1>

            <div className='SearchAndName'>
                {

                    page? (
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
                            <p onClick={()=>{setMode(5)}} className='profile'>{user.name}</p>
                            <a className='logOut' onClick={handleLogout}>Log out</a>
                        </div>
                    ) : null

                }
            </div>
        </div>
    );
}
