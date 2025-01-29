import addArtificialEntriesToDb from "./addArtificialEntriesToDb.js";
import startServer from "./HTTPServer.js";

async function run(){
    await addArtificialEntriesToDb();
    startServer(3000);
}

run();
