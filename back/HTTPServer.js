import express from 'express';
import { MongoClient } from "mongodb";
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
httpServer.get('/itemById', async (req, res) => {
    let searchShopId;

    if(req.query.id){
        searchShopId = req.query["id"];//get the shopID of the item to be searched in the DB

        try{
            client.connect(); //Connect to DB

            //Choose the db and collection
            const database = client.db('shopItemsDB');
            const collection = database.collection('items');

            const DBquery = { shopID : searchShopId }; //Format the shopID into a suitable format
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

httpServer.post('/item', async (req, res) => {
    const hasOnlyNeededKeys = requiredFields.every(key =>{
        if(key == "shopID"){
            if(key in req.body) console.log("shopID is created server side. Do not include it in the request.")
            return !(key in req.body);
        }
        if (!(key in req.body))
            console.log(`key "${key}" is mandatory, but it is not found in the request.`);
        return (key in req.body);
    }
    );
    if(!hasOnlyNeededKeys) res.status(400).send("Item was not posted because mandatory keys are missing.");
    else{
        let goodReq = true;

        let item = req.body; //Get the body as a JSON
        if(item["clothing gender"] != "male" && item["clothing gender"] != "female" && item["clothing gender"] != "unisex"){
            console.log(`item clothing gender value "${item["clothing gender"]}" is not valid. It needs to be "male", "female" or "unisex".`)
            res.status(400).send("Item was not posted because clothing gender value is not male, female or unisex.");
            goodReq = false;
        }
        else if(item["currency"] != "euro" && item["currency"] != "lei"){
            console.log(`item currency "${item["currency"]}" is not valid. It needs to be either "euro" or "lei".`)
            res.status(400).send("Item was not posted because currency value is not euro or lei.");
            goodReq = false;
        }
        else if(isNaN(parseFloat(item["price"]))){
            console.log(`item price "${item["price"]}" is not a valid floating point number.`)
            res.status(400).send("Item was not posted because price value is not valid.");
            goodReq = false;
        }
        else if(item["available"] != "yes" && item["available"] != "no"){
            console.log(`item availability "${item["available"]}" is not "yes" or "no"`)
            res.status(400).send("Item was not posted because availability value is not valid.");
            goodReq = false;
        }

        if(goodReq){
            const nanoid = customAlphabet('1234567890abcdef', 6) //Unique Id
            let id = nanoid();

            // Create a new MongoClient
            client.connect(); //Connect to DB

            item["shopID"] = id;
            try{
                const database = client.db("shopItemsDB");
                const collection = database.collection("items");

                // Use insertOne to insert the document
                const result = await collection.insertOne(item);

                // Log the result
                console.log(`Entry inserted with _id: ${result.insertedId}`);
            }
            catch{
                console.error("Error inserting document:", error);
            }
            finally{
                // Close the connection
                console.log("Closing client");
                await client.close();
            }
            res.status(200).send(`Item was posted with shopId "${item["shopID"]}"`);
        }
    }

});


export default startServer;
