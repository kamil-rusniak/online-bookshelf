import Head from 'next/head'
import Script from 'next/script'
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useSession, signIn, signOut } from "next-auth/react"
import { getBookJson, getAuthor } from './api/openlibrary';
import BookElement from '../components/BookElement';
import AddingTab from '../components/AddingTab'
import BooksTab from '../components/BooksTab'
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import Link from 'next/link';
import { NavigationTabButtonProps, AuthorProps } from '@/types/interfaces';

type BookObject = {
  id: string,
  title: string,
  author: string,
  publisher: string,
  genre: string,
  isbn: string,
  status: string
}


function NavigationTabButton({value, content, onTabClick, className}: NavigationTabButtonProps){
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
  const [booksFromDb, setBooksFromDb] = useState([]);
  const [bookIsAdding, setBookIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');


  async function getBooks() {
    try {
      const res = await fetch(`/api/book/getBooks`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      // console.log(data);
      setBooksFromDb(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getBooks();
  }, [])

  let bookList = booksFromDb.map((book:BookObject) =>
    <BookElement
      key={book.id} 
      id={book.id}
      title={book.title} 
      author={book.author} 
      isbn={book.isbn} 
      publisher={book.publisher} 
      genre={book.genre} 
      status={book.status} 
      onSwitch={(switchType:string, setSwitchLoading:Dispatch<SetStateAction<boolean>>) => handleSwitch(switchType, book.id, book.status, setSwitchLoading)} 
      onDelete={() => handleDelete(book.id)}
      handleEdit={(e:React.MouseEvent<HTMLButtonElement, MouseEvent>, setShowSaveBtn:Dispatch<SetStateAction<boolean>>, setStyleSaveBtn:Dispatch<SetStateAction<boolean>>, setUpdatingDetailsSpinner:Dispatch<SetStateAction<boolean>>) =>
         handleEdit(e, book.id, setShowSaveBtn, setStyleSaveBtn, setUpdatingDetailsSpinner)}
    />
  );

  async function handleSwitch(switchType:string, bookId:string, status:string, setSwitchLoading:Dispatch<SetStateAction<boolean>>){
    setSwitchLoading(true)
    if(status === 'to-read'){
      status = 'reading';
    } else if(status === 'reading'){
      if (switchType === 'up'){
        status = 'to-read';
      } else{
        status = 'finished';
      }
    } else {
      status = 'reading';
    }

    try {
      const body = { status };
      await fetch(`/api/book/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      getBooks();
      setTimeout(() => {
        setSwitchLoading(false)
      }, 1000);
    } catch (error) {
      console.error(error);
      setSwitchLoading(false)
    }
  }

  
  async function handleDelete(bookId:string){
    try {
      await fetch(`/api/book/${bookId}`, {
        method: "DELETE",
      });
      getBooks();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleEdit(e:React.MouseEvent<HTMLButtonElement, MouseEvent>, bookId:string, setShowSaveBtn:Dispatch<SetStateAction<boolean>>, setStyleSaveBtn:Dispatch<SetStateAction<boolean>>,  setUpdatingDetailsSpinner:Dispatch<SetStateAction<boolean>>){
    e.preventDefault();
    setUpdatingDetailsSpinner(true);
    const target = e.target as Element;
    const editForm = (target as HTMLFormElement).form;

    const formData = new FormData(editForm);
    const formJson = Object.fromEntries(formData.entries());
    const title = formJson.title as string;
    const authors = formJson.author as string;
    const publisher = formJson.publisher as string;
    const genre = formJson.genre as string;
    const isbnInput = formJson.isbn as string;
    const isbn = isbnInput.replaceAll("-", "");

    try {
      const body = { title, authors, isbn, publisher, genre };
      await fetch(`/api/book/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      getBooks();
      setStyleSaveBtn(false);
      setTimeout(() => {
        setShowSaveBtn(false);
      }, 100);
      setUpdatingDetailsSpinner(false);
    } catch (error) {
      console.error(error);
      setStyleSaveBtn(false);
      setTimeout(() => {
        setShowSaveBtn(false);
      }, 100);
      setUpdatingDetailsSpinner(false);
    }
  }

  async function handleAddClick(e:React.MouseEvent<Element, MouseEvent>){
    e.preventDefault();
    setErrorMsg('');
    
    const target = e.target as Element;
    const addForm = (target as HTMLFormElement).form;
    const formData = new FormData(addForm);
    const formJson = Object.fromEntries(formData.entries());
    const title = formJson.title as string;
    const authors = formJson.author as string;
    const publisher = formJson.publisher as string;
    const genre = formJson.genre as string;
    const isbnInput = formJson.isbn as string;
    const isbn = isbnInput.replaceAll("-", "");
    const status = formJson.section as string;

    try {
      const body = { title, authors, isbn, publisher, genre, status };
      await fetch(`/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      getBooks();
    } catch (error) {
      console.error(error);
    }
    
    addForm.reset();
  }

  async function handleSearchClick(e:React.MouseEvent<Element, MouseEvent>){
    e.preventDefault();
    setErrorMsg('');
    setBookIsAdding(true);

    const target = e.target as Element;
    const searchForm = (target as HTMLFormElement).form;
    const formData = new FormData(searchForm);
    const formJson = Object.fromEntries(formData.entries());

    getBookJson(formJson.isbn).then(async (result) => {
      let authorsArray:string[] = [];

      const title = result.title;
      const publisherResult = result.publishers;
      const authorKeysArray = result.authors;
      const genre = formJson.genre as string;
      const isbnInput = formJson.isbn as string;
      const isbn = isbnInput.replaceAll("-", "");
      const status = formJson.section as string;


      const publisher = publisherResult.join(', ');
      setBookIsAdding(false);

      function getAuthorsString(){
        return new Promise(resolve => {
          authorKeysArray.forEach((author:AuthorProps) => {
            getAuthor(author.key).then((result) => {
              const authorName = result.name;
              authorsArray.push(`${authorName}`);
              if(authorsArray.length === authorKeysArray.length){
                const authorsString = authorsArray.join(', ');
                resolve(authorsString);
              }
            })
            .catch((err) => {
              console.log(err);
            });  
          });  
        });
      }

      const authors = await getAuthorsString();

      if (authors){
        // console.log(authors);
        try {
          const body = { title, authors, isbn, publisher, genre, status };
          await fetch(`/api/book`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          getBooks();
        } catch (error) {
          console.error(error);
        }
      }  
    })
    .catch((err) => {
      console.log(err);
      setBookIsAdding(false);
      setErrorMsg('Unable to fetch book data')
    });

    searchForm.reset();
  }

  const [activeTab, setActiveTab] = useState('');

  if (activeTab === ''){
    setActiveTab('add-books');
  }

  function handleTabClick(e:React.MouseEvent<Element, MouseEvent>){
    const target = e.target as HTMLButtonElement;
    setActiveTab(target.value);
  }
  
  return(
    <>
      <Link href="/settings" className='settings-button'><i className="fas fa-gears"></i></Link>
      <nav className="nav">
        <NavigationTabButton value='add-books' className={`adding-page-button ${activeTab === 'add-books' ? 'active-btn': ''}`} content='Add books' onTabClick={(e) => handleTabClick(e)} />
        <NavigationTabButton value='my-books' className={`book-page-button ${activeTab === 'my-books' ? 'active-btn': ''}`} content='My books' onTabClick={(e) => handleTabClick(e)} />
      </nav>

      {bookIsAdding && <Spinner />}
      {errorMsg && <ErrorMessage message={errorMsg} setErrorMsg={setErrorMsg}/>}
      
      {activeTab === 'add-books' ? (
        <AddingTab handleAddClick={handleAddClick} handleSearchClick={handleSearchClick} bookIsAdding={bookIsAdding}></AddingTab>
        ) : (
        <BooksTab bookList={bookList}></BooksTab>
      )}
    </>

  )
}


export default function Home() {
  const { data: session } = useSession()
  const user = session?.user;

  async function getUser() {
    try {
      const res = await fetch(`/api/user/getUser`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if(data.length === 1){
        if (data[0].settingBookSave === null) {
          localStorage.setItem("settingBookSave", 'to-read');
        } else {
          localStorage.setItem("settingBookSave", data[0].settingBookSave);
        }

      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (user){
      getUser();
    }
  }, [user])

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
        <Link href={'/'}><h1 className="title">Online <i className="fas fa-book orange"></i> Bookshelf</h1></Link>
      </header>

      {user ? (
        <>
          <div className="auth-wrapper logout">
            <p>Signed in as {user.email}</p>
            <button className='auth-button' onClick={() => signOut()}>Sign out</button>
          </div>
          <Tabs/>
        </>
      ) : (
        <>
          <div className="auth-wrapper login">
            <button className='auth-button' onClick={() => signIn()}>Sign in</button>  
          </div>
          <div className="intro-message">
            <h2>Online Bookshelf is a full-stack web app that lets you manage and keep track of your books.</h2>
          </div>
        </>
      )}

      <footer>
        <a href="https://kamilrusniak.com" target='_blank' rel='noreferrer'>Made by Kamil Ruśniak</a>
        <a href="https://openlibrary.org" target='_blank' rel='noreferrer'>Using Open Library API</a>
        <a href="https://undraw.co" target='_blank' rel='noreferrer'>Bg image from undraw.co</a>
        <a href="https://fontawesome.com" target='_blank' rel='noreferrer'>Icons from Font Awesome</a>
      </footer>
    </>
  )
}