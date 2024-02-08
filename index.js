const bookshelfKey = "BOOKSHELF_KEY";

if (!localStorage.getItem(bookshelfKey)) {
    localStorage.setItem(bookshelfKey, JSON.stringify([]));
}

document.addEventListener('DOMContentLoaded', function() {
    updateBookShelf();

    const submitForm = document.getElementById('formAddBook');

    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const bookId = document.getElementById('bookId').value;
        if (bookId) {
            updateBook(bookId); // Fungsi untuk memperbarui buku
        } else {
            addBook(); // Fungsi yang sudah ada untuk menambahkan buku
        }
    });
});

function addBook() {
    const bookTitle = document.getElementById('title').value;
    const bookAuthor = document.getElementById('author').value;
    const bookYear = Number(document.getElementById('year').value);
    const isComplete = document.getElementById('isComplete').checked;

    const book = {
        id: +new Date(),
        title: bookTitle,
        author: bookAuthor,
        year: bookYear,
        isComplete: isComplete,
    };

    // Mengambil array buku dari localStorage, menambahkan buku baru, dan menyimpannya kembali
    const books = JSON.parse(localStorage.getItem(bookshelfKey));
    books.push(book);
    localStorage.setItem(bookshelfKey, JSON.stringify(books));

    // Mengosongkan form dan memperbarui tampilan
    document.getElementById('formAddBook').reset();
    updateBookShelf();
}

function updateBookShelf() {
    // Implementasikan fungsi untuk memperbarui rak buku di sini
    // Ini akan melibatkan mengambil data buku dari localStorage, dan menggunakannya untuk
    // menampilkan buku-buku tersebut di rak buku yang sesuai ('Belum Selesai Dibaca' atau 'Selesai Dibaca')

    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    // Membersihkan konten rak buku sebelumnya
    incompleteBookshelfList.innerHTML = '<h3>Belum Selesai Dibaca</h3>';
    completeBookshelfList.innerHTML = '<h3>Selesai Dibaca</h3>';

    // Mengambil array buku dari localStorage
    const books = JSON.parse(localStorage.getItem(bookshelfKey)) || [];

    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book-item');
        bookElement.innerHTML = `
            <h4>Judul Buku: ${book.title}</h4>
            <p>Penulis: ${book.author}</p>
            <p>Tahun Terbit: ${book.year}</p>
            <button class="complete-button">${book.isComplete ? 'Belum Selesai Baca' : 'Selesai Baca'}</button>
            <button class="delete-button">Hapus Buku</button>
            <button class="edit-button">Edit Buku</button>
        `;

        // Menambahkan event listener pada tombol 'Selesai Baca'/'Belum Selesai Baca'
        bookElement.querySelector('.complete-button').addEventListener('click', function() {
            toggleBookStatus(book.id);
        });

        // Menambahkan event listener pada tombol 'Hapus Buku'
        bookElement.querySelector('.delete-button').addEventListener('click', function() {
            deleteBook(book.id);
        });

        // Menambahkan event listener pada tombol 'Edit Buku' (implementasi fungsi editBook belum disertakan)
        bookElement.querySelector('.edit-button').addEventListener('click', function() {
            editBook(book.id);
        });

        if (book.isComplete) {
            completeBookshelfList.appendChild(bookElement);
        } else {
            incompleteBookshelfList.appendChild(bookElement);
        }
    });
}

function toggleBookStatus(bookId) {
    const books = JSON.parse(localStorage.getItem(bookshelfKey)) || [];
    const bookIndex = books.findIndex(book => book.id === bookId);

    if (bookIndex !== -1) {
        books[bookIndex].isComplete = !books[bookIndex].isComplete;
        localStorage.setItem(bookshelfKey, JSON.stringify(books));
        updateBookShelf();
    }
}

function deleteBook(bookId) {
    let books = JSON.parse(localStorage.getItem(bookshelfKey)) || [];
    books = books.filter(book => book.id !== bookId);

    localStorage.setItem(bookshelfKey, JSON.stringify(books));
    updateBookShelf();
}

function editBook(bookId) {
    const books = JSON.parse(localStorage.getItem(bookshelfKey)) || [];
    const book = books.find(book => book.id === bookId);

    if (book) {
        document.getElementById('bookId').value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('year').value = book.year;
        document.getElementById('isComplete').checked = book.isComplete;
        document.getElementById('formButton').innerText = 'Edit Buku';
        document.querySelector('#book-input h2').innerText = 'Edit Buku';
    }
}

function updateBook(bookId) {
    const books = JSON.parse(localStorage.getItem('BOOKSHELF_KEY')) || [];
    const bookIndex = books.findIndex(book => book.id === parseInt(bookId));

    if (bookIndex !== -1) {
        books[bookIndex] = {
            ...books[bookIndex],
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            year: parseInt(document.getElementById('year').value),
            isComplete: document.getElementById('isComplete').checked,
        };

        localStorage.setItem('BOOKSHELF_KEY', JSON.stringify(books));
        resetForm();
        updateBookShelf();
    }
}

function resetForm() {
    document.getElementById('bookId').value = '';
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('year').value = '';
    document.getElementById('isComplete').checked = false;
    document.getElementById('formButton').innerText = 'Tambah Buku';
    document.querySelector('#book-input h2').innerText = 'Tambah Buku';
}