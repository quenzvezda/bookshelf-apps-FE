const bookshelfKey = "BOOKSHELF_KEY";
const submitAction = document.getElementById("book-form");

function checkForStorage() {
  return typeof Storage !== "undefined";
}

function getBookList() {
  if (checkForStorage()) {
    return JSON.parse(localStorage.getItem(bookshelfKey));
  } else {
    return [];
  }
}

function generateUniqueID() {
  return "book-" + new Date().getTime();
}

const RENDER_EVENT = "render-books";

document.addEventListener(RENDER_EVENT, function () {
  const unreadBookList = document.getElementById("booksUnread");
  unreadBookList.innerHTML = "";

  const readBookList = document.getElementById("booksRead");
  readBookList.innerHTML = "";

  books = getBookList();
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      readBookList.append(bookElement);
    } else {
      unreadBookList.append(bookElement);
    }
  }
});

function makeBook(bookObject) {
  // Membuat kontainer untuk item buku
  const container = document.createElement("div");
  container.classList.add("book-item");
  container.setAttribute("id", bookObject.id);

  // Membuat elemen untuk info buku
  const bookInfo = document.createElement("div");
  bookInfo.classList.add("book-info");

  // Membuat dan mengisi judul buku
  const bookTitle = document.createElement("h3");
  bookTitle.classList.add("book-title");
  bookTitle.innerText = bookObject.bookTitle;

  // Membuat dan mengisi penulis buku
  const bookAuthor = document.createElement("p");
  bookAuthor.classList.add("book-author");
  bookAuthor.innerText = `Author: ${bookObject.author}`;

  // Membuat dan mengisi tahun terbit buku
  const bookYear = document.createElement("p");
  bookYear.classList.add("book-year");
  bookYear.innerText = `Year: ${bookObject.year}`;

  // Membuat kontainer untuk aksi yang bisa dilakukan pada buku
  const bookActions = document.createElement("div");
  bookActions.classList.add("book-actions");

  // Membuat tombol "Selesai Dibaca" atau "Belum Selesai Dibaca"
  const toggleReadButton = document.createElement("button");
  toggleReadButton.classList.add("button", "read-button");
  if (bookObject.isComplete) {
    toggleReadButton.innerText = "Belum Selesai Dibaca";
    toggleReadButton.addEventListener("click", function () {
      // Tambahkan logika untuk mengganti status buku di sini
      console.log("button uncompleted");
      changeBookStatus(bookObject.id);
    });
  } else {
    toggleReadButton.innerText = "Selesai Dibaca";
    toggleReadButton.addEventListener("click", function () {
      // Tambahkan logika untuk mengganti status buku di sini
      console.log("button completed");
      changeBookStatus(bookObject.id);
    });
  }

  // Membuat tombol "Hapus Buku"
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("button", "delete-button");
  deleteButton.innerText = "Hapus Buku";
  deleteButton.addEventListener("click", function () {
    // Tambahkan logika untuk menghapus buku dari daftar di sini
    deleteBook(bookObject.id);
  });

  // Menambahkan tombol-tombol ke dalam kontainer aksi
  bookActions.appendChild(toggleReadButton);
  bookActions.appendChild(deleteButton);

  // Menambahkan judul, penulis, tahun, dan aksi ke dalam info buku
  bookInfo.appendChild(bookTitle);
  bookInfo.appendChild(bookAuthor);
  bookInfo.appendChild(bookYear);
  bookInfo.appendChild(bookActions);

  // Menambahkan info buku ke dalam kontainer item buku
  container.appendChild(bookInfo);

  // Mengembalikan elemen kontainer yang sudah lengkap
  return container;
}

function changeBookStatus(bookId) {
  books = getBookList();
  const bookIndex = findBookIndex(bookId);
  console.log(books[bookIndex]);

  if (books[bookIndex] === -1) return;

  if (books[bookIndex].isComplete) {
    books[bookIndex].isComplete = false;
  } else {
    books[bookIndex].isComplete = true;
  }

  console.log(books[bookIndex]);

  const parsed = JSON.stringify(books);
  localStorage.setItem(bookshelfKey, parsed);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books = getBookList();
  books.splice(bookTarget, 1);

  const parsed = JSON.stringify(books);
  localStorage.setItem(bookshelfKey, parsed);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBookIndex(bookId) {
  books = getBookList();
  for (const index in books) {
    if (books[index].id == bookId) {
      return index;
    }
  }
}

function findBook(bookId) {
  books = getBookList();
  for (const bookItem of books) {
    if (bookItem.id == bookId) {
      return bookItem;
    }
  }
  return null;
}

function putBookList(data) {
  if (checkForStorage()) {
    let bookData = [];
    if (localStorage.getItem(bookshelfKey) !== null) {
      bookData = JSON.parse(localStorage.getItem(bookshelfKey));
    }

    bookData.unshift(data);

    localStorage.setItem(bookshelfKey, JSON.stringify(bookData));
  }
}

submitAction.addEventListener("submit", function () {
  const inputId = generateUniqueID();
  const inputBook = document.getElementById("inputBookTitle").value;
  const inputAuthor = document.getElementById("inputBookAuthor").value;
  const inputYear = document.getElementById("inputBookYear").value;
  const inputIsCompleted = document.getElementById(
    "inputBookIsComplete"
  ).checked;
  const newBookData = {
    id: inputId,
    bookTitle: inputBook,
    author: inputAuthor,
    year: inputYear,
    isComplete: inputIsCompleted,
  };

  putBookList(newBookData);
});

// Fungsi untuk mengaktifkan section yang dipilih dan menonaktifkan yang lain
function showSection(sectionId) {
  // Sembunyikan semua section
  document.querySelectorAll("main section").forEach((section) => {
    section.classList.remove("active");
  });

  // Tampilkan section yang sesuai dengan id yang diberikan
  const sectionToShow = document.getElementById(sectionId);
  if (sectionToShow) {
    sectionToShow.classList.add("active");
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Event listener untuk setiap navigasi di header
document
  .getElementById("navInputBook")
  .addEventListener("click", () => showSection("inputBook"));
document
  .getElementById("navSearchBooks")
  .addEventListener("click", () => showSection("searchBooks"));
document
  .getElementById("navAllBooks")
  .addEventListener("click", () => showSection("allBooks"));

// Fungsi toggleMenu() untuk dropdown pada mobile
function toggleMenu() {
  var headerContent = document.querySelector(".header-content");
  headerContent.classList.toggle("active");
}
