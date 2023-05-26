import Link from "next/link"

function SettingBookSaveInput({value, name}:{value: string, name: string}){
  let checked = false;
  if (localStorage.getItem("settingBookSave") === value ){
    checked = true;
  }
  return(
    <div className="radio-input">
      <input type="radio" id={value} name="setting-book-save" value={value} defaultChecked={checked} />
      <label htmlFor={value}>{name}</label>
    </div>
  )
}

export default function SettingsTab({userId}:{userId:string}){

  async function updateSettings(e:React.MouseEvent<HTMLButtonElement, MouseEvent>){
    e.preventDefault();

    const target = e.target as Element;
    const editForm = (target as HTMLFormElement).form;

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
      localStorage.setItem("settingBookSave", sectionSetting);
    } catch (error) {
      console.error(error);
    }
  }

  return(
    <div className="settings-tab">
        <Link href="/" className='settings-button'><i className="fa-solid fa-house"></i></Link>
        <h2>Settings</h2>
        <form className='settings-form'> 

        <div className="input-wrapper book-save">
            <label htmlFor='setting-book-save' className="title-label">When adding new books, save them to:</label>
            <SettingBookSaveInput value='to-read' name='To Read'/>
            <SettingBookSaveInput value='reading' name='Reading'/>
            <SettingBookSaveInput value='finished' name='Finished'/>
        </div>

        <button value='Add' className='page-button' id='settings-save-button' onClick={(e) => updateSettings(e)}>
          Save settings
        </button>
      </form>
    </div>
  )
}