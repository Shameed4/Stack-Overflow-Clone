import React, { useState } from 'react';
import axios from 'axios';

export default function Welcome({setPage, user, setUser}) {
    const [form, setForm] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loginError, setLoginError] = useState(false);
    const [signupError, setSignupError] = useState('');

    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError(false);
        try {
            const response = await axios.post('http://localhost:8000/api/users/login', {
                email,
                password
            });
            if (response.status === 200) {
                console.log('Login successful');
                console.log(response.data);
                setUser(response.data); // Update the user state with the received user information
                setPage(1);
                setEmail('');  // Reset email
                setPassword('');  // Reset password
            }
        } catch (error) {
            console.error('Failed to log in:', error.response ? error.response.data.message : error.message);
            setLoginError(true);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setSignupError('Please enter a valid email address.');
            return;
        }
        setSignupError('');
        try {
            const response = await axios.post('http://localhost:8000/api/users', {
                name,
                email,
                password
            });
            if (response.status === 201) {
                console.log('Signup successful');
                setUser(response.data); // Similarly, update the user state on successful signup
                setForm('login');
                setName('');  // Reset name
                setEmail('');  // Reset email
                setPassword('');  // Reset password
            }
        } catch (error) {
            console.error('Failed to sign up:', error.response ? error.response.data.message : error.message);
            setSignupError(error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <div className="welcome">
            <h1 className='WelcomeHeader'>Welcome to Fake Stack Overflow!</h1>
            <div className="form-container">
                {form === 'login' ? (
                    <div>
                        <h2>Login</h2>
                        <form className='form' onSubmit={handleLogin}>
                            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                   style={{ borderColor: loginError ? 'red' : 'none' }}/>
                            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                   style={{ borderColor: loginError ? 'red' : 'none' }}/>
                            <button type="submit" className='LoginButton'>Login</button>
                            {loginError && <p style={{color: 'red'}}>Invalid credentials, please try again.</p>}
                        </form>
                        <p>Don't have an account? <a onClick={() => setForm('signup')}>Sign up</a></p>
                        <p>Continue as <a onClick={() => {setPage(1);}}>Guest</a></p>
                    </div>
                ) : (
                    <div>
                        <h2>Create an account</h2>
                        <form className='form' onSubmit={handleSignup}>
                            <input type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)}/>
                            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                   style={{ borderColor: signupError ? 'red' : 'none' }}/>
                            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <button type="submit">Sign Up</button>
                            {signupError && <p style={{color: 'red'}}>{signupError}</p>}
                        </form>
                        <p>Already have an account? <a onClick={() => setForm('login')}>Log in</a></p>
                        <p>Continue as <a onClick={() => {setPage(1);}}>Guest</a></p>
                    </div>
                )}
            </div>
        </div>
    );
}
