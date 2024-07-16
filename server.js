const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const saltRounds =10;

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://Aryan:DTkca_HZ5i7yCQw@cluster0.gpsnwep.mongodb.net/La-Bella-Italia?retryWrites=true')
    .then(() => console.log('DB connection successful'))
    .catch(error => console.error('DB connection error:', error));

// Define a user schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

// Create a User model
const User = mongoose.model('User', userSchema);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname)));

// Define a route to handle GET requests for signup.html
app.get('/index', (req, res) => {
    // Send the signup.html file
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Define a route to handle signup form submissions
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Example: Log the submitted data
    console.log('Submitted Data:', { username, email, password });

    // Hash the password (replace with your actual hashing logic)
    const hashedPassword = async (plainTextPassword) => {
        try {
            // Generate a salt
            const salt = await bcrypt.genSalt(saltRounds);
    
            // Hash the password
            const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
    
            return hashedPassword;
        } catch (error) {
            console.error('Error hashing password:', error);
            throw error;
        }
    };
    ;

    // Create a new user instance
    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
    });

    try {
        // Save the user to the database
        await newUser.save();
        console.log('User saved successfully');

        // Redirect to /index after successful signup
        res.redirect('/index');
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Internal Server Error');
    }
});

const port = 3002;
app.listen(port, '0.0.0.0', () => {
    console.log(`App running on port ${port}...`);
});
