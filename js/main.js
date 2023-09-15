const books = []
const RENDER_BOOKS = 'render-books'
const STORAGE_KEY = 'BookShelf-App'
const SAVED_EVENT = 'saved-book'

document.addEventListener('DOMContentLoaded', function(){
    const submitBook = document.getElementById('inputBook')
    submitBook.addEventListener('submit', function(event){
        swal({
            title: "Buku berhasil ditambahkan!",
            text: "Yeay buku berhasil ditambahkan",
            icon: "success",
            button: "Oke",
        });
    event.preventDefault()
    addBook()           
    })
    if(isStorageExist){
        loadDatafromWebStorage()
    }
})

const selesaiDibacaCheckbox = document.getElementById('inputBookIsComplete');
const submitButton = document.getElementById('incompleteButton');

selesaiDibacaCheckbox.addEventListener('change', function () {
    if (selesaiDibacaCheckbox.checked) {
        submitButton.innerText = 'Selesai Dibaca';
    } else {
        submitButton.innerText = 'Belum Selesai Dibaca';
    }
});

const searchItem = document.getElementById('searchBook');

searchItem.addEventListener('submit', function(event) {
    event.preventDefault();
    const searchBookTitle = document.getElementById('searchBookTitle').value.trim();
    searchBooksByTitle(searchBookTitle);
});

function searchBooksByTitle(title) {
    const inCompletedBookList = document.getElementById('incompleteBookshelfList');
    const completedBookList = document.getElementById('completeBookshelfList');

    inCompletedBookList.innerHTML = '';
    completedBookList.innerHTML = '';

    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

    if (filteredBooks.length === 0) {
        swal("Oopps buku yang anda cari tidak ada :(")
    } else {
        filteredBooks.forEach(bookItem => {
            const bookElement = makeBookList(bookItem);
            if (bookItem.isCompleted) {
                completedBookList.appendChild(bookElement);
            } else {
                inCompletedBookList.appendChild(bookElement);
            }
        });
    }
}


function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value
    const bookAuthor = document.getElementById('inputBookAuthor').value
    const bookYear = parseInt(document.getElementById('inputBookYear').value)
    const generateID = generateId()
    const isCompleted = document.getElementById('inputBookIsComplete').checked

    const booksObject = generateBooksObject(generateID, bookTitle, bookAuthor, bookYear, isCompleted)
    books.push(booksObject)
    document.dispatchEvent(new Event(RENDER_BOOKS))
    saveBooks()
}

function generateId(){
    return +new Date()
}

function generateBooksObject(id, title, author, year, isCompleted){
    return{
        id, title, author, year, isCompleted
    }
}

document.addEventListener(RENDER_BOOKS, function(){
    const inCompletedBookList = document.getElementById('incompleteBookshelfList')
    const completedBookList = document.getElementById('completeBookshelfList')

    inCompletedBookList.innerHTML = ''
    completedBookList.innerHTML = ''

    for(const bookItem of books){
        const bookElement = makeBookList(bookItem)
        if(bookItem.isCompleted){
            completedBookList.appendChild(bookElement)
        }else{
            inCompletedBookList.appendChild(bookElement)
        }
    }
})

function makeBookList(bookObject){
    const {id, title, author, year, isCompleted} = bookObject
    
    const bookItem = document.createElement('article')
    bookItem.classList.add('book_item')

    const bookTextTitle = document.createElement('h3')
    bookTextTitle.innerText = `Judul: ${title}`

    const bookTextAuthor = document.createElement('p')
    bookTextAuthor.innerText = `Penulis: ${author}`

    const bookTextYear = document.createElement('p')
    bookTextYear.innerText = `Tahun: ${year}`

    bookItem.append(bookTextTitle, bookTextAuthor, bookTextYear)

    const action = document.createElement('div')
    action.classList.add('action')
    bookItem.append(action)

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('trashButton')
    const trashIcon = document.createElement('i')
    trashIcon.classList.add('fa-solid', 'fa-trash')
    trashIcon.style.color = '#ff0000'

    deleteButton.append(trashIcon)

    const completeButton = document.createElement('button')
    completeButton.classList.add('green')

    if(!isCompleted){
        completeButton.innerText = 'Selesai Dibaca'
    }else{
        completeButton.innerText = 'Belum Selesai Dibaca'
    }

    completeButton.addEventListener('click', function(){

        swal({
            title: "Apakah anda yakin?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                bookObject.isCompleted = !bookObject.isCompleted
                document.dispatchEvent(new Event(RENDER_BOOKS))
                saveBooks()
                swal("Berhasil", {
                icon: "success",
                });
            } else {
              swal("Gagal memindahkan buku");
            }
          });
    })

    deleteButton.addEventListener('click', function(){
    swal({
        title: "Apakah anda yakin?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            removeBook(id)
          swal("Buku berhasil dihapus", {
            icon: "success",
          });
        } else {
          swal("buku tidak jadi dihapus");
        }
      });
    })

    action.append(completeButton, deleteButton)

    return bookItem   
}

function findBook(bookId){
    for(const bookItem of books){
        if(bookItem.id === bookId)
        return bookItem
    }
    return null
}

function findBookIndex(bookId){
    for(const index of books){
        if(books[index]===bookId){
            return index
        }
    }
}

function removeBook(bookId){
    const bookTarget = findBookIndex(bookId)
    if(bookTarget === -1) return
    books.splice(bookTarget, 1)
    document.dispatchEvent(new Event(RENDER_BOOKS))
    saveBooks()
    
}

function addBookCompleted(bookId){
    const bookTarget = findBook(bookId)

    if(bookTarget === null) return

    bookTarget.isCompleted = true
    document.dispatchEvent(new Event(RENDER_BOOKS))
    saveBooks()
}

function addBookNotCompleted(bookId){
    const bookTarget = findBook(bookId)

    if(bookTarget === null) return

    bookTarget.isCompleted = false
    document.dispatchEvent(new Event(RENDER_BOOKS))
    saveBooks()
}

function saveBooks(){
    if(isStorageExist()){
        const parsed = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY, parsed)
        document.dispatchEvent(new Event(SAVED_EVENT))
    }
}

function isStorageExist(){
    if(typeof(Storage) === undefined){{
        alert('browser anda tidak mendukung!')
        return false
    }}
    return true
}
document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY))
})

function loadDatafromWebStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY)
    const data = JSON.parse(serializedData)
    
     if(data !== null){
        for(const book of data){
            books.push(book)
        }
     }
     document.dispatchEvent(new Event(RENDER_BOOKS))
}
