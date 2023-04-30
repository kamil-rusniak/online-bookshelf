import { Dispatch, SetStateAction } from "react";

export default function ErrorMessage({message, setErrorMsg}:{message:string, setErrorMsg:Dispatch<SetStateAction<string>>}) {

  function setMessage(){
    setErrorMsg('');
  }

  return (
    <div id="error-message">
      <p>{message}</p>
      <div className="close" onClick={() => setMessage()}>X</div>
    </div>
  )
}