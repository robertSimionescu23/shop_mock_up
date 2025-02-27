import express from 'express';
import multer  from 'multer';
import { MongoClient, ObjectId } from "mongodb";
import { requiredFields } from './createDBEntry.js';
import { customAlphabet } from 'nanoid'
import { unlink, mkdirSync, readdirSync , statSync} from 'fs';
import path from 'path';

const uri = "mongodb://localhost:27017/";
// Create a new MongoClient
const client = new MongoClient(uri);

const httpServer = express();

httpServer.use(express.json());
httpServer.use(express.urlencoded({ extended: true }));

function getFiles(directory){
    const directoryPath = directory;

    try {
        let filesPath= readdirSync(directoryPath);
        filesPath = filesPath.map(file => `${directoryPath}` + "/" + `${file}`)
        return filesPath
    } catch (err) {
        console.error('Error reading directory:', err);
        return []
    }
}

function getDirectories(filePaths){
    const directoryList = [];

    let entryStatus

    filePaths.forEach(file => {
        entryStatus = statSync(file);
        if(entryStatus.isDirectory()){
            directoryList.push(file);
        }
        else
            console.log(`WARNING: ${file} is not loose, not contained in a folder.`)
    });

    return directoryList
}

//TODO? Look into uploading images to Filein.io

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const imageFolder = "./images"
        const directories = getDirectories(getFiles(imageFolder))
        let dir = imageFolder + "/" + req.body.id;
        req.uploadLocation = dir;

        if(directories.includes(dir))
            cb(null, dir)
        else{
            try{
                console.log("Creating folder, as it does not exist.")
                mkdirSync(dir, { recursive: true })
                cb(null, dir)
            }
            catch(err){
                console.error("Directory error", err)
            }
        }
    },
    filename: async function(req, file, cb){
        var fileName                = req.body.name || "default";
        let fileExtension           = path.extname(file.originalname)
        let filesInDir              = getFiles(req.uploadLocation)

        let completeFileLocation    = req.uploadLocation + "/" + fileName + fileExtension;

        let iteration = 1; //Mechansim for unique file names
        let origalFileName = fileName
        while (filesInDir.includes(completeFileLocation)){
            fileName = origalFileName + "_" + String(iteration);
            completeFileLocation = req.uploadLocation + "/" + fileName + fileExtension;
            iteration = iteration + 1;
        }

        //Add the file name to the DB
        try{
            console.log("Connecting to DB");
            await client.connect();

            const database = client.db("shopItemsDB");
            const collection = database.collection("items");

            let DBID = new ObjectId(req.body.id)


            const DBquery = { _id : DBID }; //Format the shopID into a suitable format

            let fileWithExtension = fileName + fileExtension
            let pushUpdate = { $push: { images : fileWithExtension } }; // Add image name to image array by pushing

            await collection.updateOne(DBquery, pushUpdate);

            cb(null, fileName + fileExtension);
        }
        catch(err){
            console.error("There was an error adding image path to DB.", err);
            return cb(new Error("Error adding image name to DB."), false);
        }
        finally{
            client.close();
            console.log("Closing DB connection");
        }
    }
})
const upload = multer({storage: storage,
    fileFilter: async function (req, file, cb){

        if(!Object.keys(req.body).length)
            return cb(new Error("Empty body request."), false)
        if(!req.body.id)
            return cb(new Error("No id in request body."), false)

        try{
            console.log("Connecting to DB");
            await client.connect(); //Connect to DB
            const database = client.db("shopItemsDB");
            const collection = database.collection("items");

            if(req.body.id.length != 24){
                console.log("ID not of valid length (24).")
                return cb(new Error("ID is not of 24 character length."), false)
             }

            let DBID = new ObjectId(req.body.id)

            const DBquery = { _id : DBID }; //Format the shopID into a suitable format
            const item = await collection.findOne(DBquery); //Find the item with the id

            if(!item){
                console.log("Id does not exist");
                return cb(new Error("ID does not exist in the database."), false);
            }
        }
        catch(err){
            console.error("DB or file error", err)
        }
        finally{
            await client.close();
            console.log("Closing DB connection")
        }

        let fileExtension = path.extname(file.originalname);

        if([".jpg",".jpeg",".png"].includes(fileExtension))
            return cb(null, true);
        else return cb(new Error("The file is not a common image format. (JPG, PNG or JPEG)"), false);

    },
}) //To upload images to "images" director using express Multer

