import Head from 'next/head'
import Script from 'next/script'
import SettingsTab from '@/components/SettingsTab';
import { useSession, signIn, signOut } from "next-auth/react"

export default function Settings(){
  const { data: session } = useSession()
  const user = session?.user;
  const userId = user?.id as string;
  
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
            <SettingsTab id={userId}/>
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
        <a href="https://openlibrary.org/" target='_blank' rel='noreferrer'>Using Open Library API</a>
        <a href="https://undraw.co" target='_blank' rel='noreferrer'>Background image from undraw.co</a>
      </footer>
    </>
  )
}