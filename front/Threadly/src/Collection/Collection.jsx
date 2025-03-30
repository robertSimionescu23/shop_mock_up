import styles from "./Collection.module.css"
import PropTypes from "prop-types";
import  { useEffect, useState } from "react";
import axios from "axios";


function AdminConsole({ title }) {
    const [collection, setCollection] = useState([]);
    const [imageSrc, setImageSrc] = useState([]);
    const [focused, setFocused] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/getCollection", {
                params: {
                    "name": title
                }
            })
            .then((response) => {
                setCollection(response.data.map(item => [item._id, item.images[0]])); //To display the item in the collection tab, only the first image's path is needed. The id will be stored if further processing is needed.
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [title]);

    useEffect(() => {
        if (collection.length > 0) {
            Promise.all( //Send requests for all the images at the paths saved in the collection array, requesting by ID and path.
                collection.map(item =>
                    axios.get("http://localhost:3000/api/imageByUrl", {
                        params: {
                            id: item[0], //The ID
                            path: item[1], //The path of the first image
                        },
                        responseType: 'blob', //blobs can be converted to image source
                    })
                )
            )
                .then(responses => {
                    const images = responses.map(response => URL.createObjectURL(response.data));
                    setImageSrc(images);
                })
                .catch(error => {
                    console.error("Error fetching images:", error);
                });
        }
    }, [collection]);

    return (
        <>
        <div className={styles.collection}>
            <div className={styles.collectionTitelContainer}>
                <span className={`defaultText ${styles.collectionTitle}`}>{title}</span>
                <svg className={styles.add}
                fill="#FFFFFF" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="800px" height="800px" viewBox="0 0 45.402 45.402"
                    xmlSpace="preserve">
                    <g>
                        <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141
            		c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27
            		c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435
            		c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
                    </g>
                </svg>
            </div>
            <div className={styles.collectionItems}>
                {imageSrc && imageSrc.map((image, index) => (
                    <img key={index} src={image} className={styles.item} alt={`image-${index}`} onClick={() => setFocused(index)}/>
                ))
                }
            </div>
        </div>
        {focused != null &&
        <>
            <div className = {styles.focusBackDrop} onClick={()=>setFocused(null)}/>
            <div className = {styles.focusedBox}>
            <div className={styles.images}>
                {/* TODO: implement fetching images based on id */}
                <div className={styles.item} style={{"width" : "200px", "height" : "200px"}}></div>
                <div className={styles.item} style={{"width" : "200px", "height" : "200px"}}></div>
                <div className={styles.item} style={{"width" : "200px", "height" : "200px"}}></div>
                <div className={styles.item} style={{"width" : "200px", "height" : "200px"}}></div>
                <div className={styles.item} style={{"width" : "200px", "height" : "200px"}}></div>
                <div className={styles.item} style={{"width" : "200px", "height" : "200px"}}></div>
            </div>

            </div>
        </>
        }
        </>
    )
}

// PropTypes validation
AdminConsole.propTypes = {
    title: PropTypes.string.isRequired // Required string
};


export default AdminConsole
