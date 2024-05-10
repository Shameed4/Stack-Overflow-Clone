

const axios = require("axios");

if (process.argv.length != 3) {
    console.error("Please add exactly 1 argument in the form \"email password\", including the quotes.");
    process.exit(1);
}

preprocessed = process.argv[2].trim().split(" ").map(item => item.trim());
if (preprocessed.length != 2) {
    console.error("Please make sure your argument is in the form \"email password\", including the quotes.");
    process.exit(2);
}

const [email, password] = preprocessed;

const handleSignup = async () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        console.error("Please enter a valid email.");
        process.exit(3);
    }
    try {
        const response = await axios.post('http://localhost:8000/api/users', {
            name: "admin",
            email,
            password,
            admin: true
        });
        if (response.status === 201) {
            console.log('Signup successful');
            process.exit(1);
        }
    } catch (error) {
        console.error('Failed to sign up:', error.response ? error.response.data.message : error.message);
        process.exit(4);
    }
};

handleSignup();