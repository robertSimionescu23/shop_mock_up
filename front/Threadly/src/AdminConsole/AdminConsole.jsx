import NavBar from '../Nav/NavBar.jsx'
import styles from "./AdminConsole.module.css"
import Collection from "../Collection/Collection.jsx"

function AdminConsole() {
    return (
        <>
            <NavBar />
            <section className = {styles.pageContainer}>
                <div className={`${styles.leftColumn} ${styles.gridItem}`}>
                    <div className={`defaultText ${styles.tab}`}>Collections</div>
                    <div className={`defaultText ${styles.tab}`}>Stats</div>
                </div>
                <div className={`${styles.rightColumn} ${styles.gridItem}`}>
                    {/* TODO: Make this configurable later */}
                    <Collection title = "What's new"/>
                </div>
            </section>
        </>
    )
}

export default AdminConsole
