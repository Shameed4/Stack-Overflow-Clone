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

// Middleware to verify the user session - Use before anything that requires being signed in
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

// Route to get question by id
app.get('/api/questions/:qid', async (req, res) => {
    try {
        const question = await Questions.findById(req.params.qid);
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to post a question
app.post('/api/questions', verifySession, async (req, res) => {
    const { userId, signedIn } = req;
    
    if (!signedIn)
        return res.status(401).json("Not signed in");

    try {
        // Insert tags and get their IDs
        const tagIds = await insertTagsAndGetIds(req.body.tags);
        const user = await Users.findById(userId);
        const username = user.username;

        // Create and save the new question with tag IDs
        const newQuestion = new Questions({
            title: req.body.title,
            text: req.body.text,
            tags: tagIds,
            asked_by: username,
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

const prepareQuestion = (req, res, next) => {
    req.Type = Questions;
    next();
}

const prepareAnswer = (req, res, next) => {
    req.Type = Answers;
    next();
}

const prepareComment = (req, res, next) => {
    req.Type = Comments;
    next();
}

// Get number of upvotes to a question
const getTotalVotes = async (req, res) => {
    const { id } = req.params;
    const { Type } = req;

    try {
        const obj = await Type.findById(id);
        res.status(200).json(obj.upvoters.length - obj.downvoters.length);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const toggleUpvote = async (req, res) => {
    const { id } = req.params;
    const { Type, userId, signedIn } = req;

    if (!signedIn)
        return res.status(401).json("Not signed in");

    try {
        const obj = await Type.findById(id);
        if (!obj) {
            return res.status(404).json({ message: 'obj not found' });
        }

        if (obj.upvoters.includes(userId)) {
            obj.upvoters.pull(userId);
        } else {
            obj.upvoters.push(userId);
            obj.downvoters.pull(userId);
        }

        await obj.save();

        res.status(200).json({ message: 'Upvote toggled successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const toggleDownvote = async (req, res) => {
    const { id } = req.params;
    const { Type, userId, signedIn } = req;

    if (!signedIn)
        return res.status(401).json("Not signed in");

    try {
        const obj = await Type.findById(id);
        if (!obj) {
            return res.status(404).json({ message: 'obj not found' });
        }

        if (obj.downvoters.includes(userId)) {
            obj.downvoters.pull(userId);
        } else {
            obj.downvoters.push(userId);
            obj.upvoters.pull(userId);
        }

        await obj.save();

        res.status(200).json({ message: 'Upvote toggled successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getUserVotes = async (req, res) => {
    const { id } = req.params;
    const { Type, userId, signedIn } = req;

    try {
        const obj = await Type.findById(id);
        if (!obj) {
            return res.status(404).json({ message: 'obj not found' });
        }

        if (!signedIn)
            res.status(200).json(0);
        else if (obj.upvoters.includes(userId))
            res.status(200).json(1);
        else if (obj.downvoters.includes(userId))
            res.status(200).json(-1);
        else
            res.status(200).json(0);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

app.get('/api/questions/:id/votes', prepareQuestion, getTotalVotes);
app.get('/api/questions/:id/votes/user', verifySession, prepareQuestion, getUserVotes)
app.patch('/api/questions/:id/votes/toggle-upvote', verifySession, prepareQuestion, toggleUpvote);
app.patch('/api/questions/:id/votes/toggle-downvote', verifySession, prepareQuestion, toggleDownvote);

app.get('/api/answers/:id/votes', prepareAnswer, getTotalVotes);
app.get('/api/answers/:id/votes/user', verifySession, prepareAnswer, getUserVotes)
app.patch('/api/answers/:id/votes/toggle-upvote', verifySession, prepareAnswer, toggleUpvote);
app.patch('/api/answers/:id/votes/toggle-downvote', verifySession, prepareAnswer, toggleDownvote);

app.get('/api/comments/:id/votes', prepareComment, getTotalVotes);
app.get('/api/comments/:id/votes/user', verifySession, prepareComment, getUserVotes)
app.patch('/api/comments/:id/votes/toggle-upvote', verifySession, prepareComment, toggleUpvote);
app.patch('/api/comments/:id/votes/toggle-downvote', verifySession, prepareComment, toggleDownvote);


app.post('/api/questions/:qid/answers', verifySession, async (req, res) => {
    const { userId, signedIn } = req;
    
    if (!signedIn)
        return res.status(401).json("Not signed in");

    try {
        // Find the question
        const question = await Questions.findById(req.params.qid);
        const user = await Users.findById(userId);
        const username = user.username;
        console.log("Username", username);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Create and save the new answer
        const newAnswer = new Answers({
            text: req.body.text,
            ans_by: username,
            ans_date_time: new Date(),
        });
        await newAnswer.save();

        // Add the answer ID to the question's answers array and save the question
        question.answers.push(newAnswer._id);
        await question.save();

        res.status(201).json(newAnswer);
    } catch (error) {
        console.log("bad answer, failed to post");
        console.error(error);
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
            { userId: user._id, username: user.username, name: user.name},
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

app.get('/logout', (req, res) => {
    res.cookie('token', '', { expires: new Date(0) }); // Clear the cookie by setting an expired date
    res.send('Logged out');
    console.log("yo yo")
});

// Start the server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// const test = async () => {
//     console.log(await Answers.find())
//     console.log(await Questions.find())
// }

// test();