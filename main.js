document.addEventListener('DOMContentLoaded', function () {
    const bookSubmit = document.querySelector("#bookSubmit");
    bookSubmit.addEventListener('click', function (event) {
      event.preventDefault();
      addBook();
    });
    const searchSubmit = document.querySelector('#searchSubmit');
    searchSubmit.addEventListener('click', function (event) {
      event.preventDefault();
      searchBook();
    })
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });

function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    let isComplate = false;
    const newstatusbook = document.getElementById("inputBookIsComplete");
    if (newstatusbook.checked){
      isComplate = true;
    } else {
      isComplate = false;
    }
    
    const generatedID = generateId();
    const dataBook = generatedataBook(generatedID, title, author, year, isComplate);
    Books.push(dataBook)

    document.dispatchEvent(new Event(RENDER_EVENT));
    document.getElementById('inputBook').reset();
    saveData();
}

function generateId() {
    return +new Date();
  }
   
  function generatedataBook(id, title, author, year, isComplate) {
    return {
      id,
      title,
      author,
      year,
      isComplate
    }
  }

const Books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener(RENDER_EVENT, function () {
    
    const incomplatebooklist = document.getElementById('incompleteBookshelfList')
    incomplatebooklist.innerHTML = '';

    const complatebooklist = document.getElementById('completeBookshelfList')
    complatebooklist.innerHTML = '';

    for (bookItem of Books){
      const bookElement = MakeBook(bookItem);
      if(bookItem.isComplate) {
        complatebooklist.append(bookElement);
       } else {
        incomplatebooklist.append(bookElement);
       }
    }


  });

  function changeText(){
    const newstatusbook = document.getElementById("inputBookIsComplete");
      if (newstatusbook.checked){
      let bookhasbeenread = document.getElementById("newstatusbook");
      bookhasbeenread.innerText = "Selesai Dibaca";
      
      } else {
        let bookhasbeenread = document.getElementById("newstatusbook");
        bookhasbeenread.innerText = "Belum Selesai Dibaca";
      }
     }
  document.getElementById("inputBookIsComplete").addEventListener('change',changeText); 



function MakeBook(dataBook){


  const BookTitle = document.createElement('h3');
  BookTitle.innerText = dataBook.title;

  const AuthorBook = document.createElement('p');
  AuthorBook.innerText = dataBook.author;

  const YearBook = document.createElement('p');
  YearBook.innerText = dataBook.year;



  const articleIncomplate = document.createElement('article');
  articleIncomplate.classList.add('book_item');
  articleIncomplate.append(BookTitle, AuthorBook, YearBook);
  articleIncomplate.setAttribute('id', `Book-${dataBook.id}`);


  if (dataBook.isComplate) {
    const btnBalik = document.createElement('button');
    btnBalik.classList.add('green');
    btnBalik.innerText = 'Belum Selesai Baca'
 
    btnBalik.addEventListener('click', function () {
      balikKeBelum(dataBook.id);
    });
 
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('red');
    removeBtn.innerText = 'Hapus buku';
 
    removeBtn.addEventListener('click', function () {
      removeBook(dataBook.id);
    });

    const btnContainer = document.createElement('div');
    btnContainer.classList.add('action');
    btnContainer.append(btnBalik, removeBtn);

    articleIncomplate.append(btnContainer)

  } else {
    const btnDone = document.createElement('Button');
    btnDone.classList.add('green');
    btnDone.innerText = 'selesai dibaca';
    
    btnDone.addEventListener('click', function () {
      addkeSelesai(dataBook.id);
    });
    
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('red');
    removeBtn.innerText = 'Hapus buku';
 
    removeBtn.addEventListener('click', function () {
      removeBook(dataBook.id);
    });

    const btnContainer = document.createElement('div');
    btnContainer.classList.add('action');
    btnContainer.append(btnDone, removeBtn);

    articleIncomplate.append(btnContainer)
  }
 
  return articleIncomplate;

} 




function addkeSelesai (bookId) {
  const bookTarget = findbook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isComplate = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findbook(bookId) {
  for (const bookItem of Books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBook(bookId) {
  const asktoremove = confirm('Apakah kamu yakin ingin menghapus buku ini?')
  if (asktoremove) {
    const bookTarget = findbookIndex(bookId);
 
  if (bookTarget === -1) return;
 
  Books.splice(bookTarget, 1)
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  } 
}
 
 
function balikKeBelum(bookId) {
  const bookTarget = findbook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isComplate = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findbookIndex(bookId) {
  for (const index in Books) {
    if (Books[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}


function searchBook() {
  let value, book_item, bookTitle, i;
 
  value = document.getElementById('searchBookTitle').value.toLocaleLowerCase();
  book_item = document.getElementsByClassName('book_item');
 
  for (i =0; i < book_item.length; i++) {
    bookTitle = book_item[i].getElementsByTagName('h3');
    if(bookTitle[0].innerHTML.toLocaleLowerCase().indexOf(value) > -1){
      book_item[i].style.display = '';
    } else {
      book_item[i].style.display = 'none';
    }
  }
};

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(Books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}  

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BookShelf_APPS';
 
function isStorageExist(){
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      Books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}