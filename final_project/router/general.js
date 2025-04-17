const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


//const users = [];

//const isValid = (username) => {
//    return users.some((user) => user.username === username);
//};

public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Function with a Promise to be called for async GET requests
function getBooksPromise(booksRouter) { 
    return new Promise((resolve, reject) => {
        if (booksRouter) {
            resolve(booksRouter);
        } else {
            reject("No books were found, please try again with different parameters.");
        }
    });
}

//Task 1
// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//     return res.status(200).send(JSON.stringify(books, null, 4));
// });

// Task 10: Get the list of books available in the shop by async/await
public_users.get('/', async function (req, res) {
    let bookList = await getBooksPromise(books);
    res.send(bookList);
});

//Task 2
// // Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//     const isbn = req.params.isbn;
//     const book = books[isbn];

//     if (book) {
//         return res.status(200).send(book);
//     } else {
//         return res.status(404).send("Book not found");
//     }
// });

//Task 11: Get book details based on ISBN by Promise
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getBooksPromise(books[isbn])
    .then(
        result => res.send(result),
        error => res.send(error)
    )
 });

//Task 3
// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     const author = req.params.author;
//     const filteredBooks = [];

//     for (const key in books) {
//         if (books[key].author === author) {
//             filteredBooks.push(books[key]);
//         }
//     }

//     if (filteredBooks.length > 0) {
//         return res.status(200).send(filteredBooks);
//     } else {
//         return res.status(404).send("No books found for this author");
//     }
// });

//Task 12: Get book details based on author by async/await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    let book = [];
    let bookList = await getBooksPromise(books);

    Object.keys(bookList).forEach(i => {
        if(bookList[i].author.toLowerCase() == author.toLowerCase()){
            book.push(books[i])
        }
    });
    res.send(book);
});

//Task 4
// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     const title = req.params.title;
//     const filteredBooks = [];

//     for (const key in books) {
//         if (books[key].title === title) {
//             filteredBooks.push(books[key]);
//         }
//     }

//     if (filteredBooks.length > 0) {
//         return res.status(200).send(filteredBooks);
//     } else {
//         return res.status(404).send("No books found with this title");
//     }
// });

// Task 13: Get book details based on title by async/await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    let book = [];
    let bookList = await getBooksPromise(books);

    Object.keys(bookList).forEach(i => {
        if(bookList[i].title.toLowerCase() == title.toLowerCase()){
            book.push(bookList[i])
        }
    });
    res.send(book);
});

//Task 5
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).send(book.reviews);
    } else {
        return res.status(404).send("Reviews not found for this ISBN");
    }
});


module.exports.general = public_users;
