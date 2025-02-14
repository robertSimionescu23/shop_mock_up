import express from 'express';
import { MongoClient, ObjectId } from "mongodb";
import { requiredFields } from './createDBEntry.js';
import { customAlphabet } from 'nanoid'

const uri = "mongodb://localhost:27017/";
// Create a new MongoClient
const client = new MongoClient(uri);

const httpServer = express();
httpServer.use(express.json());

function startServer(port){
    // Start the server on designated port
    httpServer.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

// Define getting an item from the DB
httpServer.get('/api/itemById', async (req, res) => {
    let searchShopId;

    if(req.query.id){
        searchShopId = req.query["id"];//get the shopID of the item to be searched in the DB
        try{
            client.connect(); //Connect to DB

            //Choose the db and collection
            const database   = client.db('shopItemsDB');
            const collection = database.collection('items');

            let searchDBID = new ObjectId(searchShopId)

            const DBquery = { _id : searchDBID }; //Format the shopID into a suitable format
            const item = await collection.findOne(DBquery); //Find the item with the id

            if(item == null){
                console.log(`Item with id : ${searchShopId} does not exist.`);
                res.status(404).send("Item is not in the database.");
            }
            else{
                console.log(`Item with id : ${searchShopId} was sent as response to get request.`);
                res.status(200).json(item);
            }
        }
        catch(error){
            res.status(400).send(`Something went wrong`);
            console.error("Error getting item", error);
        }
        finally{
            client.close();
        }

    }
    else{
        console.log("Get request with no query.");
        res.status(400).send("There is no search query.");
    }
});


httpServer.post('/api/item', async (req, res) => {
    if(!req.body || Object.keys(req.body).length == 0){
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
                console.log("Closing client");
                await client.close();
            }
            res.status(200).send(`Item was posted with _id: ${item._id}"`);
        }
    }
});


httpServer.put('/api/changeItemByID', async (req, res) => {
    let searchShopId;
    let keyToChange ;
    let value       ;

    if(Object.keys(req.body).length != 0){
        res.status(400).send("Body contains info.")
        return false
    }

    if(req.query.id){
        searchShopId = req.query["id"];//get the shopID of the item to be searched in the DB
    }
    else{
        console.log("PUT request with no id.");
        res.status(404).send("There is no ID specified.");
        return false;
    }

    if(req.query.key){
        keyToChange = req.query["key"];//get the shopID of the item to be searched in the DB
    }
    else{
        console.log("PUT request with no key.");
        res.status(404).send("There is no key specified to update.");
        return false;
    }
    if(req.query.value){
        value = req.query["value"];
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
            console.log("Closing client");
            await client.close();
        }
    }
});



export default startServer;
