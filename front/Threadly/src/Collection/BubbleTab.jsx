import styles from "./Collection.module.css"
import axios from "axios";
import PropTypes from 'prop-types';

function BubbleTab({title, collection, info, setInfoHook, field}){

    const removebubble = (index) =>{

            let updatedArray = info[field].filter((_, i) => i !== index); // Removekeyword at given index
            let updatedArrayJSON = { ...info, [field]: updatedArray };

            axios.put("http://localhost:3000/api/changeItemByID", {
                id: info._id,
                key: field,
                value: updatedArray.join(" "),
                collection: collection
            }).then( (response) =>
                console.log(response)
            ).catch((error) => console.error(error))
            setInfoHook(updatedArrayJSON); // Set the updated keywords array back into state
    }

    return (
        info[field]?
        < >
            <div className ={styles.infoGridItem}>{title}</div>
            <div className={`${styles.infoGridItem} ${styles.bubbleTab}`}>{
                // eslint-disable-next-line react/prop-types
                info[field].map((value, index) => (
                    <div className ={styles.bubble} key={index}>
                        <span>{value}</span>
                        <div className = {styles.xButton} onClick={() => removebubble(index)}>x</div>
                    </div>))}
                    <div className ={`${styles.bubble} ${styles.addSpecButton}`} >+</div>
            </div>
        </>
        :
        <></>
    )
}

BubbleTab.propTypes = {
    title: PropTypes.string.isRequired,
    collection: PropTypes.string.isRequired,
    info: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.object,   // or PropTypes.object if it's a MongoDB ObjectId
        length: PropTypes.number,
        filter: PropTypes.func,
      })
    ).isRequired,
    setInfoHook: PropTypes.func.isRequired,
    field: PropTypes.string.isRequired,
  };

export default BubbleTab
