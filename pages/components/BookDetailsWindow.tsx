import Image from 'next/image';
import { ChangeEvent, ChangeEventHandler, Dispatch, SetStateAction } from 'react';


function BookDetailsInput({value, fieldType, handleEdit, autofocus}:{value: string, fieldType: string, handleEdit: Function, autofocus: boolean}){
  return(
    <input autoFocus={autofocus} onChange={(e:ChangeEvent<HTMLInputElement>) => handleEdit(e, fieldType)} type="text" className="book-details-input"  id={`book-details-${fieldType}`} value={value}/>
  )
}

export default function BookDetailsWindow({title, author, publisher, isbn, showDetails, setShowDetails, handleEdit}:{title:string, author:string, publisher: string, isbn: string, showDetails:boolean, setShowDetails:Dispatch<SetStateAction<boolean>>, handleEdit: Function}){

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
      <div className="book-details-content">
          <span className="book-details-close">&times;</span>
          <div className="book-details-text">

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>Title</h2>
              </div>
            
              <BookDetailsInput autofocus={true} value={title} fieldType='title' handleEdit={(e:ChangeEventHandler<HTMLInputElement>) => handleEdit(e, 'title')}/>
              <i className="far fa-check-circle edit-confirm"></i>
            </div>

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>Author</h2>
              </div>
              <BookDetailsInput autofocus={false} value={author} fieldType='author' handleEdit={(e:ChangeEventHandler<HTMLInputElement>) => handleEdit(e, 'author')}/>
              <i className="far fa-check-circle edit-confirm"></i>
            </div>

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>Publisher</h2>
              </div>
              <BookDetailsInput autofocus={false} value={publisher} fieldType='publisher' handleEdit={(e:ChangeEventHandler<HTMLInputElement>) => handleEdit(e,'publisher')}/>
              <i className="far fa-check-circle edit-confirm"></i>
            </div>

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>ISBN</h2>
              </div>
              <BookDetailsInput autofocus={false} value={isbn} fieldType='isbn' handleEdit={(e:ChangeEventHandler<HTMLInputElement>) => handleEdit(e, 'isbn')}/>
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
 
        </div>
      </div>
  )
}