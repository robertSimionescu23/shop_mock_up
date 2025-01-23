import { MongoClient } from "mongodb";
import createArtificalDBEntries from "./createArtificialDBentries.js";


// MongoDB connection URL (replace placeholders with your details)
const uri = "mongodb://localhost:27017/";

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
    try {
        let entry = await createArtificalDBEntries("Jeans");
        // Connect to the database
        await client.connect();
        console.log("Connected to MongoDB!");

        // Select the database and collection
        const database = client.db("testDB"); // Replace with your database name
        const collection = database.collection("testCollection"); // Replace with your collection name

        // Use insertOne to insert the document
        const result = await collection.insertOne(entry);

        // Log the result
        console.log(`Document inserted with _id: ${result.insertedId}`);
    } catch (error) {
        console.error("Error inserting document:", error);
    } finally {
        // Close the connection
        await client.close();
    }
}

run();
