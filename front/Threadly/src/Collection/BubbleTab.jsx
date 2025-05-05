import styles from "./Collection.module.css"
import axios from "axios";
import PropTypes from 'prop-types';
import  { useState } from "react";

function BubbleTab({title, collection, info, setInfoHook, field}){

    const [adding, setAdding] = useState(false);
    const [tempValue, setTempValue] = useState();
    const removebubble = (index) =>{

            let updatedArray = info[field].filter((_, i) => i !== index); // Removekeyword at given index
            let updatedArrayJSON = { ...info, [field]: updatedArray };

            axios.put("http://localhost:3000/api/changeItemByID", {
                id: info._id,
                key: field,
                value: updatedArray.join(" "),
                collection: collection
            }).catch((error) => console.error(error))
            setInfoHook(updatedArrayJSON); // Set the updated keywords array back into state
    }

    const handleSave = () => {
        setAdding(false);
        setInfoHook({...info, [field]:[...info[field], tempValue]});  // call parent callback to update value in state/db
        console.log([...info[field], tempValue].join(" "))
        axios.put("http://localhost:3000/api/changeItemByID", {
            id: info._id,
            key: field,
            value: [...info[field], tempValue].join(" "),
            collection: collection
        }).then((response) => console.log(response))
        .catch((error) => console.error(error))
      };

    return (
        info[field]?
        < >
            <div className ={`${styles.infoGridItem} ${styles.nameTab}`}>{title}</div>
            <div className={`${styles.infoGridItem} ${styles.bubbleTab}`}>{
                // eslint-disable-next-line react/prop-types
                info[field].map((value, index) => (
                    <div className ={styles.bubble} key={index}>
                        <span>{value}</span>
                        <div className = {styles.xButton} onClick={() => removebubble(index)}>x</div>
                    </div>))}
                {adding &&  <div className ={`${styles.bubble} ${styles.bubbleInput}`}>
                        <input className={`${styles.txtInput} ${styles.textWrapper}`}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur = {() => setAdding(false)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                        }}
                        autoFocus
                        />
                        <div className = {styles.xButton} onClick={() => setAdding(false)}>x</div>
                </div>}
            </div>
            <div className ={`${styles.infoGridItem}`} ><div className = {styles.addSpecButton} onClick = {() => setAdding(!adding)}>+</div></div>
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
