import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';


export default function BookDetailsWindow({title, author, publisher, isbn, showDetails, setShowDetails}:{title:string, author:string, publisher: string, isbn: number, showDetails:boolean, setShowDetails:Dispatch<SetStateAction<boolean>>}){

  function handleClose(e:React.MouseEvent<Element, MouseEvent>){
    const target = e.target as Element;
      if (target.classList.contains('book-details-close') || (target.classList.contains('book-details') &&  target.classList.contains('active'))){
        setShowDetails(false);
      }
  }

  return(
    <div className={'book-details' + `${showDetails && ' active'}`} onMouseDown={(e) => handleClose(e)}>
      <div className="book-details-content">
          <span className="book-details-close">&times;</span>
          <div className="book-details-text">

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>Title</h2>
                <i className="far fa-edit details-edit"></i>
              </div>
            
              <input readOnly type="text" className="book-details-input"  id="book-details-title" value={title}/>
              <i className="far fa-check-circle edit-confirm"></i>
            </div>

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>Author</h2>
                <i className="far fa-edit details-edit"></i>
              </div>
              <input readOnly type="text" className="book-details-input"  id="book-details-author" value={author}/>
              <i className="far fa-check-circle edit-confirm"></i>
            </div>

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>Publisher</h2>
                <i className="far fa-edit details-edit"></i>
              </div>
              <input readOnly type="text" className="book-details-input"  id="book-details-publisher" value={publisher}/>
              <i className="far fa-check-circle edit-confirm"></i>
            </div>

            <div className="book-details-text-inner">
              <div className="book-details-header-text">
                <h2>ISBN</h2>
                <i className="far fa-edit details-edit"></i>
              </div>
              <input readOnly type="text" className="book-details-input"  id="book-details-isbn" value={isbn}/>
              <i className="far fa-check-circle edit-confirm"></i>
            </div>

          </div>

          {isbn && 
            <div className="book-image"> 
              <Image
                src={`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`}
                alt="${title} Book Cover"
                fill={true}
              />
            </div>
          }
 
        </div>
      </div>
  )
}
