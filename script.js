const INCOMPLETE_BOOK_LIST = "incompleteBookshelfList";
const COMPLETE_BOOK_LIST = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

//EVENT HANDLER
document.addEventListener("DOMContentLoaded", () => {
	const formSubmit = document.getElementById("inputBook");

	formSubmit.addEventListener("submit", (event) => {
		event.preventDefault();
		addBook();
	});

	if (storageExist) {
		loadBookFromStorage();
	}
});

document.addEventListener("BOOK_RENDER", () => {
	bookListFromShelf();
});

//DOM
const makeBook = (titleBook, bookAuthor, bookYear, isCompleted) => {
	const textTitle = document.createElement("h3");
	textTitle.innerText = titleBook;

	const textAuth = document.createElement("p");
	textAuth.innerText = " " + bookAuthor;

	const textYear = document.createElement("p");
	textYear.innerText = " " + bookYear;

	const container = document.createElement("article");
	container.classList.add("book_item");
	container.append(textTitle, textAuth, textYear);

	const containerButton = document.createElement("div");
	containerButton.classList.add("action");

	if (isCompleted) {
		containerButton.append(createUnfinishedButton("Belum Selesai"), createRemoveButton("Hapus Buku"));
	} else {
		containerButton.append(createFinishedButton("Sudah Selesai"), createRemoveButton("Hapus Buku"));
	}

	container.append(containerButton);

	return container;
};

const addBook = () => {
	const incompleteBookShelf = document.getElementById(INCOMPLETE_BOOK_LIST);
	const completeBookShelft = document.getElementById(COMPLETE_BOOK_LIST);
	const inputForm = document.getElementById("inputBook");

	const titleBook = document.getElementById("inputBookTitle").value;
	const authorBook = document.getElementById("inputBookAuthor").value;
	const yearBook = document.getElementById("inputBookYear").value;
	const checkBoxComplete = document.getElementById("inputBookIsComplete").checked;

	const inputBook = makeBook(titleBook, authorBook, yearBook, checkBoxComplete);
	const bookObject = composeBookObject(titleBook, authorBook, yearBook, checkBoxComplete);
	inputBook[BOOK_ITEMID] = bookObject.id;
	books.push(bookObject);
	inputForm.reset();

	if (checkBoxComplete) {
		completeBookShelft.append(inputBook);
		updateBookToStorage();
	} else {
		incompleteBookShelf.append(inputBook);
		updateBookToStorage();
	}
};

const addBookToComplete = (book) => {
	const title = book.querySelector(".book_item > h3").innerText;
	const author = book.querySelectorAll(".book_item > p")[0].innerText.slice(0);
	const year = book.querySelectorAll(".book_item > p")[1].innerText.slice(0);

	const newBook = makeBook(title, author, year, true);
	const bookFind = findBook(book[BOOK_ITEMID]);
	bookFind.isCompleted = true;
	newBook[BOOK_ITEMID] = bookFind.id;

	const completeBookShelf = document.getElementById(COMPLETE_BOOK_LIST);
	completeBookShelf.append(newBook);
	book.remove();

	updateBookToStorage();
};

const addBookToUnComplete = (book) => {
	const title = book.querySelector(".book_item > h3").innerText;
	const author = book.querySelectorAll(".book_item > p")[0].innerText.slice(0);
	const year = book.querySelectorAll(".book_item > p")[1].innerText.slice(0);

	const newBook = makeBook(title, author, year, false);
	const bookFind = findBook(book[BOOK_ITEMID]);
	bookFind.isCompleted = false;
	newBook[BOOK_ITEMID] = bookFind.id;

	const uncompleteBookShelf = document.getElementById(INCOMPLETE_BOOK_LIST);
	uncompleteBookShelf.append(newBook);
	book.remove();

	updateBookToStorage();
};

const removeBook = (book) => {
	const indexBook = findBookIndex(book[BOOK_ITEMID]);
	books.splice(indexBook, 1);
	book.remove();

	updateBookToStorage();
};

const createButton = (buttonClass, eventListener, Text) => {
	const button = document.createElement("button");
	button.innerText = Text;
	button.classList.add(buttonClass);

	button.addEventListener("click", (e) => {
		eventListener(e);
	});
	return button;
};

// prettier-ignore
const createRemoveButton = (text) => {
	return createButton("red",(e) => {
			const message = confirm("Apakah anda yakin mau hapus buku?");
			if (message) {
				removeBook(e.target.parentElement.parentElement);
			}
		},text
	);
};
// prettier-ignore
const createFinishedButton = (text) => {
	return createButton("green",(e) => {
			addBookToComplete(e.target.parentElement.parentElement);
		},
		text
	);
};
// prettier-ignore
const createUnfinishedButton = (text) => {
	return createButton("green",(e) => {
			addBookToUnComplete(e.target.parentElement.parentElement);
		},
		text
	);
};

//SRORAGE
const STORAGE_KEY = "LIBRARY";
let books = [];

function storageExist() {
	if (typeof Storage === undefined) {
		alert("Browser Tidak Mendukung Local Storage");
		return false;
	}
	return true;
}

const composeBookObject = (title, author, year, isCompleted) => {
	return {
		id: +new Date(),
		title,
		author,
		year: Number(year),
		isCompleted,
	};
};

function findBook(bookId) {
	for (book of books) {
		if (book.id === bookId) {
			return book;
		}
	}
	return null;
}

function findBookIndex(bookId) {
	let index = 0;
	for (book of books) {
		if (book.id === bookId) return index;
		index++;
	}
	return -1;
}

function loadBookFromStorage() {
	const serializedData = localStorage.getItem(STORAGE_KEY);
	let dataBooks = JSON.parse(serializedData);

	if (dataBooks !== null) {
		books = dataBooks;
	}

	document.dispatchEvent(new Event("BOOK_RENDER"));
}

function updateBookToStorage() {
	if (storageExist()) {
		const parsed = JSON.stringify(books);
		localStorage.setItem(STORAGE_KEY, parsed);
	}
}

function bookListFromShelf() {
	const incompleteBookList = document.getElementById(INCOMPLETE_BOOK_LIST);
	const completeBookList = document.getElementById(COMPLETE_BOOK_LIST);

	for (book of books) {
		const newBook = makeBook(book.title, book.author, book.year, book.isCompleted);
		newBook[BOOK_ITEMID] = book.id;

		if (book.isCompleted) {
			completeBookList.append(newBook);
		} else {
			incompleteBookList.append(newBook);
		}
	}
}
