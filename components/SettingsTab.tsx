import Link from "next/link"


export default function SettingsTab({id}:{id:string}){

  async function updateSettings(e:React.MouseEvent<HTMLButtonElement, MouseEvent>){
    e.preventDefault();

    const target = e.target as Element;
    const editForm = (target as HTMLFormElement).form;
    const userId = id;

    const formData = new FormData(editForm);
    const formJson = Object.fromEntries(formData.entries());
    const sectionSetting = formJson['setting-book-save'] as string;
      
    try {
      const body = { sectionSetting };
      await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
    } catch (error) {
      console.error(error);
    }
  }

  return(
    <>
        <Link href="/" className='settings-button'><i className="fa-solid fa-house"></i></Link>
        <h2>Settings</h2>
        <form className='settings-form'> 

        <div className="input-wrapper book-save">
            <label htmlFor='setting-book-save'>When adding new books, save them to:</label>
            <div className="radio-input">
              <input type="radio" id='to-read' name="setting-book-save" value='to-read' defaultChecked />
              <label htmlFor='to-read'>To Read</label>
            </div>
            <div className="radio-input">
              <input type="radio" id='reading' name="setting-book-save" value='reading' defaultChecked={false} />
              <label htmlFor='reading'>Reading</label>
            </div>
            <div className="radio-input">
              <input type="radio" id='finished' name="setting-book-save" value='finished' defaultChecked={false} />
              <label htmlFor='finished'>Finished</label>
            </div>
        </div>


        <button value='Add' className='page-button' id='settings-save-button' onClick={(e) => updateSettings(e)}>
          Save
        </button>
      </form>
    </>
  )
}