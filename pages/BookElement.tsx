import { useState } from "react"
import BookDetailsWindow from "./BookDetailsWindow"

function BookButtons({onSwitch, onDelete, onInfo}:{onSwitch:any, onDelete:any, onInfo:any}){
  
  return(
    <div className="book-buttons">
      <BookInfoButton onInfo={() => onInfo()}></BookInfoButton>
      <BookDeleteButton onDelete={() => onDelete()}></BookDeleteButton>
      <BookSwitchButton onSwitch={() => onSwitch('up')} switchType='up' />
      <BookSwitchButton onSwitch={() => onSwitch('down')} switchType='down' />
  </div>
  )
}

function BookSwitchButton({onSwitch, switchType}:{onSwitch:any, switchType:string}){
  return(
    <i className={`fas fa-angle-double-${switchType} switch-${switchType}-button`} onClick={onSwitch}></i>
  )
}

function BookDeleteButton({onDelete}:{onDelete:any}){
  return(
    <i className="far fa-times-circle book-delete-button" onClick={onDelete}></i>
  )
}

function BookInfoButton({onInfo}:{onInfo:any}){
  return(
    <i className="fas fa-info-circle book-info-button" onClick={onInfo}></i>
  )
}



export default function BookElement({title, author, publisher, isbn, status, onSwitch, onDelete}:{title: string, author: string, publisher: string, isbn:number, status: string, onSwitch:any, onDelete:any}){
  const [showDetails, setShowDetails] = useState(false);

  function handleInfo(){
    console.log(title);
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
           <p className="book-isbn hidden">{isbn}</p>
         </div>
       </div>
       <BookButtons onSwitch={onSwitch} onDelete={onDelete} onInfo={() => handleInfo()}/>
      {showDetails && 
        <BookDetailsWindow 
          title={title} 
          author={author} 
          isbn={isbn} 
          publisher={publisher}
          showDetails={showDetails}
          setShowDetails={setShowDetails}
        />
      }
   
       

     </div>
  )
}
