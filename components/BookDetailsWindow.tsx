import Image from 'next/image';
import { ChangeEventHandler, Dispatch, MouseEventHandler, SetStateAction, useState } from 'react';

interface BookDetailsInput {
  value: string;
  fieldType: string;
  autofocus: boolean;
  handleChange:ChangeEventHandler<HTMLInputElement>;
}

interface BookDetailsWindow {
  id:string;
  title:string;
  author:string;
  publisher: string;
  genre: string;
  isbn: string;
  showDetails:boolean;
  setShowDetails:Dispatch<SetStateAction<boolean>>;
  handleEdit: Function;
  showSaveBtn:boolean;
  setShowSaveBtn:Dispatch<SetStateAction<boolean>>;
  styleSaveBtn:boolean;
  setStyleSaveBtn:Dispatch<SetStateAction<boolean>>;
}

function SaveBtn({className, handleEdit}:{className:string, handleEdit:MouseEventHandler}){
  return(
    <button className={className} onClick={handleEdit}>Save</button>
  )
}

function BookDetailsInput({value, fieldType, autofocus, handleChange}:BookDetailsInput){
  return(
    <input autoFocus={autofocus} type="text" name={fieldType} className="book-details-input" id={`book-details-${fieldType}`} onChange={handleChange} defaultValue={value}/>
  )
}

export default function BookDetailsWindow({id, title, author, publisher, genre, isbn, showDetails, setShowDetails, handleEdit, showSaveBtn, setShowSaveBtn, styleSaveBtn, setStyleSaveBtn}:BookDetailsWindow){

  function showButton(){
    if (showSaveBtn === false){
      setShowSaveBtn(true);
      if (styleSaveBtn === false){
        setTimeout(() => {
          setStyleSaveBtn(true);
        }, 100);
      }
    }
  }

  function handleClose(e:React.MouseEvent<Element, MouseEvent>){
    const target = e.target as Element;
      if (target.classList.contains('book-details-close') || (target.classList.contains('book-details') &&  target.classList.contains('active'))){
        setShowDetails(false);
      }
  }

  function handleKeyDown(e:React.KeyboardEvent){
    if (e.key === 'Escape' || e.code === 'Escape'){
      setShowDetails(false);
    }
  }

  return(
    <div className={'book-details' + `${showDetails && ' active'}`} onMouseDown={(e) => handleClose(e)} onKeyDown={(e) => handleKeyDown(e)} tabIndex={-1}>
      <form className="book-details-content">
          <span className="book-details-close">&times;</span>
          <div className="book-details-text">

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>Title</h2>
              </div>
            
              <BookDetailsInput autofocus={true} value={title} fieldType='title' handleChange={showButton}/>
            </div>

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>Author</h2>
              </div>
              <BookDetailsInput autofocus={false} value={author} fieldType='author' handleChange={showButton}/>
            </div>

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>Publisher</h2>
              </div>
              <BookDetailsInput autofocus={false} value={publisher} fieldType='publisher' handleChange={showButton}/>
            </div>

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>Genre</h2>
              </div>
              <BookDetailsInput autofocus={false} value={genre} fieldType='genre' handleChange={showButton}/>
            </div>

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>ISBN</h2>
              </div>
              <BookDetailsInput autofocus={false} value={isbn} fieldType='isbn' handleChange={showButton}/>
            </div>

            {showSaveBtn && 
             <SaveBtn className={`book-update-button ${styleSaveBtn && 'active'}`} handleEdit={(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleEdit(e, setShowSaveBtn, setStyleSaveBtn)}/>
            }

          </div>

          {isbn && 
            <div className="book-image"> 
              <Image
                src={`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`}
                alt="${title} Book Cover"
                fill={true}
                sizes='20vw'
              />
            </div>
          }

        </form>
      </div>
  )
}