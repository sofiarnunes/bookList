// Book Constructor - create the book object
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Constructor - prototype methods
class UI{
    // Add book to list
    addBookToList(book) {
        const list = document.querySelector('#book-list');
    
        // create tr element
        const row = document.createElement('tr');
        // insert cols
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href='#' class='delete'>X</a></td>
        `
        // append to the list
        list.appendChild(row);
    }
 
    // Alert
    showAlert(msg, type){
        // Create alert
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.appendChild(document.createTextNode(msg));

        // Insert into HTML
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(alert, form);

        // Reset alert
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 1500);
    }

    // Delete Book
    deleteBook(target){
        if(target.classList.contains('delete')){
            const bookDeleted = target.parentElement.parentElement;
            bookDeleted.remove();
        }
    }

    // Clear fields
    clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Local Storage class
class Storage {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null){
            books = []; 
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks() {
        const books = Storage.getBooks();
        books.forEach(function(book) {
            const ui = new UI;

            // Add book to ui
            ui.addBookToList(book);
        });
    }
    
    static addBook(book) {
        const books = Storage.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        console.log(isbn)
        const books = Storage.getBooks();
        books.forEach(function(book, index) {
            if(book.isbn === isbn){
                books.splice(index, 1); // removes one object from index x
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Storage.displayBooks);

// EVENT LISTENERS
// Submit
document.querySelector('#book-form').addEventListener('submit', function(e){
    // get form fields values
    const   title = document.querySelector('#title').value,
            author = document.querySelector('#author').value,
            isbn = document.querySelector('#isbn').value;
    
    // instantiate new book object
    const book = new Book(title, author, isbn);

    // instantiate a UI object
    const ui = new UI();

    // validate
    if(!title.length || !author.length || !isbn.length){
        // Error alert
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        // add book to list
        ui.addBookToList(book);
        // store book
        Storage.addBook(book);
        // Success alert
        ui.showAlert('Book Added!', 'success');
        // clear fields
        ui.clearFields();
    }


    e.preventDefault();
});

// Delete
document.querySelector('#book-list').addEventListener('click', function(e){
    // instantiate a UI object
    const ui = new UI();
    // delete book from list
    ui.deleteBook(e.target);
    // remove from local storage
    Storage.removeBook(e.target.parentElement.previousElementSibling.textContent); 
    // show alert
    ui.showAlert('Book Removed!', 'success');

    e.preventDefault();
})