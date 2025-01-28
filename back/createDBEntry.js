async function createDBEntry(infoArray){
    var dbEntry = {};

    dbEntry["name"    ]         = infoArray[0];
    dbEntry["gender"  ]         = infoArray[1];
    dbEntry["type"    ]         = infoArray[2];
    dbEntry["currency"]         = infoArray[3];
    dbEntry["price"   ]         = infoArray[4];
    dbEntry["sizes"    ]        = infoArray[5];
    dbEntry["keywords"]         = infoArray[6];
    dbEntry["description"]      = infoArray[7];
    dbEntry["available"]        = infoArray[8];
    dbEntry["images"  ]         = infoArray[9];
    dbEntry["shopID"  ]         = infoArray[10];

    console.log(`Created entry with shopId ${infoArray[10]}. \n`)

    return dbEntry;
}

export default createDBEntry;
