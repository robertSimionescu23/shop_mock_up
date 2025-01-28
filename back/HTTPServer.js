import express from 'express';
import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017/";

// Create a new MongoClient
const client = new MongoClient(uri);

const httpServer = express();

function startServer(port){
    // Start the server on designated port
    httpServer.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

// Define getting an item from the DB
httpServer.get('/item', async (req, res) => {
    console.log(req.query["id"]);
    let searchShopId = req.query["id"];
    const database = client.db('testDB');
    const collection = database.collection('testCollection');
    const DBquery = { shopID : searchShopId };
    const item = await collection.findOne(DBquery);
    if(item == null){
        console.log(`Item with id : ${searchShopId} does not exist.`);
        res.status(404).send("Item is not in the database.");
    }
    else
        res.json(item);
});


export {startServer};
