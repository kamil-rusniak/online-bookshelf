import { MouseEventHandler, ReactNode } from 'react';

function BookAddButton({value, className, id, children, handleAddClick}: {value: string, className: string, id: string, children:string, handleAddClick:MouseEventHandler}){
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

function BookSearchButton({value, className, id, children, handleSearchClick}: {value: string, className: string, id: string, children:ReactNode, handleSearchClick: MouseEventHandler}){
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

function SectionRadioInput({value, name, checked}:{value:string, name:string, checked:boolean}){
  return(
    <div className="radio-input">
      <input type="radio" id={value} name="section" value={value} defaultChecked={checked} />
      <label htmlFor={value}>{name}</label>
    </div>
  )
}

 function BookAddForm({handleAddClick, handleSearchClick}:{handleAddClick: MouseEventHandler, handleSearchClick: MouseEventHandler}){
  return(
      <form className='book-add-form'> 
        <div className="input-wrapper">
          <label className="label" htmlFor="isbn">ISBN</label>
          <div className="input-inner">
            <input type="number" name="isbn" id="isbn" className="isbn" />
            <BookSearchButton className='' id='search-button' value='Search' handleSearchClick={handleSearchClick}>
              <i className="fas fa-search search-icon" id="search-icon"></i>
            </BookSearchButton>

          </div>
          <p className="small-info">
            Enter info manually and click &quot;Add&quot; or enter just the ISBN and click the search button
          </p>
        </div>

        <div className="input-wrapper">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" />
        </div>

        <div className="input-wrapper">
          <label htmlFor="author">Author</label>
          <input type="text" name="author" id="author" />
        </div>

        <div className="input-wrapper half">
          <label htmlFor="publisher">Publisher</label>
          <input type="text" name="publisher" id="publisher" />
        </div>
        
        <div className="input-wrapper half">
          <label htmlFor="genre">Genre</label>
          <input type="text" name="genre" id="genre" />
        </div>

        <div className="input-wrapper sections">
        <label htmlFor="Section">Section</label>
          <div className="wrapper">
            <SectionRadioInput value='to-read' name='To Read' checked />
            <SectionRadioInput value='reading' name='Reading' checked={false} />
            <SectionRadioInput value='finished' name='Finished' checked={false} />
          </div>
        </div>

        <BookAddButton value='Add' className='page-button' id='add-button' handleAddClick={handleAddClick}>
          Add
        </BookAddButton>
      </form>

  )
}

export default function AddingTab({handleAddClick, handleSearchClick}: {handleAddClick:MouseEventHandler, handleSearchClick:MouseEventHandler}){
  return(
    <section className={`main-page adding-page active-page`}>
      <BookAddForm handleAddClick={handleAddClick} handleSearchClick={handleSearchClick}></BookAddForm>
    </section>
  )
}