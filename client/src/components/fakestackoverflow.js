import Col2 from './col2.js';
import Header from "./header"
import React, { useState, useEffect } from 'react';
import { renderNewestQuestions } from '../request-functions/request-functions.js';
import Welcome from "./welcome";

export default function FakeStackOverflow() {
  const [visitedQuestion, setVisitedQuestion] = useState(0);
  const [renderedQuestions, setRenderedQuestions] = useState([]);
  const [mode, setMode] = useState(0);
  const [page, setPage] = useState(0);
  const [user, setUser] = useState(null);
  const [userToView, setUserToView] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    renderNewestQuestions(setRenderedQuestions);
  }, []);

  function col2(){
    return (
        <div id="main" className="main">
          <div id="col1">
            <div id="questionsPageClick" className={mode == 0 ? "gray" : ""} onClick={() => {
              renderNewestQuestions(setRenderedQuestions);
              setMode(0);
            }}>Questions
            </div>
            <div id="tagsPageClick" className={mode == 1 ? "gray" : ""} onClick={() => setMode(1)}>Tags</div>
            {user && user.admin && <div id="adminPageClick" className={mode == -1 ? "gray" : ""} onClick={() => setMode(-1)}>Admin</div>}
          </div>

          <Col2 mode={mode} setMode={setMode} renderedQuestions={renderedQuestions}
                setRenderedQuestions={setRenderedQuestions} visitedQuestion={visitedQuestion}
                setVisitedQuestion={setVisitedQuestion} user={user} userToView={userToView} setUserToView={setUserToView} 
                isOnline={isOnline} setIsOnline={setIsOnline}/>
        </div>
    );
  }

  return (
      <div className="App">
        <Header setRenderedQuestions={setRenderedQuestions} setMode={setMode} user={user} page={page} setUser={setUser} setPage={setPage} isOnline={isOnline} setIsOnline={setIsOnline} setUserToView={setUserToView}/>
          {
              (() => {
                  switch (page) {
                      case 0:
                          return <Welcome renderedQuestions={renderedQuestions} setRenderedQuestions={setRenderedQuestions} setMode={setMode} setVisitedQuestion={setVisitedQuestion} setPage={setPage} user={user} setUser={setUser} isOnline={isOnline} setIsOnline={setIsOnline}/>;
                      case 1:
                          return col2()
                      default:
                          return null; // Handle default case if needed
                  }
              })()
          }
      </div>
  );
}
