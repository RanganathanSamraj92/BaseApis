module.exports = (app) => {
    const booksContoller = require('./BookController.js');

    // Create a new Note
    app.post('/books', booksContoller.create);

    // Retrieve all Notes
    app.get('/books', booksContoller.findAll);

    // Retrieve a single Note with noteId
    app.get('/books/:bookId', booksContoller.book_details);

    // Update a Note with noteId
    app.put('/books/:bookId', booksContoller.update);

    // Delete a Note with noteId
    app.delete('/books/:bookId', booksContoller.delete);
}
