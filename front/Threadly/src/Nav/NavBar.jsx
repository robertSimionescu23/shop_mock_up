import styles from "./NavBar.module.css"
import { useState } from "react";


function NavBar(){
  const [userClicked, setUserClicked] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);

  return <><div className = {styles.navBar}>
      <h1 className = {styles.logo}>
          Threadly
      </h1>
      <div className = {styles.iconContainer}>
          {/* Lens SVG */}
          <svg
             fill="currentColor"
             viewBox="0 0 32 32"
             version="1.1"
             id="svg1"
             xmlns="http://www.w3.org/2000/svg"
             className={searchClicked? `${styles.iconObject} ${styles.searchClickedClass}`: styles.iconObject}
             onClick = {() => {setSearchClicked(true); setUserClicked(false);}}
             >

            <defs
               id="defs1" />
            <title
               id="title1">lens</title>
            <path
               d="M0 13.024q0-2.624 1.024-5.056t2.784-4.16 4.16-2.752 5.056-1.056q2.656 0 5.056 1.056t4.16 2.752 2.784 4.16 1.024 5.056q0 3.616-1.984 6.816l7.072 7.040q0.864 0.896 0.864 2.144t-0.864 2.112-2.144 0.864-2.112-0.864l-7.040-7.040q-3.2 1.952-6.816 1.952-2.656 0-5.056-1.024t-4.16-2.784-2.784-4.128-1.024-5.088zM4 13.024q0 2.464 1.216 4.544t3.296 3.264 4.512 1.216q1.824 0 3.488-0.704t2.88-1.92 1.92-2.88 0.736-3.52-0.736-3.52-1.92-2.848-2.88-1.92-3.488-0.736q-2.432 0-4.512 1.216t-3.296 3.296-1.216 4.512z"
               id="path1" />
            <metadata
               id="metadata1">
              <rdf:RDF>
                <cc:Work
                   rdf:about="">
                  <dc:title>lens</dc:title>
                </cc:Work>
              </rdf:RDF>
            </metadata>
          </svg>
          {/* User SVG */}
          {userClicked && <div className={styles.userMenuBorder}></div>}
          <svg viewBox="0 0 16 16" fill="currentColor" className={userClicked? `${styles.iconObject} ${styles.userClickedClass}` : styles.iconObject } onClick={() => {setUserClicked(!userClicked); setSearchClicked(false)}} xmlns="http://www.w3.org/2000/svg">
              <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="currentColor"/>
              <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="currentColor"/>
          </svg>
      </div>
      {userClicked &&
        <div className ={styles.userMenu}>
        <span className={styles.userText}>Not connected</span>
        <div className={styles.logInTabs}>
            <span className={styles.logInText}>Log in<br/></span>
            <span className={styles.logInText}>Register</span>
        </div>
        </div>}

    {searchClicked &&
        <input placeholder="Search" type = "text" className ={styles.searchBar}/>
    }
  </div>
  </>
}

export default NavBar
