import NavBar from '../Nav/NavBar.jsx'
import styles from "./AdminConsole.module.css"
import Collection from "../Collection/Collection.jsx"
import { useState } from "react";

function AdminConsole() {
    const [ collectionClicked, setCollectionClicked] = useState(true);
    const [statsClicked, setStatsClicked]            = useState(false);
    return (
        <>
            <NavBar />
            <section className = {styles.pageContainer}>
                <div className={`${styles.leftColumn} ${styles.gridItem}`}>
                    <div className={`defaultText ${collectionClicked? `${styles.pressedTab} ${styles.tab}` : styles.tab}`} onClick = {()=>{setCollectionClicked(true); setStatsClicked(false);}}>Collections</div>
                    <div className={`defaultText ${statsClicked?  `${styles.pressedTab} ${styles.tab}` : styles.tab}`} onClick = {()=>{setCollectionClicked(false); setStatsClicked(true);}}>Stats</div>
                </div>
                {collectionClicked && <div className={`${styles.rightColumn} ${styles.gridItem}`}>
                    {/* TODO: Make this configurable later */}
                    <Collection title = "What's new"/>
                </div>}
            </section>
        </>
    )
}

export default AdminConsole