function startServer(port){
    // Start the server on designated port
    httpServer.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

// Define getting an item from the DB
httpServer.get('/api/itemById', async (req, res) => {
    let searchShopId;
    if(Object.keys(req.body).length){
        console.log("Request body should be empty, but isn't.");
        res.status(404).send("Request Body isn't empty.");
        return false;
    }

    if(req.query.id){
        searchShopId = req.query["id"];//get the shopID of the item to be searched in the DB
        try{
            console.log("Connecting to DB");
            await client.connect(); //Connect to DB

            //Choose the db and collection
            const database   = client.db('shopItemsDB');
            const collection = database.collection('items');

            let searchDBID = new ObjectId(searchShopId)

            const DBquery = { _id : searchDBID }; //Format the shopID into a suitable format
            const item = await collection.findOne(DBquery); //Find the item with the id

            if(!item){
                console.log(`Item with id : ${searchShopId} does not exist.`);
                res.status(404).send("Item is not in the database.");
                return false;
            }
            else{
                console.log(`Item with id : ${searchShopId} was sent as response to get request.`);
                res.status(200).json(item);
                return true;
            }
        }
        catch(error){
            res.status(400).send(`Something went wrong`);
            console.error("Error getting item", error);
            return false;
        }
        finally{
            client.close();
            console.log("Closing DB connection")
        }

    }
    else{
        console.log("Get request with no query.");
        res.status(400).send("There is no search query.");
        return false;
    }
});


httpServer.post('/api/item', async (req, res) => { //Note: For image uploading I can just enter them in the same menu, but upload the image through different request.
    if(!Object.keys(req.body).length){
        console.log("Empty body request was received.")
        res.status(400).send("Empty body request.")
        return false
    }
    const hasOnlyDefinedKeys = Object.keys(req.body).every((key) =>{
        if(requiredFields.includes(key)) return true //Check that only valid keys are used
        else {
            console.log(`"${key}" is not a valid field`)
            return false
        }
    });

    const hasOnlyNeededKeys  = requiredFields.every((key) =>{ //This will return true if all checks return true, but false if even one is not

        if(!(key in req.body)){
            console.log(`key "${key}" is mandatory, but it is not found in the request.`);
            return false;
        }
        else return true;
    });

    if(!hasOnlyNeededKeys || !hasOnlyDefinedKeys) res.status(400).send("Item was not posted because keys are incorrect.");
    else{

        let item = req.body; //Get the body as a JSON
        if(item["clothing gender"] != "male" && item["clothing gender"] != "female" && item["clothing gender"] != "unisex"){
            console.log(`item clothing gender value "${item["clothing gender"]}" is not valid. It needs to be "male", "female" or "unisex".`)
            res.status(400).send("Item was not posted because clothing gender value is not male, female or unisex.");
            return false;
        }
        else if(item["currency"] != "euro" && item["currency"] != "lei"){
            console.log(`item currency "${item["currency"]}" is not valid. It needs to be either "euro" or "lei".`)
            res.status(400).send("Item was not posted because currency value is not euro or lei.");
            return false;
        }
        else if(isNaN(parseFloat(item["price"]))){
            console.log(`item price "${item["price"]}" is not a valid floating point number.`)
            res.status(400).send("Item was not posted because price value is not valid.");
            return false;
        }
        else if(item["available"] != "yes" && item["available"] != "no"){
            console.log(`item availability "${item["available"]}" is not "yes" or "no"`)
            res.status(400).send("Item was not posted because availability value is not valid.");
            return false;
        }
        else{ //If fields are ok

            try{
                const nanoid = customAlphabet('1234567890abcdef', 24) //Unique Id
                let id = nanoid();

                let DBID = new ObjectId(id);
                item._id = DBID //MongoDB _id, also used as shopID

                console.log("Connecting to DB");
                client.connect(); //Connect to DB
                const database = client.db("shopItemsDB");
                const collection = database.collection("items");

                // Use insertOne to insert the document
                const result = await collection.insertOne(item);

                // Log the result
                console.log(`Entry inserted with mongo _id: ${item._id}`);
            }
            catch (error){
                res.status(400).send(`Something went wrong`);
                console.error("Error inserting document:", error);
            }
            finally{
                // Close the connection
                await client.close();
                console.log("Closing DB connection")
            }
            res.status(200).send(`Item was posted with _id: ${item._id}"`);
        }
    }
});

//Used to transmit the error to the request response.
function uploadHandler(req, res) {
    upload.single('uploadImage')(req, res, function (err) {
        if(!req.file){
            console.log("No image provided");
            return res.status(404).send("No image was provided");
        }
        if (err) {
            console.error("Encountered error:", err)
            return res.status(404).send(err.message);
        }
        else{
            console.log("Image uploaded");
            return res.status(200).send("Image uploaded");
        }
    });
}


httpServer.post('/api/uploadImage', uploadHandler); //Note: For multiple image uploading, I could just do multiple requests.
httpServer.delete(`/api/deleteImage`, async (req,res) =>{
    let imageToDelete;
    let id           ;
    if(!Object.keys(req.body).length){
        res.status(404).send("No body request")
        return false
    }

    if(req.body.name)
        imageToDelete = req.body.name
    else{
        res.status(404).send("No image specified")
        return false
    }

    if(req.body.id)
        id = req.body.id
    else{
        res.status(404).send("No item id specified. Specify product to delete image from.")
        return false
    }

    if(id.length != 24){
        res.status(400).send("Id specified is not 24 characters long, thus incompatible.")
        return false
    }

    try{
        console.log("Connecting to DB");
        await client.connect();

        let DBID = new ObjectId(id);

        const database = client.db("shopItemsDB");
        const collection = database.collection("items");

        // Use insertOne to insert the document
        const DBquery = { _id : DBID };
        const result = await collection.findOne(DBquery);

        if(!result){
            res.status(404).send("The item does not exist in the database.");
            return false;
        }
    }
    catch(err){
        console.error(`Database has encountered error looking for item with id ${id}`, err);
    }
    finally{
        client.close();
        console.log("Closing DB connection")
    }

    let imagesInDirectory = getFiles("./images/" + id)
    if(imagesInDirectory.length > 0){
        imageToDelete = "./images/" + id + "/" + imageToDelete;
        if(!imagesInDirectory.includes(imageToDelete)){
            res.status(404).send("The image specified does not exist in the item directory. Please make sure the extension and name are correct.");
            return false;
        }
        else{
            console.log("Image with the given id and name exists, and will be deleted");

            unlink(imageToDelete, (err) => {
                if (err){
                    console.log("Image could not be deleted");
                    throw err;
                }
                console.log(`Image was deleted`);
            });
            res.status(200).send("The image was deleted with succes.")
            return true;
        }
    }
    else{
        res.status(404).send("The item does not have any images to delete.");
        return false;
    }


});

httpServer.put('/api/changeItemByID', async (req, res) => {
    let searchShopId;
    let keyToChange ;
    let value       ;

    console.log(req.body)

    if(!Object.keys(req.body).length){
        res.status(404).send("No body request");
        return false;
    }
    if(req.body.id){
        searchShopId = req.body.id;//get the shopID of the item to be searched in the DB
    }
    else{
        console.log("PUT request with no id.");
        res.status(404).send("There is no ID specified.");
        return false;
    }
    if(req.body.id && req.body.id.length != 24){
        console.log("PUT request with invalid id length.");
        res.status(404).send("The ID is not of 24 character length.");
        return false;
    }

    if(req.body.key){
        keyToChange = req.body.key;//get the shopID of the item to be searched in the DB
    }
    else{
        console.log("PUT request with no key.");
        res.status(404).send("There is no key specified to update.");
        return false;
    }
    if(req.body.value){
        value = req.body["value"];
    }
    else{
        console.log("PUT request with no value.");
        res.status(404).send("There is no value to assign to the specified key.");
        return false;
    }

    if (!(requiredFields.includes(keyToChange))){
        console.log(`item field "${keyToChange}" is not valid`)
        res.status(400).send(`Item was not modified because field to be changed, "${keyToChange}", is not valid.`);
        return false;
    }
    else if(keyToChange == "images"){
        console.log(`Images have to be uploaded. This is not the right method`)
        res.status(400).send("Images have to be uploaded. This is not the right method.");
        return false;
    }

    else if(keyToChange == "clothing gender" && value != "male" && value != "female" && value != "unisex"){
        console.log(`item clothing gender value "${value}" is not valid. It needs to be "male", "female" or "unisex".`)
        res.status(400).send("Item was not modified because clothing gender value is not male, female or unisex.");
        return false;
    }
    else if(keyToChange == "currency" && value != "euro" && value != "lei"){
        console.log(`item currency "${value}" is not valid. It needs to be either "euro" or "lei".`)
        res.status(400).send("Item was not modified because currency value is not euro or lei.");
        return false;
    }
    else if(keyToChange == "price" && isNaN(parseFloat(value))){
        console.log(`item price "${value}" is not a valid floating point number.`)
        res.status(400).send("Item was not modified because price value is not valid.");
        return false;
    }
    else if(keyToChange == "available" && value != "yes" && value != "no"){
        console.log(`item availability "${value}" is not "yes" or "no"`)
        res.status(400).send("Item was not modified because availability value is not valid.");
        return false;
    }


    else{ //If fields are ok
        try{
            console.log("Connecting to DB");
            client.connect(); //Connect to DB
            const database = client.db("shopItemsDB");
            const collection = database.collection("items");

            let DBID = new ObjectId(searchShopId)

            const filter = { _id: DBID };        // Condition to find the document

            let update;
            if(keyToChange == "sizes" || keyToChange == "keywords")
                update = { $set: { [keyToChange]: value.split(" ") } }; // Fields to update
            else
                update = { $set: { [keyToChange]: value } };

            const result = await collection.updateOne(filter, update);
            // Log the result
            if(result.matchedCount == 0){
                console.log(`Item with id ${searchShopId} does not exist in the database.`)
                res.status(404).send(`Item with shopId "${searchShopId}" does not exist in the DataBase.`);
            }
            else{
                console.log(`Item with shopID: ${searchShopId} was modified.`);
                res.status(200).send(`Item with shopId "${searchShopId}" had field ${keyToChange} set to value ${value}`);
            }
        }
        catch (error){
            console.error("Error changing document field:", error);
            res.status(400).send(`Something went wrong`);
        }
        finally{
            // Close the connection
            await client.close();
            console.log("Closing DB connection")
        }
    }
});



export default startServer;
