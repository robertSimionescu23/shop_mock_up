import addArtificialEntriesToDb from "./addArtificialEntriesToDb.js";
import startServer from "./HTTPServer.js";

async function run(){
    if(process.argv[2] == "-artifical")
        await addArtificialEntriesToDb();
    startServer(3000);
}

run();
