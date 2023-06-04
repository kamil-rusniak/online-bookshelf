import { MouseEventHandler, ReactNode } from 'react';

interface BookAddButtonProps {
  value: string;
  className: string;
  id: string;
  children:string;
  handleAddClick:MouseEventHandler;
  isLoading:boolean;
}

interface BookSearchButton {
  value: string;
  className: string;
  id: string;
  children:ReactNode;
  handleSearchClick: MouseEventHandler;
  isLoading:boolean;
}

interface BookAddForm {
  handleAddClick: MouseEventHandler;
  handleSearchClick: MouseEventHandler;
  isLoading: boolean;
}

interface AddingTab {
  handleAddClick:MouseEventHandler;
  handleSearchClick:MouseEventHandler;
  isLoading:boolean;
}


function BookAddButton({value, className, id, children, handleAddClick, isLoading}: BookAddButtonProps){
  return(
    <button 
      value={value} 
      className={className} 
      id={id}
      onClick={handleAddClick}
      disabled={isLoading}
      >
      {children}
    </button>
  )
}

function BookSearchButton({value, className, id, children, handleSearchClick, isLoading}: BookSearchButton){
  return(
    <button 
      value={value} 
      className={className} 
      id={id}
      onClick={handleSearchClick}
      disabled={isLoading}
      >
      {children}
    </button>
  )
}

function SectionRadioInput({value, name}:{value:string, name:string}){
  return(
    <div className="radio-input">
      <input type="radio" id={value} name="section" value={value} defaultChecked={localStorage.getItem("settingBookSave") === value} />
      <label htmlFor={value}>{name}</label>
    </div>
  )
}

 function BookAddForm({handleAddClick, handleSearchClick, isLoading}:BookAddForm){
  return(
      <form className='book-add-form'> 
        <div className="input-wrapper">
          <label className="label" htmlFor="isbn">ISBN</label>
          <div className="input-inner">
            <input type="number" name="isbn" id="isbn" className="isbn" />
            <BookSearchButton className='' id='search-button' value='Search' handleSearchClick={handleSearchClick} isLoading={isLoading}>
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
            <SectionRadioInput value='to-read' name='To Read' />
            <SectionRadioInput value='reading' name='Reading' />
            <SectionRadioInput value='finished' name='Finished' />
          </div>
        </div>

        <BookAddButton value='Add' className='page-button' id='add-button' handleAddClick={handleAddClick} isLoading={isLoading}>
          Add
        </BookAddButton>
      </form>

  )
}

export default function AddingTab({handleAddClick, handleSearchClick, isLoading}: AddingTab){
  return(
    <section className={`main-page adding-page active-page`}>
      <BookAddForm handleAddClick={handleAddClick} handleSearchClick={handleSearchClick} isLoading={isLoading}></BookAddForm>
    </section>
  )
}