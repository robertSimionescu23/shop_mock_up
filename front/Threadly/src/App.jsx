import './App.css'
import NavBar from './Nav/NavBar.jsx'
import Hero from './Hero/Hero.jsx'

function App() {
  return (
    <>
      <NavBar/>
      {/* TODO: Move image getting to back server */}
      <Hero/>
    </>
  )
}

export default App
