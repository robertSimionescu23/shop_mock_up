import styles from "./Collection.module.css"
import PropTypes from "prop-types";
import {useState, useEffect} from 'react';
import axios from "axios";


function InfoTab({name, collection, onChange, info, field}){


    useEffect(() => {
        setTempValue(info[field]); //Make sure value is loaded
    }, [field, info]);

    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState("");
    const [isInvalid, setIsInvalid] = useState(false);

    const handleSave = () => {
        console.log("Handle Save false")
        setIsEditing(false);
        setIsInvalid(false);
        onChange({...info, [field]:tempValue});  // call parent callback to update value in state/db
        axios.put("http://localhost:3000/api/changeItemByID", {
            id: info._id,
            key: field,
            value: tempValue,
            collection: collection
        }).catch(() => setIsInvalid(true))
      };

    return(
    <>
        <div className={`${styles.infoGridItem} ${styles.nameTab}`}>{name}</div>
        <div className={`${styles.infoGridItem} ${styles.textWrapper}`}>
            {isEditing?

                field != "description"?
                <input className={`${styles.txtInput} ${styles.textWrapper}`}
                    value={tempValue}
                    onBlur = {() =>{setIsEditing(false); handleSave()}}
                    onChange={(e) => setTempValue(e.target.value)}
                    onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    }}
                    autoFocus
                />
                :
                <textarea className={`${styles.txtInput} ${styles.textWrapper}`}
                value={tempValue}
                onBlur = {() => {setIsEditing(false); handleSave()}}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                }}
                autoFocus
                />
        :
        <div className={styles.textWrapper} style={{backgroundColor  : isInvalid? "#8f0000" : "transparent"}}>{tempValue}</div>
            }
        </div>
        <div className ={styles.infoGridItem}>
            <svg className = {styles.editButton} onClick = {() => setIsEditing(true)}
       viewBox="0 0 306.637 306.637" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.809 238.52L0 306.637l68.118-12.809 184.277-184.277-55.309-55.309L12.809 238.52zm47.981 41.423l-41.992 7.896 7.896-41.992L197.086 75.455l34.096 34.096L60.79 279.943z"/>
      <path d="M251.329 0l-41.507 41.507 55.308 55.308 41.507-41.507L251.329 0zm-20.294 41.507l20.294-20.294 34.095 34.095-20.294 20.294-34.095-34.095z"/>
                            </svg></div>

    </>
    )
}


// PropTypes validation
InfoTab.propTypes = {
    collection: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    field: PropTypes.string.isRequired,
    info: PropTypes.shape({
        _id: PropTypes.object.isRequired,
    }).isRequired,
    name : PropTypes.string.isRequired, // Required string
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired
};

export default InfoTab
