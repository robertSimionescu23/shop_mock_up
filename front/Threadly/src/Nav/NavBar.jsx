import styles from "./NavBar.module.css"
import lens from "../assets/icons/lens.svg"
import user from "../assets/icons/user.svg"

function NavBar(){
    return <div className = {styles.navBar}>
        <h1 className = {styles.logo}>
            Threadly
        </h1>
        <div className = {styles.iconContainer}>
            <img className = {styles.icon} src={lens} />
            <img className = {styles.icon} src={user}/>
        </div>
    </div>
}

export default NavBar
