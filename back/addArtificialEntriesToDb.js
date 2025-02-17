import fs from "fs/promises"
import { customAlphabet } from 'nanoid'
import getStringFields from "./getStringFields.js"
import {createDBEntry} from "./createDBEntry.js";
import { MongoClient } from "mongodb";
import { askQuestion, rl } from "./askQuestion.js";

//TODO: Revisit this to add image handeling.

// MongoDB connection URL (replace placeholders with your details)
const uri = "mongodb://localhost:27017/";

// Create a new MongoClient
const client = new MongoClient(uri);

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

    if(imagesPath.length == 0)
        console.log("\n######WARNING#######\n\nThere were no images found. A imageless entry will be created.\nImages can added created later. If unsatisfactory, force stop with CTRL-C and this entry will be invalidated All previous entries will still be added.\n\n#####WARNING#####\n")

    console.log(`Input information for product ${name}`);
    let stringFields = await getStringFields(); //Get all info inputed by user.
    const nanoid = customAlphabet('1234567890abcdef', 24) //Unique Id
    let id = nanoid();

    let infoArray = [name, ...stringFields, imagesPath, id]; //Add all info into an array.

    let entry = await createDBEntry(infoArray);

    return entry;
}

async function addArtificialEntriesToDb() {
    let entryName = "start";

    try {
        while(entryName != ""){
            entryName = await askQuestion(`Input the name of the product you wish to insert.\nIn the images folder, any image containing that name will be added to the image list.\nTo stop, leave blank.\n`);
            if(entryName != ""){
                let entry = await createArtificalDBEntries(entryName);
                // Connect to the database
                await client.connect();
                console.log("Connected to MongoDB!");

                // Select the database and collection
                const database = client.db("shopItemsDB");
                const collection = database.collection("items");

                // Use insertOne to insert the document
                const result = await collection.insertOne(entry);

                // Log the result
                console.log(`Document inserted with _id: ${result.insertedId}`);
            }
        }
        console.log("Stopped adding entries.");
        rl.close();
    } catch (error) {
        console.error("Error inserting document:", error);
    } finally {
        // Close the connection
        console.log("Closing client");
        await client.close();
    }
}


export default addArtificialEntriesToDb;
