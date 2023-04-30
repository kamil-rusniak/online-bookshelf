import Head from 'next/head'
import Script from 'next/script'
import { useState, MouseEventHandler, ReactElement } from 'react';
import { getBookJson, getAuthor } from './api/openlibrary';
import BookElement from './components/BookElement';
import AddingTab from '././components/AddingTab'
import BooksTab from '././components/BooksTab'
import Spinner from './components/Spinner';
import ErrorMessage from './components/ErrorMessage';

type BookObject = {
  id: number,
  title: string,
  author: string,
  publisher: string,
  genre: string,
  isbn: string,
  status: string
}

function NavigationTabButton({value, content, onTabClick, className}: {value: string, content:string, onTabClick: MouseEventHandler<HTMLButtonElement>, className: string}){
  return (
    <button
    value={value}
    onClick={onTabClick}
    className={"change-button page-button " + className}
   >
    {content}
   </button>
  )
}

function Tabs(){
  const bookListObject:BookObject[] = [{
    id: 0,
    title: `To read book title (NO ISBN)`,
    author: `Book Author`,
    publisher: 'Publisher',
    genre: 'Fantasy',
    isbn: '',
    status:'to-read'
  },
  {
    id: 1,
    title: `Finished book`,
    author: `Book Author`,
    publisher: 'Publisher',
    genre: 'Fantasy',
    isbn: '111',
    status:'finished'
  },
  {
    id: 2,
    title: `Reading/in-progress book`,
    author: `Book Author`,
    publisher: 'Publisher',
    genre: 'Fantasy',
    isbn: '222',
    status:'reading'
  },
  {
    id: 3,
    title: `Harry Potter and the Philosopher's Stone`,
    author: `J. K. Rowling`,
    publisher: 'Bloomsbury',
    genre: 'Fantasy',
    isbn: '9781408855652',
    status:'to-read'
  },
  {
    id: 4,
    title: `A Book to Read`,
    author: `Author`,
    publisher: 'Publisher',
    genre: 'Fantasy',
    isbn: '444',
    status:'to-read'
  },
  {
    id: 5,
    title: `Next Book to Read`,
    author: `Mr Author`,
    publisher: 'Publisher',
    genre: 'Fantasy',
    isbn: '555',
    status:'to-read'
  },
  {
    id: 6,
    title: `Another Book to Read`,
    author: `Mrs Author`,
    publisher: 'Publisher',
    genre: 'Fantasy',
    isbn: '666',
    status:'to-read'
  }];

// 9781408855652 0545596270 - one author
// 1780894554 - 2 author but one author key so counts as one author
// 1501192272 - 2 'separate' authors
// 9780063088146 - 5 'separate' authors


  // do it only for first time and then read from local storage and setBookList to something from local storage
  // when switching book don't move them around in between different lists or change IDs or something - just update the status
  const [bookList, setBookList] = useState(bookListObject);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  let toReadBookList = bookList.map((book:BookObject) =>
    <BookElement
      key={book.id} 
      title={book.title} 
      author={book.author} 
      isbn={book.isbn} 
      publisher={book.publisher} 
      genre={book.genre} 
      status={book.status} 
      onSwitch={(switchType:string) => handleSwitch(switchType, book.id)} 
      onDelete={() => handleDelete(book.id)}
      handleEdit={(e:Event, fieldType:string) => handleEdit(e, book.id, fieldType)}
    />
  );

  function handleSwitch(switchType:string, bookId:number){

    console.log(switchType);
    console.log(bookId);
    console.log(bookList);

    let newBookList:BookObject[] = [...bookList];
    let targetBook = newBookList.find((book:BookObject) => book.id === bookId);

    if(targetBook != undefined){
      if(targetBook.status === 'to-read'){
        targetBook.status = 'reading';
      } else if(targetBook.status === 'reading'){
        if (switchType === 'up'){
          targetBook.status = 'to-read';
        } else{
          targetBook.status = 'finished';
        }
      } else {
        targetBook.status = 'reading';
      }
    }

    setBookList(newBookList);
  }

  
  function handleDelete(bookId:number){
    let newBookList:BookObject[] = [...bookList];
    newBookList = newBookList.filter((book:BookObject) => book.id !== bookId);
    setBookList(newBookList);
  }

  function handleEdit(e:Event, bookId:number, fieldType:string){
    let newBookList:BookObject[] = [...bookList];
    let targetBook = newBookList.find((book:BookObject) => book.id === bookId);

    if (targetBook != undefined){
      // @ts-ignore
      targetBook[fieldType] = e.target.value;
    }

    setBookList(newBookList);
  }

  function handleAddClick(e:React.MouseEvent<Element, MouseEvent>){
    e.preventDefault();
    setErrorMsg('');
    
    const target = e.target as Element;
    const addForm = (target as HTMLFormElement).form;
    const formData = new FormData(addForm);
    const formJson = Object.fromEntries(formData.entries());
    const title = formJson.title as string;
    const author = formJson.author as string;
    const publisher = formJson.publisher as string;
    const genre = formJson.genre as string;
    const isbn = formJson.isbn as string;
    const status = formJson.section as string;

    let newBookList:BookObject[] = [...bookList];
    newBookList = [...newBookList, { 
      id: bookList.length + 1,
      title: title,
      author: author,
      publisher: publisher,
      genre: genre,
      isbn: isbn,
      status: status
     }];
    setBookList(newBookList);

    addForm.reset();
  }

  function handleSearchClick(e:React.MouseEvent<Element, MouseEvent>){
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    const target = e.target as Element;
    const searchForm = (target as HTMLFormElement).form;
    const formData = new FormData(searchForm);
    const formJson = Object.fromEntries(formData.entries());

    getBookJson(formJson.isbn).then((result) => {
      let authorsArray:string[] = [];
      console.log(result);
      const title = result.title;
      const publisher = result.publishers;
      const authorKeysArray = result.authors;
      const genre = formJson.genre as string;
      const isbn = formJson.isbn as string;
      const status = formJson.section as string;
      interface Author{
        key: string
      }

      setIsLoading(false);

      authorKeysArray.forEach((author:Author) => {
          getAuthor(author.key).then((result) => {
            const authorName = result.name;
            authorsArray.push(` ${authorName}`);

            let newBookList:BookObject[] = [...bookList];
            newBookList = [...newBookList, { 
              id: bookList.length + 1,
              title: title,
              author: authorsArray.toString(),
              publisher: publisher,
              genre: genre,
              isbn: isbn,
              status: status
            }];
            setBookList(newBookList);

          })
          .catch((err) => {
            console.log(err);
          });      
      });     
    })
    .catch((err) => {
      console.log(err);
      setIsLoading(false);
      setErrorMsg('Unable to fetch book data')
    });

    searchForm.reset();
  }

  const [activeTab, setActiveTab] = useState('');

  if (activeTab == ''){
    setActiveTab('add-books');
  }

  function handleTabClick(e:React.MouseEvent<Element, MouseEvent>){
    const target = e.target as HTMLButtonElement;
    setActiveTab(target.value);
  }
  
  return(
    <>
       <nav className="nav">
        <NavigationTabButton value='add-books' className={`adding-page-button ${activeTab == 'add-books' ? 'active-btn': ''}`} content='Add books' onTabClick={(e) => handleTabClick(e)} />
        <NavigationTabButton value='my-books' className={`book-page-button ${activeTab == 'my-books' ? 'active-btn': ''}`} content='My books' onTabClick={(e) => handleTabClick(e)} />
      </nav>

      {isLoading && <Spinner />}
      {errorMsg && <ErrorMessage message={errorMsg} setErrorMsg={setErrorMsg}/>}
      
      {activeTab == 'add-books' ? (
        <AddingTab handleAddClick={handleAddClick} handleSearchClick={handleSearchClick} isLoading={isLoading}></AddingTab>
        ) : (
        <BooksTab bookList={toReadBookList} ></BooksTab>
      )}
    </>

  )
}


export default function Home() {

  return (
    <>
      <Head>
        <title>Online Bookshelf</title>
        <meta 
          name="description"
          content="Online Bookshelf is a web app that allows you to add and manage your books."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </Head>

      <Script src="https://kit.fontawesome.com/d115c62847.js" crossOrigin="anonymous" async />
    
      <header>
        <h1 className="title">Online <i className="fas fa-book orange"></i> Bookshelf</h1>
      </header>

      <Tabs/>

      <footer>
        <a href="https://kamilrusniak.com" target='_blank' rel='noreferrer'>Made by Kamil Ruśniak</a>
        <a href="https://openlibrary.org/" target='_blank' rel='noreferrer'>Using Open Library API</a>
        <a href="https://undraw.co" target='_blank' rel='noreferrer'>Background image from undraw.co</a>
        <a>Data is stored in Local Storage</a>
      </footer>
    </>
  )
}