import { MouseEventHandler, useState } from "react"
import BookDetailsWindow from "./BookDetailsWindow"
import Spinner from "./Spinner"
import { BookButtonsProps, BookElementProps } from "@/types/interfaces"

function BookButtons({onSwitch, onDelete, onInfo, setLoadingState}:BookButtonsProps){
  return(
    <div className="book-buttons">
      <BookInfoButton onInfo={(e) => onInfo(e)}></BookInfoButton>
      <BookDeleteButton onDelete={(e) => onDelete(e)}></BookDeleteButton>
      <BookSwitchButton onSwitch={() => onSwitch('up', setLoadingState)} switchType='up' />
      <BookSwitchButton onSwitch={() => onSwitch('down', setLoadingState)} switchType='down' />
  </div>
  )
}

function BookSwitchButton({onSwitch, switchType}:{onSwitch:MouseEventHandler, switchType:string}){
  return(
    <i className={`fas fa-angle-double-${switchType} switch-${switchType}-button`} onClick={onSwitch}></i>
  )
}

function BookDeleteButton({onDelete}:{onDelete:MouseEventHandler}){
  return(
    <i className="far fa-times-circle book-delete-button" onClick={onDelete}></i>
  )
}

function BookInfoButton({onInfo}:{onInfo:MouseEventHandler}){
  return(
    <i className="fas fa-info-circle book-info-button" onClick={onInfo}></i>
  )
}


export default function BookElement({id, title, author, publisher, genre, isbn, onSwitch, onDelete, handleEdit}:BookElementProps){
  const [showDetails, setShowDetails] = useState(false);
  const [bookStatusUpdating, setBookStatusUpdating] = useState(false);
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [styleSaveBtn, setStyleSaveBtn] = useState(false);

  function handleInfo(){
    setShowDetails(true);
  }

  return(
      <div className="book-element">
       <div className="book-inner">
         <i className="far fa-dot-circle"></i>
         <div className="book-info">
           <p className="book-title">{title}</p>
           <p className="book-author">{author}</p>
           <p className="book-publisher hidden">{publisher}</p>
           <p className="book-genre hidden">{genre}</p>
           <p className="book-isbn hidden">{isbn}</p>
         </div>
       </div>
       {bookStatusUpdating && <Spinner/>}
       <BookButtons onSwitch={onSwitch} setLoadingState={setBookStatusUpdating} onDelete={onDelete} onInfo={() => handleInfo()} />
      {showDetails && 
        <BookDetailsWindow 
          id={id}
          title={title} 
          author={author} 
          isbn={isbn} 
          publisher={publisher}
          genre={genre}
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          handleEdit={handleEdit}
          showSaveBtn={showSaveBtn}
          setShowSaveBtn={setShowSaveBtn}
          styleSaveBtn={styleSaveBtn}
          setStyleSaveBtn={setStyleSaveBtn}
        />
      }
     </div>
  )
}
