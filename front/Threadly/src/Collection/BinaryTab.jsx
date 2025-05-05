import styles from "./Collection.module.css"
import PropTypes from "prop-types";
import {useState, useEffect} from 'react';
import axios from "axios";


function BinaryTab({name, collection, info, field}){

    const [isTrue, setIsTrue] = useState(true);

    useEffect(() => {
        setIsTrue(info[field] == "yes"? true : false); //Make sure value is loaded
    }, [field, info]);

    useEffect(() => {
        if(isTrue != (info[field] == "yes"? true: false))
        axios.put("http://localhost:3000/api/changeItemByID", {
                    id: info._id,
                    key: field,
                    value: isTrue? "yes" : "no",
                    collection: collection
                }).catch((error) => {console.error(error)})
    }, [isTrue]);


    return(
    <>
        <div className={`${styles.infoGridItem} ${styles.nameTab}`}>{name}</div>
        <div className={`${styles.infoGridItem} ${styles.binaryValue}`} onClick = {() => setIsTrue(!isTrue)}>{isTrue? "yes" : "no"}</div> {/* TODO: Add a checkmark instead */}
        <></>
    </>
    )
}

// PropTypes validation
BinaryTab.propTypes = {
    collection: PropTypes.string.isRequired,
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




export default BinaryTab
