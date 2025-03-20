import { useEffect } from "react"
import { appDataDir } from '@tauri-apps/api/path';


const History = () => {
  useEffect(() => {
    document.title = "History - POS System"
    const f = async () => {
      console.log(await appDataDir())
    };
    f();
  }
    , [])
  return (
    <div>
      History
      <hr />

    </div>
  )
}

export default History
