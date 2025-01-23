

async function createDBEntry(name, gender, type, price, size, keywords, imagePaths, shopID, desc){
    var dbEntry = {};

    dbEntry["name"    ]         = name      ;
    dbEntry["gender"  ]         = gender    ;
    dbEntry["type"    ]         = type      ;
    dbEntry["price"   ]         = price     ;
    dbEntry["size"    ]         = size      ;
    dbEntry["keywords"]         = keywords  ;
    dbEntry["description"  ]    = desc      ;
    dbEntry["images"  ]         = imagePaths;
    dbEntry["shopID"  ]         = shopID    ;

    return dbEntry;
}

export default createDBEntry;
