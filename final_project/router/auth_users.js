const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let Match = users.filter((user) => user.username === username);
    if(Match.length>0){
        return false;
    }else{ return true;}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let Match = users.filter((user) => user.username === username && user.password === password);
    if(Match.length>0){
        return true;
    }else{ return false;}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const user = req.session.authorization["username"];
    let SingleReview = books[isbn].reviews;

    // Check if the user already has a review
    if (SingleReview[user]) {
        SingleReview[user] = review; // Update the review
        return res.status(200).send(`Review updated for user: ${user}`);
    } else {
        SingleReview[user] = review; // Add new review
        return res.status(200).send(`Review posted for user: ${user}`);
    }
    
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const user = req.session.authorization["username"];
    let SingleReview = books[isbn].reviews;
    if(SingleReview[user]){
        delete SingleReview[user];
        return res.status(200).send(`Review Deleted for user: ${user}`);
    }
    return res.status(404).send(`Unable to find Review for user: ${user}`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
