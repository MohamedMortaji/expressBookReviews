const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let book = null; // Declare book outside the loop

    for (let key in books) {
        if (books[key].author === author) {
            book = books[key]; // Assign book
            break; // Stop looping once found
        }
    }

    if (book) {
        return res.status(200).json(book); // Use 200 for success
    } else {
        return res.status(404).json({ message: "The book does not exist" }); // Use 404 for not found
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let book = null; // Declare book outside the loop

    for (let key in books) {
        if (books[key].title === title) {
            book = books[key]; // Assign book
            break; // Stop looping once found
        }
    }

    if (book) {
        return res.status(200).json(book); // Use 200 for success
    } else {
        return res.status(404).json({ message: "The book does not exist" }); // Use 404 for not found
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]){
  return res.status(200).json(books[isbn].reviews);
  }else{
    return res.status(404).json({ message: "The book does not exist" }); // Use 404 for not found
  }
});

module.exports.general = public_users;
