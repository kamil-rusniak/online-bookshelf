import Link from "next/link"


export default function SettingsTab(){
  return(

    <>
        <Link href="/" className='settings-button'><i className="fa-solid fa-house"></i></Link>
        <form>settings tab</form>
    </>
  )
}