import Head from 'next/head'
import Script from 'next/script'
import { useState, MouseEventHandler, ReactElement, ReactComponentElement } from 'react';
import { getBookJson, getAuthor } from './api/openlibrary';
import BookElement from './BookElement';
import BookAddForm from './BookAddForm';


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

  const bookListObject = [{
    id: 0,
    title: `To read book title`,
    author: `Book Author`,
    publisher: 'Publisher',
    isbn:'000',
    status:'to-read',
  },
  {
    id: 1,
    title: `Finished book`,
    author: `Book Author`,
    publisher: 'Publisher',
    isbn:'111',
    status:'finished',
  },
  {
    id: 2,
    title: `Reading/in-progress book`,
    author: `Book Author`,
    publisher: 'Publisher',
    isbn:'222',
    status:'reading',
  },
  {
    id: 3,
    title: `Harry Potter and the Philosopher's Stone`,
    author: `J. K. Rowling`,
    publisher: 'Bloomsbury',
    isbn:'333',
    status:'to-read',
  },
  {
    id: 4,
    title: `A Book to Read`,
    author: `Author`,
    publisher: 'Publisher',
    isbn:'444',
    status:'to-read',
  },
  {
    id: 5,
    title: `Next Book to Read`,
    author: `Mr Author`,
    publisher: 'Publisher',
    isbn:'555',
    status:'to-read',
  },
  {
    id: 6,
    title: `Another Book to Read`,
    author: `Mrs Author`,
    publisher: 'Publisher',
    isbn:'666',
    status:'to-read',
  }];

// 9781408855652
// 1780894554


  // do it only for first time and then read from local storage and setBookList to something from local storage
  // when switching book don't move them around in between different lists or change IDs or something - just update the status
  const [bookList, setBookList] = useState(bookListObject);

  let toReadBookList = bookList.map((book:any) =>
    <BookElement
      key={book.id} 
      title={book.title} 
      author={book.author} 
      isbn={book.isbn} 
      publisher={book.publisher} 
      status={book.status} 
      onSwitch={(e:any) => handleSwitch(e, book.id)} 
      onDelete={() => handleDelete(book.id)}
    />
  );

  function handleSwitch(switchType:any, bookId:any){

    console.log(switchType);
    console.log(bookId);
    console.log(bookList);

    let newBookList:any = [...bookList];
    let targetBook = newBookList.find((book:any) => book.id === bookId);
    console.log(newBookList);
    console.log(targetBook);

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


    setBookList(newBookList);
  }

  
  function handleDelete(bookId:any){
    let newBookList:any = [...bookList];
    newBookList = newBookList.filter((book:any) => book.id !== bookId);
    setBookList(newBookList);
  }


  function handleAddClick(e:any){
    e.preventDefault();
    
    const addForm = e.target.form;
    const formData = new FormData(addForm);
    const formJson = Object.fromEntries(formData.entries());
    const title = formJson.title;
    const author = formJson.author;
    const publisher = formJson.publisher;
    const isbn = formJson.isbn;
    const status = 'to-read';

    let newBookList:any = [...bookList];
    newBookList = [...newBookList, { 
      id: bookList.length + 1,
      title: title,
      author: author,
      publisher: publisher,
      isbn: isbn,
      status: status
     }];
    setBookList(newBookList);
  }

  function handleSearchClick(e:any){
    e.preventDefault();

    const searchForm = e.target.parentNode.form
    const formData = new FormData(searchForm);
    const formJson = Object.fromEntries(formData.entries());

    getBookJson(formJson.isbn).then((result) => {
      let authorsArray:any;
      console.log(result);
      const title = result.title;
      const publisher = result.publishers;
      const authorKeysArray = result.authors;
      const status = 'to-read';

      authorKeysArray.forEach((author:any) => {
          const authorKey = author.key;
          getAuthor(authorKey).then((result) => {
            const authorName = result.name;
              console.log(authorName);
              let newBookList:any = [...bookList];
              newBookList = [...newBookList, { 
                id: bookList.length + 1,
                title: title,
                author: authorName,
                publisher: publisher,
                isbn: formJson.isbn,
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
    });

  }

  const [activeTab, setActiveTab] = useState('');

  if (activeTab == ''){
    setActiveTab('add-books');
  }

  function handleTabClick(e:any){
    setActiveTab(e.target.value);
  }
  
  return(
    <>
       <nav className="nav">
        <NavigationTabButton value='add-books' className={`adding-page-button ${activeTab == 'add-books' ? 'active-btn': ''}`} content='Add books' onTabClick={(e:any) => handleTabClick(e)} />
        <NavigationTabButton value='my-books' className={`book-page-button ${activeTab == 'my-books' ? 'active-btn': ''}`} content='My books' onTabClick={(e:any) => handleTabClick(e)} />
      </nav>

      <AddingTab className={`${activeTab == 'add-books' ? 'active-page': ''}`} handleAddClick={handleAddClick} handleSearchClick={handleSearchClick}></AddingTab>
      <BooksTab bookList={toReadBookList} className={`${activeTab == 'my-books' ? 'active-page': ''}`} ></BooksTab>
    </>

  )
}

function AddingTab({className, handleAddClick, handleSearchClick}: {className: string, handleAddClick:any, handleSearchClick:any}){
  return(
    <section className={`main-page adding-page ${className}`}>
      <BookAddForm handleAddClick={handleAddClick} handleSearchClick={handleSearchClick}></BookAddForm>
    </section>
  )
}

function BooksStatusSection({sectionActiveStatus, children, section, onSectionClick, bookList}:{sectionActiveStatus: string, children: string, section: string, onSectionClick: any, bookList:any}){

    bookList = bookList.filter((book:any) => {
      return book.props.status === section;
    });

  return(
    <article className={`books-status-section ${section} ${sectionActiveStatus}`} >
      <h2 className="segment-button" id={section} onClick={onSectionClick}>{children}</h2>
      <div className={`${section}-list`}>
        {bookList}
      </div>
    </article>
  )
}

function BooksTab({className, bookList}: {className: string, bookList: any}){
  const [activeSection, setActiveSection] = useState('');

  if (activeSection === ''){
    setActiveSection('to-read');
  }

  function handleSectionClick(e:any){
    setActiveSection(e.target.id)
  }

  return(
    <section className={`main-page book-page ${className}`}>
      <BooksStatusSection section={'to-read'} sectionActiveStatus={`${activeSection == 'to-read' ? 'active' : '' }`} onSectionClick={(e:any) => handleSectionClick(e)} bookList={bookList}>To Read</BooksStatusSection>
      <BooksStatusSection section={'reading'} sectionActiveStatus={`${activeSection == 'reading' ? 'active' : '' }`} onSectionClick={(e:any) => handleSectionClick(e)} bookList={bookList}>Reading</BooksStatusSection>
      <BooksStatusSection section={'finished'} sectionActiveStatus={`${activeSection == 'finished' ? 'active' : '' }`} onSectionClick={(e:any) => handleSectionClick(e)} bookList={bookList}>Finished</BooksStatusSection>
    </section>
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

      <p id="alert" className="hidden"></p>
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
