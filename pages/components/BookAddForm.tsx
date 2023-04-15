import { ReactNode } from 'react';

function BookAddButton({value, className, id, children, handleAddClick}: {value: string, className: string, id: string, children:string, handleAddClick: any}){
  
  return(
    <button 
      value={value} 
      className={className} 
      id={id}
      onClick={handleAddClick}
      >
      {children}
    </button>
  )
}

function BookSearchButton({value, className, id, children, handleSearchClick}: {value: string, className: string, id: string, children:ReactNode, handleSearchClick:any}){
  
  return(
    <button 
      value={value} 
      className={className} 
      id={id}
      onClick={handleSearchClick}
      >
      {children}
    </button>
  )
}

export default function BookAddForm({handleAddClick, handleSearchClick}:{handleAddClick:any, handleSearchClick:any}){

  return(
      <form>
        <div className="input-wrapper">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" />
        </div>

        <div className="input-wrapper">
          <label htmlFor="author">Author</label>
          <input type="text" name="author" id="author" />
        </div>

        <div className="input-wrapper">
          <label htmlFor="publisher">Publisher</label>
          <input type="text" name="publisher" id="publisher" />
        </div>

        <div className="input-wrapper">
          <label className="label" htmlFor="isbn">ISBN</label>
          <div className="input-inner">
            <input type="text" name="isbn" id="isbn" className="isbn" />
            <BookSearchButton className='' id='search-button' value='Search' handleSearchClick={handleSearchClick}>
              <i className="fas fa-search search-icon" id="search-icon"></i>
            </BookSearchButton>

          </div>
          <p className="small-info">
            You can enter info manually and click 'Add' or just type ISBN and
            click search button
          </p>
        </div>

        <BookAddButton value='Add' className='page-button' id='add-button' handleAddClick={handleAddClick}>
          Add
        </BookAddButton>
      </form>

  )
}
