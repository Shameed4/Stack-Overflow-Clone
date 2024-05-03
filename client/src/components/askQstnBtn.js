import "../stylesheets/App.css";

function QstnButton({ setMode, user }) {
    // Render the button only if the 'user' object is not null
    return (
        user && <button className="askQstnBtn btn" onClick={() => setMode(3)}>Ask Question</button>
    )
}

export default QstnButton;
