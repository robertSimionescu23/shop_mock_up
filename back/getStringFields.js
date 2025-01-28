import {askQuestion, rl} from "./askQuestion.js";
// //The fields that accept simple strings with little to no logic attached.
var requiredFields = [
    "gender",
    "type",
    "currency",
    "price",
    "sizes",
    "keywords",
    "description",
    "available"
]


async function getStringFields() {

    let fieldsArray = [];

    for (let idx = 0; idx < requiredFields.length; idx ++){

        let resp = "";

        switch(requiredFields[idx]){
            case "gender":
                resp = await askQuestion(`${requiredFields[idx]}? First letter of full word of "female", "male" and "unisex" are allowed.\n`);
                if (resp != "female" & resp != "male" & resp != "unisex" & resp != "f" & resp != "m" & resp != "u") {
                    console.log("Unknown gender input. Please choose between \"male\", \"female\" and \"unisex\" clothing. You can also use the first letters of each.\n")
                    idx --;
                }
                else{
                    console.log("Gender input successful.\n")
                    if(resp != "f" & resp != "m" & resp != "u")
                        fieldsArray[idx] = resp;
                    else{
                        switch(resp){
                            case("m"):
                                fieldsArray[idx] = "male";
                                break;
                            case("f"):
                                fieldsArray[idx] = "female";
                                break;
                            case("u"):
                                fieldsArray[idx] = "unisex";
                                break;
                        }
                    }
                }
                break;
            case "type":
                resp = await askQuestion(`Type of item? (e.g. Sneakers, Jacket, etc)\n`);
                fieldsArray[idx] = resp;
                console.log("Type input successful.\n")
                break;
            case "currency":
                resp = await askQuestion(`What currency will the price be in? Euro or Lei are accepted.\n`);
                resp = resp.toLowerCase();
                if(resp != "eur" && resp != "euro" && resp != "lei"){
                    console.log("Not a valid currency.\n")
                    idx--;
                }
                else if(resp == "euro"){
                    resp = "euro"
                }
                else{
                    console.log("Currency input successful.\n")
                    fieldsArray[idx] = resp;
                }
                break;
            case "price":
                resp = await askQuestion(`What price will the item have?\n`);
                if(isNaN(parseFloat(resp))){
                    console.log("Not a floating point number.\n")
                    idx--;
                }
                else{
                    console.log("Price input successful.\n")
                    fieldsArray[idx] = resp;
                }
                break;
            case "sizes":
                resp = await askQuestion(`Input sizes available with spaces between them?\n`);
                let sizes = [];
                sizes = resp.split(" ");
                fieldsArray[idx] = sizes;
                console.log("Sizes input successful.\n")
                break;
            case "keywords":
                resp = await askQuestion("Input keywords with spaces between them\n");
                let keywords = [];
                keywords = resp.split(" ");

                console.log("Keywords input successful.\n")
                fieldsArray[idx] = keywords;
                break;
            case "description":
                resp = await askQuestion("Write a product description\n");
                console.log("Description input successful.\n")
                fieldsArray[idx] = resp;
                break;
            case "available":
                resp = await askQuestion("Is the product available now? Respond with \"yes\"/\"y\" or \"no\" / \"n\".\n");
                resp = resp.toLowerCase();
                if(resp != "y" && resp != "yes" && resp != "no" && resp != "n"){
                    console.log("Not a valid response.\n")
                    idx--;
                }
                else if(resp =="y"){
                    resp = "yes"
                    fieldsArray[idx] = resp;
                    console.log("Availability input successful.\n")
                }
                else if(resp == "n"){
                    resp = "no"
                    fieldsArray[idx] = resp;
                    console.log("Availability input successful.\n")
                }
                break;

            default:
                break;
        }

    }

    return fieldsArray
}

export default getStringFields
