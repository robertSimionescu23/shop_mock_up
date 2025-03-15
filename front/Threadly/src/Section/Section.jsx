import styles from "./Section.module.css"
import PropTypes from 'prop-types'
import blackTee from "../assets/images/BlackTee.jpg"

function Section(){
    let testURL = blackTee;
    let urls = [testURL, testURL, testURL, testURL, testURL, testURL, testURL, testURL]
    const itemList = urls.map((url, idx) => <div key = {idx} className={styles.item} style = {{backgroundImage: `url(${url})`}}></div>)
    return <div className = {styles.grid}>
        {itemList}
    </div>
}

Section.propTypes = {
    sectionText: PropTypes.string
}
export default Section
