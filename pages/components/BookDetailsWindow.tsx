import Image from 'next/image';


export default function BookDetailsWindow({title, author, publisher, isbn, showDetails, setShowDetails}:{title:string, author:string, publisher: string, isbn: number, showDetails:any, setShowDetails:any}){

  function handleClose(e:any){
      if (e.target.classList.contains('book-details-close') || e.target.classList.contains('book-details', 'active')){
        setShowDetails(false);
      }
  }

  return(
    <div className={'book-details' + `${showDetails && ' active'}`} onClick={(e) => handleClose(e)}>
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
          {/* show only if isbn isn't empty */}
          <div className="book-image"> 
            <Image
              src={`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`}
              alt="${title} Book Cover"
              fill={true}
            />
          </div>
        </div>
      </div>
  )
}
