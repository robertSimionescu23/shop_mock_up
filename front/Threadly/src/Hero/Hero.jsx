import styles from "./Hero.module.css"
import skaters from "../assets/images/parker-gibbons-Wx6oQRl7Wa0-unsplash.jpg"

function Hero(){

    return <>
    <img src = {skaters} className={styles.heroImage}></img>
    <div className = {styles.heroText}>
        <h1 className = {styles.slogan}> Shop from friends</h1>
    </div>

    </>
}

export default Hero
