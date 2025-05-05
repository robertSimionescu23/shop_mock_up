import styles from "./Collection.module.css"
import PropTypes from "prop-types";
import  { useEffect, useState } from "react";
import axios from "axios";
import InfoTab from "./InfoTab";
import BubbleTab from "./BubbleTab";
import BinaryTab from "./BinaryTab";


function Collection({ title }) {
    const [collection, setCollection] = useState([]);
    const [imageSrc, setImageSrc] = useState([]);
    const [focused, setFocused] = useState(null);
    const [focusedInfo, setFocusedInfo] = useState({});
    const [focusedItemImages, setFocusedItemImages] = useState([]);

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
        if (focused != null) {
            axios.get("http://localhost:3000/api/itemById", {
                params: {
                    id: collection[focused][0], // The ID
                    collection: `${title}`
                },
            })
            .then((response) => {
                const info = response.data;
                setFocusedInfo(info);
                console.log(info["images"])

                return Promise.all(
                    info["images"].map(img =>
                        axios.get("http://localhost:3000/api/imageByUrl", {
                            params: {
                                id: collection[focused][0], // The ID
                                path: img, // The URL
                            },
                            responseType: 'blob',
                        })
                    )
                );
            })
            .then(responses => {
                const images = responses.map(response => URL.createObjectURL(response.data));
                setFocusedItemImages(images);
            })
            .catch(error => {
                console.error("Error fetching images:", error);
            });
        }
    }, [focused]);


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

    function removeImage(index){
        setFocusedItemImages(prev => prev.filter((_, i) => i !== index));
    }

    return (
        <>
        <div className={styles.collection}>
            <div className={styles.collectionTitelContainer}>
                <span className={`defaultText ${styles.collectionTitle}`}>{title}</span>
            </div>
            <div className={styles.collectionItems}>
                {imageSrc && imageSrc.map((image, index) => (
                    <>
                    <img key={index} src={image} className={styles.item} onClick={() => setFocused(index)}/>
                    <svg className = {`${styles.itemXButton}`}
                                                                                                                viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#0F1729"/>
                                                                                                            </svg>
                    </>
                ))
                }
                <svg className={styles.add}
                fill="#AFAFAF" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 45.402 45.402"
                    xmlSpace="preserve">
                    <g>
                        <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141
            		c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27
            		c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435
            		c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
                    </g>
                </svg>
            </div>
        </div>
        {focused != null &&
        <>
            <div className = {styles.focusBackDrop} onClick={()=>setFocused(null)}/>
                <div className = {styles.focusedBox}>
                    <div className={styles.images}>
                        {/* TODO: implement fetching images based on id */}
                        {focusedItemImages && focusedItemImages.map((image, index) => (
                            <>
                                <img key={index} src={image} className={`${styles.item} ${styles.focusItem}`} style={{cursor : "default"}}/>
                                <svg className = {`${styles.itemXButton}`} onClick = {() =>removeImage(index)}
                                                                                                                viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#0F1729"/>
                                                                                                            </svg>
                            </>
                        ))}
                        <div className ={styles.addImageWrapper}>
                                <svg className={styles.addImage}
                        fill="#FFFFFF" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 45.402 45.402"
                            xmlSpace="preserve">
                            <g>
                                <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141
                    		c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27
                    		c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435
                    		c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
                            </g>
                                </svg>
                        </div>
                    </div>
                    <div className = {`defaultText ${styles.focusedTitle}`}>{focusedInfo.name}</div>
                <div className = {styles.infoGrid}>

                    <InfoTab name = "Clothing Gender"
                             field = "clothing gender"
                             collection = {title}
                             info = {focusedInfo}
                             onChange = {setFocusedInfo}
                    />
                    <InfoTab name = "Type"
                             field = "type"
                             collection = {title}
                             info = {focusedInfo}
                             onChange = {setFocusedInfo}
                    />
                    <InfoTab name = {`Price (${focusedInfo["currency"] == "euro"? "€": "RON"})`}
                             field = "price"
                             collection = {title}
                             info = {focusedInfo}
                             onChange = {setFocusedInfo}
                    />
                    <BubbleTab title = "Sizes"
                               field = "sizes"
                               collection={title}
                               info = {focusedInfo}
                               setInfoHook = {setFocusedInfo}
                    />
                    <BubbleTab title = "KeyWords"
                               field = "keywords"collection={title}
                               info = {focusedInfo}
                               setInfoHook = {setFocusedInfo}
                    />
                    <InfoTab name = "Description"
                             field = "description"
                             collection = {title}
                             info = {focusedInfo}
                             onChange = {setFocusedInfo}
                    />

                    <BinaryTab name = "Available"
                               field = "available"
                               collection = {title}
                               info = {focusedInfo}
                    />

                {/*TODO: To be implemented */}
                {/* <div className={styles.infoGridItem}>Stock</div>
                <div className={styles.infoGridItem}>PlaceHolder</div> */}
                </div>
            </div>
        </>
        }
        </>
    )
}

// PropTypes validation
Collection.propTypes = {
    title: PropTypes.string.isRequired // Required string
};


export default Collection
