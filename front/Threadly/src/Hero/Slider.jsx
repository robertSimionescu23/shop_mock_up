import styles from "./Slider.module.css"
import PropTypes from 'prop-types';

function Slider({title: text}){

    return <div className = {styles.SliderDiv}>
        <h2 className = {styles.title}>{text}</h2>
        <div className={styles.photoSlider}></div>
    </div>
}
Slider.propTypes = {
    title: PropTypes.string
};

export default Slider
