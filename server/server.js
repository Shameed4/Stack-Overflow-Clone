const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');
const Questions = require('./models/questions');
const Tags = require('./models/tags')
const Answers = require('./models/answers')
const Users = require('./models/users');
const jwt = require('jsonwebtoken');

const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Middleware
const corsOptions = {
    origin: 'http://localhost:3000', // allowing access from your client
    credentials: true, // this allows the server to accept cookies from the client
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());



// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/fake_so', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Route to get all questions
app.get('/api/questions', async (req, res) => {
    try {
        const questions = await Questions.find();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get all tags
app.get('/api/tags', async (req, res) => {
    try {
        const tags = await Tags.find(); // Use your Tag model to query all tags from MongoDB
        res.json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get tag by id
app.get('/api/tags/:tid', async (req, res) => {
    try {
        const tag = await Tags.findById(req.params.tid);
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        res.json(tag);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get answer by id
app.get('/api/answers/:aid', async (req, res) => {
    try {
        const answer = await Answers.findById(req.params.aid);
        res.json(answer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/questions/:qid', async (req, res) => {
    try {
        const question = await Questions.findById(req.params.qid);
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to post a question
app.post('/api/questions', async (req, res) => {
    try {
        // Insert tags and get their IDs
        const tagIds = await insertTagsAndGetIds(req.body.tags);

        // Create and save the new question with tag IDs
        const newQuestion = new Questions({
            title: req.body.title,
            text: req.body.text,
            tags: tagIds,
            asked_by: req.body.username,
            ask_date_time: new Date(),
            answers: [],
        });
        await newQuestion.save();

        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to increment view by 1
app.patch('/api/questions/:qid/increment-views', async (req, res) => {
    try {
        const question = await Questions.findById(req.params.qid);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        question.views += 1;
        await question.save();
        res.status(200).json(question);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get number of upvotes to a question
app.get('/api/questions/:qid/votes', async (req, res) => {
    console.log("Upvotes checked");
    try {
        const question = await Questions.findById(req.params.qid);
        res.status(200).json(question.upvoters.length - question.downvoters.length);
        console.log("Success");
    } catch (error) {
        console.error(error);
        console.log("Error found");
        res.status(500).json({ message: error.message });
        console.log("Failed");
    }
})

// Middleware to verify the user session
const verifySession = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        req.signedIn = false;
    }

    jwt.verify(token, 'goats', (err, decoded) => {
        if (err) 
            return res.status(401).json({ message: 'Session invalid' });
        req.signedIn = true;
        req.userId = decoded.userId;
        next();
    });
};

const toggleUpvote = async (req, res) => {
    const { qid } = req.params;
    const { userId, signedIn } = req;

    if (!signedIn)
        return res.status(401).json("Not signed in");

    try {
        const question = await Questions.findById(qid);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        if (question.upvoters.includes(userId)) {
            question.upvoters.pull(userId);
            console.log("Removed upvote")
        } else {
            question.upvoters.push(userId);
            question.downvoters.pull(userId);
            console.log("Added upvote")
        }

        await question.save();

        res.status(200).json({ message: 'Upvote toggled successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const toggleDownvote = async (req, res) => {
    const { qid } = req.params;
    const { userId, signedIn } = req;

    if (!signedIn)
        return res.status(401).json("Not signed in");

    try {
        const question = await Questions.findById(qid);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        if (question.downvoters.includes(userId)) {
            question.downvoters.pull(userId);
        } else {
            question.downvoters.push(userId);
            question.upvoters.pull(userId);
        }

        await question.save();

        res.status(200).json({ message: 'Upvote toggled successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

app.patch('/api/questions/:qid/votes/toggle-upvote', verifySession, toggleUpvote);
app.patch('/api/questions/:qid/votes/toggle-downvote', verifySession, toggleDownvote);

app.get('/api/questions/:qid/votes/user', verifySession, async (req, res) => {
    console.log("Attempting to find user votse");
    const { qid } = req.params;
    const { userId, signedIn } = req;
    
    try {
        const question = await Questions.findById(qid);
        if (!question) {
            console.log("Question not found");
            return res.status(404).json({ message: 'Question not found' });
        }
        
        if (!signedIn)
            res.status(200).json(0);
        else if (question.upvoters.includes(userId))
            res.status(200).json(1);
        else if (question.downvoters.includes(userId))
            res.status(200).json(-1);
        else
            res.status(200).json(0);
    } catch (error) {
        console.log("Other error");
        res.status(400).json({ message: error.message });
    }

})

app.post('/api/questions/:qid/answers', async (req, res) => {
    const { qid } = req.params;
    const { userId } = req;

    try {
        const question = await Questions.findById(qid);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        if (question.upvoters.includes(userId)) {
            question.downvoters.pull(userId);
        } else {
            question.downvoters.push(userId);
            question.upvoters.pull(userId);
        }

        await question.save();

        res.status(200).json({ message: 'Upvote toggled successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Function to insert tags and return their IDs (same as previously described)
const insertTagsAndGetIds = async (tagNames) => {
    const tagIds = [];
    for (const name of tagNames) {
        let tag = await Tags.findOne({ name: name });
        if (!tag) {
            tag = new Tags({ name });
            await tag.save();
        }
        tagIds.push(tag._id);
    }
    return tagIds;
};

app.post('/api/users', async (req, res) => {
    try {
        const existingUser = await Users.findOne({ email: req.body.email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists with the provided email' });
        }

        // Hash password before saving the user
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // Using 10 rounds for salt generation

        const newUser = new Users({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: hashedPassword, // Store the hashed password
            username: req.body.email.toLowerCase().split('@')[0]
        });

        await newUser.save();
        res.status(201).json({ userId: newUser._id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/users/login', async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.body.email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            'goats', // Ensure your secret key is stored safely and is robust enough.
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Set the cookie with security options appropriate for both production and development
        res.cookie('token', token, {
            httpOnly: true, // Makes the cookie inaccessible to client-side scripts, important for protecting against XSS
        });

        res.status(200).json({ message: 'Login successful', username: user.username });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.get('/api/users/verify-session', (req, res) => {
    console.log('Cookies:', req.cookies); // Will log all cookies
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'No session found' });
    }

    jwt.verify(token, 'goats', async (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Session invalid' });

        try {
            const user = await Users.findById(decoded.userId);
            if (! user) return res.status(404).json({ message: 'User not found' });

            res.json({ userId: user._id, username: user.username, email: user.email, name: user.name });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
});


// Start the server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
