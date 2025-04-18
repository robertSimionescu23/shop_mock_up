import styles from "./Collection.module.css"
import PropTypes from "prop-types";
import  { useEffect, useState } from "react";
import axios from "axios";
import InfoTab from "./InfoTab";
import BubbleTab from "./BubbleTab";


function Collection({ title }) {
    const [collection, setCollection] = useState([]);
    const [imageSrc, setImageSrc] = useState([]);
    const [focused, setFocused] = useState(null);
    const [focusedInfo, setFocusedInfo] = useState({});
    const [focuseditemImages, setFocusedItemImages] = useState([]);

    let field;

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
    {
        if (focused != null) {
            axios.get("http://localhost:3000/api/itemById", {
                params: {
                    id: collection[focused][0], //The ID
                    collection: `${title}`
                },
            }).then((response) =>{
                console.log(response.data);
                setFocusedInfo(response.data)
            }).catch(error => {
                console.error("Error fetching images:", error);
            })

            Promise.all( //Send requests for all the images at the paths saved in the collection array, requesting by ID and path.
                collection.map(() =>
                    axios.get("http://localhost:3000/api/imageByUrl", {
                        params: {
                            id: collection[focused][0], //The ID
                            path: collection[focused][1], //The URL
                        },
                        responseType: 'blob', //blobs can be converted to image source
                    })
                )
            )
                .then(responses => {
                    const images = responses.map(response => URL.createObjectURL(response.data));
                    setFocusedItemImages(images);
                })
                .catch(error => {
                    console.error("Error fetching images:", error);
                });

            }
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

    const removebubble = ( hookRef, field, index, id) =>{
        let updatedArray;
        let updatedArrayJSON;

        hookRef((prevInfo) => {
            if(field == "sizes"){
                updatedArray = prevInfo.sizes.filter((_, i) => i !== index); // Remove size at given index
                updatedArrayJSON = { ...prevInfo, sizes: updatedArray };
            }
            else if(field == "keywords"){
                updatedArray = prevInfo.keywords.filter((_, i) => i !== index); // Removekeyword at given index
                updatedArrayJSON = { ...prevInfo, keywords: updatedArray };
            }
            else {
                console.log("Invalid category");
                return {};
            }

            axios.put("http://localhost:3000/api/changeItemByID", {
                id: id,
                key: field,
                value: updatedArray.join(" "),
                collection: title
            }).then( (response) =>
                console.log(response)
            ).catch((error) => console.error(error))
            return updatedArrayJSON // Set the updated keywords array back into state
        });
    }

    return (
        <>
        <div className={styles.collection}>
            <div className={styles.collectionTitelContainer}>
                <span className={`defaultText ${styles.collectionTitle}`}>{title}</span>
            </div>
            <div className={styles.collectionItems}>
                {imageSrc && imageSrc.map((image, index) => (
                    <img key={index} src={image} className={styles.item} onClick={() => setFocused(index)}/>
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
                        {focuseditemImages && focuseditemImages.map((image, index) => (
                        <img key={index} src={image} className={`${styles.item} ${styles.focusItem}`} onClick={() => setFocused(index)}/>
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


                    <div className={styles.infoGridItem}>Available</div>
                    <div className={styles.infoGridItem}><span className = {styles.available}>{focusedInfo.available}</span></div>

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
