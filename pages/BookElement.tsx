function BookButtons({onSwitch, onDelete}:{onSwitch:any, onDelete:any}){
  
  return(
    <div className="book-buttons">
      <i className="fas fa-info-circle book-info-button"></i>
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


export default function BookElement({title, author, publisher, isbn, status, onSwitch, onDelete}:{title: string, author: string, publisher: string, isbn:number, status: string, onSwitch:any, onDelete:any}){

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
       <BookButtons onSwitch={onSwitch} onDelete={onDelete}></BookButtons>
     </div>
  )
}
