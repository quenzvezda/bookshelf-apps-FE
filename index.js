if (!localStorage.getItem('BOOKSHELF_KEY')) {
    localStorage.setItem('BOOKSHELF_KEY', JSON.stringify([]));
}

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('formAddBook');

    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
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
    const books = JSON.parse(localStorage.getItem('BOOKSHELF_KEY'));
    books.push(book);
    localStorage.setItem('BOOKSHELF_KEY', JSON.stringify(books));

    // Mengosongkan form dan memperbarui tampilan
    document.getElementById('formAddBook').reset();
    updateBookShelf();
}

function updateBookShelf() {
    // Implementasikan fungsi untuk memperbarui rak buku di sini
    // Ini akan melibatkan mengambil data buku dari localStorage, dan menggunakannya untuk
    // menampilkan buku-buku tersebut di rak buku yang sesuai ('Belum Selesai Dibaca' atau 'Selesai Dibaca')
}