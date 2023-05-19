import Image from 'next/image';
import { Dispatch, MouseEventHandler, SetStateAction } from 'react';


function BookDetailsInput({value, fieldType, autofocus}:{value: string, fieldType: string, autofocus: boolean}){
  return(
    <input autoFocus={autofocus} type="text" name={fieldType} className="book-details-input" id={`book-details-${fieldType}`} defaultValue={value}/>
  )
}

export default function BookDetailsWindow({id, title, author, publisher, genre, isbn, showDetails, setShowDetails, handleEdit}:{id:string, title:string, author:string, publisher: string, genre: string, isbn: string, showDetails:boolean, setShowDetails:Dispatch<SetStateAction<boolean>>, handleEdit: MouseEventHandler}){

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
          <button className='book-update-button' onClick={handleEdit}>Save</button>
          <div className="book-details-text">

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>Title</h2>
              </div>
            
              <BookDetailsInput autofocus={true} value={title} fieldType='title'/>
              <i className="far fa-check-circle edit-confirm"></i>
            </div>

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>Author</h2>
              </div>
              <BookDetailsInput autofocus={false} value={author} fieldType='author'/>
              <i className="far fa-check-circle edit-confirm"></i>
            </div>

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>Publisher</h2>
              </div>
              <BookDetailsInput autofocus={false} value={publisher} fieldType='publisher'/>
              <i className="far fa-check-circle edit-confirm"></i>
            </div>

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>Genre</h2>
              </div>
              <BookDetailsInput autofocus={false} value={genre} fieldType='genre'/>
              <i className="far fa-check-circle edit-confirm"></i>
            </div>

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>ISBN</h2>
              </div>
              <BookDetailsInput autofocus={false} value={isbn} fieldType='isbn'/>
              <i className="far fa-check-circle edit-confirm"></i>
            </div>

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