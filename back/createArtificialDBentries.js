import fs from "fs/promises"
import { customAlphabet } from 'nanoid'
import getStringFields from "./getStringFields.js"
import createDBEntry from "./createDBEntry.js";

async function createArtificalDBEntries(name){

    let imagefolder = "./images";
    let imagesPath  = [];
    //To create the basics, there needs to be an artifical way to fill up the data base. In the end product this will be done from the admin console.
    //For every image in folder containing the name, create a db entry.
    const pathList = await fs.readdir(imagefolder);
    pathList.forEach((path)=>{
        if (path.includes(name))
            //Get all image paths with the corrrect name
            imagesPath.push(imagefolder + path);
    })

    console.log(`Input information for product ${name}`);
    let [gender, type, price, size, keywords, description] = await getStringFields();
    const nanoid = customAlphabet('1234567890abcdef', 6)
    let id = nanoid();

    let entry = await createDBEntry(name, gender, type, price, size, keywords, imagesPath, id, description);

    return entry;
}

export default createArtificalDBEntries;
