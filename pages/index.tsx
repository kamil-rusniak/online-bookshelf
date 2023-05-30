import Head from 'next/head'
import Script from 'next/script'
import { useState, MouseEventHandler, useEffect, Dispatch, SetStateAction } from 'react';
import { useSession, signIn, signOut } from "next-auth/react"
import { getBookJson, getAuthor } from './api/openlibrary';
import BookElement from '../components/BookElement';
import AddingTab from '../components/AddingTab'
import BooksTab from '../components/BooksTab'
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import Link from 'next/link';


type BookObject = {
  id: string,
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
  const [booksFromDb, setBooksFromDb] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
      onSwitch={(switchType:string, setLoading:Dispatch<SetStateAction<boolean>>) => handleSwitch(switchType, book.id, book.status, setLoading)} 
      onDelete={() => handleDelete(book.id)}
      handleEdit={(e:React.MouseEvent<HTMLButtonElement, MouseEvent>, setShowSaveBtn:Dispatch<SetStateAction<boolean>>) => handleEdit(e, book.id, setShowSaveBtn)}
    />
  );

  async function handleSwitch(switchType:string, bookId:string, status:string, setLoading:Dispatch<SetStateAction<boolean>>){
    setLoading(true)
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
        setLoading(false)
      }, 1000);
    } catch (error) {
      console.error(error);
      setLoading(false)
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

  async function handleEdit(e:React.MouseEvent<HTMLButtonElement, MouseEvent>, bookId:string, setShowSaveBtn:Dispatch<SetStateAction<boolean>>){
    e.preventDefault();

    const target = e.target as Element;
    const editForm = (target as HTMLFormElement).form;

    const formData = new FormData(editForm);
    const formJson = Object.fromEntries(formData.entries());
    const title = formJson.title as string;
    const authors = formJson.author as string;
    const publisher = formJson.publisher as string;
    const genre = formJson.genre as string;
    const isbn = formJson.isbn as string;

    try {
      const body = { title, authors, isbn, publisher, genre };
      await fetch(`/api/book/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      getBooks();
      setShowSaveBtn(false);
    } catch (error) {
      console.error(error);
      setShowSaveBtn(false);
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
    const isbn = formJson.isbn as string;
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
    setIsLoading(true);

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
      const isbn = formJson.isbn as string;
      const status = formJson.section as string;
      interface Author{
        key: string
      }

      const publisher = publisherResult.join(', ');
      setIsLoading(false);

      function getAuthorsString(){
        return new Promise(resolve => {
          authorKeysArray.forEach((author:Author) => {
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
      setIsLoading(false);
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

      {isLoading && <Spinner />}
      {errorMsg && <ErrorMessage message={errorMsg} setErrorMsg={setErrorMsg}/>}
      
      {activeTab === 'add-books' ? (
        <AddingTab handleAddClick={handleAddClick} handleSearchClick={handleSearchClick} isLoading={isLoading}></AddingTab>
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
        <h1 className="title">Online <i className="fas fa-book orange"></i> Bookshelf</h1>
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