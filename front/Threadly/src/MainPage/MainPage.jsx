import NavBar from '../Nav/NavBar.jsx'
import Section from '../Section/Section.jsx'

function MainPage() {
  return (<>
    <NavBar/>
    <div className = "heroText">
        <h1 className = "slogan"> Shop from friends</h1>
        {/* TODO: Move image getting to back server */}
        <Section sectionText = "What&apos;s new"/>
    </div>
    </>
  )
}

export default MainPage
