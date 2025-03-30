import './App.css'
import MainPage from './MainPage/MainPage.jsx'
import {Routes, Route, HashRouter} from 'react-router-dom'
import AdminConsole from './AdminConsole/AdminConsole.jsx'

function App() {
  return (
    <HashRouter>
        <Routes>
            <Route path = "/" element = {<MainPage/>}/>
            <Route path ="/admin" element = {<AdminConsole/>}></Route>
        </Routes>
    </HashRouter>

  )
}

export default App
