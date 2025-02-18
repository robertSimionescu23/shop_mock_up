var requiredFields = [
    "name"          ,
    "clothing gender",
    "type"          ,
    "currency"      ,
    "price"         ,
    "sizes"         ,
    "keywords"      ,
    "description"   ,
    "available"     ,
    "images"        ]//Define here all the needed fields for the db entry

async function createDBEntry(infoArray){
    var dbEntry = {};

    requiredFields.forEach( (key, index) => {
        dbEntry[key] = infoArray[index];
        index++;
    })

    console.log(`Created entry with shopId ${infoArray[10]}. \n`)

    return dbEntry;
}

export {createDBEntry};
export {requiredFields};
