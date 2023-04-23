import { MouseEventHandler, ReactElement, useState } from "react";

function BooksStatusSection({sectionActiveStatus, children, section, onSectionClick, bookList}:{sectionActiveStatus: string, children: string, section: string, onSectionClick: MouseEventHandler, bookList: ReactElement[]}){

  bookList = bookList.filter((book: ReactElement) => {
    if(book){
      return book.props.status === section;
    }
  });

return(
  <article className={`books-status-section ${section} ${sectionActiveStatus}`} >
    <div className="segment-title" id={section} onClick={onSectionClick}>
      <h2 className="segment-button">{children}</h2>
      <div className="book-count">{bookList.length}</div>
    </div>
    <div className={`${section}-list`}>
      {bookList}
    </div>
  </article>
)
}

export default function BooksTab({className, bookList}: {className: string, bookList: ReactElement[]}){
const [activeSection, setActiveSection] = useState('');


function handleSectionClick(e:React.MouseEvent<Element, MouseEvent>){
  const target = e.target as Element;
  const clickedSection = target.id;
  if (clickedSection === activeSection){
    setActiveSection('');
  } else {
    setActiveSection(clickedSection)
  }

}

return(
  <section className={`main-page book-page ${className}`}>
    <BooksStatusSection section={'to-read'} sectionActiveStatus={`${activeSection == 'to-read' && 'active' }`} onSectionClick={(e:React.MouseEvent<Element, MouseEvent>) => handleSectionClick(e)} bookList={bookList}>To Read</BooksStatusSection>
    <BooksStatusSection section={'reading'} sectionActiveStatus={`${activeSection == 'reading' && 'active'}`} onSectionClick={(e:React.MouseEvent<Element, MouseEvent>) => handleSectionClick(e)} bookList={bookList}>Reading</BooksStatusSection>
    <BooksStatusSection section={'finished'} sectionActiveStatus={`${activeSection == 'finished' && 'active'}`} onSectionClick={(e:React.MouseEvent<Element, MouseEvent>) => handleSectionClick(e)} bookList={bookList}>Finished</BooksStatusSection>
  </section>
)
}