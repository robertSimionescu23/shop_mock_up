import './App.css'
import NavBar from './Nav/NavBar.jsx'
import Hero from './Hero/Hero.jsx'
import TShirt from "./assets/images/BlackTee.jpg"

function App() {
  return (
    <>
      <NavBar/>
      {/* TODO: Move image getting to back server */}
      <Hero boxData = {[{"title" : "Example", "image" : TShirt},
        {"title" : "Example", "image" : ""}]}/>
    </>
  )
}

export default App
