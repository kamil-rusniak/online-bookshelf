import { BookAddButtonProps, BookSearchButtonProps, BookAddFormProps, AddingTabProps } from '@/types/interfaces';


function BookAddButton({value, className, id, children, handleAddClick, bookIsAdding}: BookAddButtonProps){
  return(
    <button 
      value={value} 
      className={className} 
      id={id}
      onClick={handleAddClick}
      disabled={bookIsAdding}
      >
      {children}
    </button>
  )
}

function BookSearchButton({value, className, id, children, handleSearchClick, bookIsAdding}: BookSearchButtonProps){
  return(
    <button 
      value={value} 
      className={className} 
      id={id}
      onClick={handleSearchClick}
      disabled={bookIsAdding}
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

 function BookAddForm({handleAddClick, handleSearchClick, bookIsAdding}:BookAddFormProps){
  return(
      <form className='book-add-form'> 
        <div className="input-wrapper">
          <label className="label" htmlFor="isbn">ISBN</label>
          <div className="input-inner">
            <input type="text" pattern="[0-9\-]+" name="isbn" id="isbn" className="isbn" inputMode="numeric" />
            <BookSearchButton className='' id='search-button' value='Search' handleSearchClick={handleSearchClick} bookIsAdding={bookIsAdding}>
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

        <BookAddButton value='Add' className='page-button' id='add-button' handleAddClick={handleAddClick} bookIsAdding={bookIsAdding}>
          Add
        </BookAddButton>
      </form>

  )
}

export default function AddingTab({handleAddClick, handleSearchClick, bookIsAdding}: AddingTabProps){
  return(
    <section className={`main-page adding-page active-page`}>
      <BookAddForm handleAddClick={handleAddClick} handleSearchClick={handleSearchClick} bookIsAdding={bookIsAdding}></BookAddForm>
    </section>
  )
}