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
  const container = document.createElement("div");
  container.classList.add("book-item");
  container.setAttribute("id", bookObject.id);

  const bookInfo = document.createElement("div");
  bookInfo.classList.add("book-info");

  const bookTitle = document.createElement("h3");
  bookTitle.classList.add("book-title");
  bookTitle.innerText = bookObject.bookTitle;

  const bookAuthor = document.createElement("p");
  bookAuthor.classList.add("book-author");
  bookAuthor.innerText = `Author: ${bookObject.author}`;

  const bookYear = document.createElement("p");
  bookYear.classList.add("book-year");
  bookYear.innerText = `Year: ${bookObject.year}`;

  const bookActions = document.createElement("div");
  bookActions.classList.add("book-actions");

  const toggleReadButton = document.createElement("button");
  toggleReadButton.classList.add("button", "read-button");
  if (bookObject.isComplete) {
    toggleReadButton.innerText = "Belum Selesai Dibaca";
    toggleReadButton.addEventListener("click", function () {
      changeBookStatus(bookObject.id);
    });
  } else {
    toggleReadButton.innerText = "Selesai Dibaca";
    toggleReadButton.addEventListener("click", function () {
      changeBookStatus(bookObject.id);
    });
  }

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("button", "delete-button");
  deleteButton.innerText = "Hapus Buku";
  deleteButton.addEventListener("click", function () {
    deleteBook(bookObject.id);
  });

  bookActions.appendChild(toggleReadButton);
  bookActions.appendChild(deleteButton);

  bookInfo.appendChild(bookTitle);
  bookInfo.appendChild(bookAuthor);
  bookInfo.appendChild(bookYear);
  bookInfo.appendChild(bookActions);

  container.appendChild(bookInfo);

  return container;
}

function changeBookStatus(bookId) {
  books = getBookList();
  const bookIndex = findBookIndex(bookId);

  if (books[bookIndex] === -1) return;

  if (books[bookIndex].isComplete) {
    books[bookIndex].isComplete = false;
  } else {
    books[bookIndex].isComplete = true;
  }

  const parsed = JSON.stringify(books);
  localStorage.setItem(bookshelfKey, parsed);

  displayEventCheck();
  showToast("Status Buku Berhasil Dirubah!");
}

function displayEventCheck() {
  var searchBooksSection = document.getElementById("searchBooks");
  var allBooksSection = document.getElementById("allBooks");

  var isSearchBooksActive = searchBooksSection.classList.contains("active");
  var isAllBooksActive = allBooksSection.classList.contains("active");

  if (isSearchBooksActive) {
    document.dispatchEvent(new Event("render-result"));
  }

  if (isAllBooksActive) {
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books = getBookList();
  books.splice(bookTarget, 1);

  const parsed = JSON.stringify(books);
  localStorage.setItem(bookshelfKey, parsed);
  displayEventCheck();
  showToast("Buku Berhasil Dihapus!");
}

function findBookIndex(bookId) {
  books = getBookList();
  for (const index in books) {
    if (books[index].id == bookId) {
      return index;
    }
  }
}

function putBookList(data) {
  if (checkForStorage()) {
    let bookData = [];
    if (localStorage.getItem(bookshelfKey) !== null) {
      bookData = JSON.parse(localStorage.getItem(bookshelfKey));
    }

    bookData.unshift(data);

    localStorage.setItem(bookshelfKey, JSON.stringify(bookData));
    showToast("Data Buku Berhasil Dimasukkan!");
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

function showSection(sectionId) {
  document.querySelectorAll("main section").forEach((section) => {
    section.classList.remove("active");
  });

  const sectionToShow = document.getElementById(sectionId);
  if (sectionToShow) {
    sectionToShow.classList.add("active");
  }
  displayEventCheck();
}

document.getElementById("navInputBook").addEventListener("click", () => {
  showSection("inputBook");
  var headerContent = document.querySelector(".header-content");
  headerContent.classList.remove("active");
});
document.getElementById("navSearchBooks").addEventListener("click", () => {
  showSection("searchBooks");
  var headerContent = document.querySelector(".header-content");
  headerContent.classList.remove("active");
});
document.getElementById("navAllBooks").addEventListener("click", () => {
  showSection("allBooks");
  var headerContent = document.querySelector(".header-content");
  headerContent.classList.remove("active");
});

document.getElementById("menu-icon").addEventListener("click", () => {
  var headerContent = document.querySelector(".header-content");
  headerContent.classList.toggle("active");
});

window.addEventListener("resize", () => {
  var headerContent = document.querySelector(".header-content");
  headerContent.classList.remove("active");
});

window.addEventListener("blur", () => {
  var headerContent = document.querySelector(".header-content");
  headerContent.classList.remove("active");
});

document.getElementById("bookSearch").addEventListener("click", () => {
  document.dispatchEvent(new Event("render-result"));
});

document.addEventListener("render-result", () => {
  books = searchBooks();
  const searchResult = document.getElementById("search-result");
  searchResult.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    searchResult.append(bookElement);
  }
});

function searchBooks() {
  books = getBookList();

  const query = document.getElementById("searchBookTitle").value.toLowerCase();

  const result = books.filter((book) =>
    book.bookTitle.toLowerCase().includes(query)
  );

  return result;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  toastMessage.textContent = message;

  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, 3000);
}
