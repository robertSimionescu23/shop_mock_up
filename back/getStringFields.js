import {askQuestion, rl} from "./askQuestion.js";
// //The fields that accept simple strings with little to no logic attached.
var requiredFields = [
    "gender",
    "type",
    "price",
    "size",
    "keywords",
    "description"
]


async function getStringFields() {

    let fieldsArray = [];

    for (let idx = 0; idx < requiredFields.length; idx ++){

        let resp = "";

        switch(requiredFields[idx]){
            case "gender":
                resp = await askQuestion(`${requiredFields[idx]}?\n`);
                if (resp != "female" & resp != "male" & resp != "unisex" & resp != "f" & resp != "m" & resp != "u") {
                    console.log("Unknown gender input. Please choose between \"male\", \"female\" and \"unisex\" clothing. You can also use the first letters of each. ")
                    idx --;
                }
                else{
                    console.log("Gender input successful.")
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
                resp = await askQuestion(`${requiredFields[idx]}?\n`);
                fieldsArray[idx] = resp;
                console.log("Type input successful.")
                break;
            case "price":
                resp = await askQuestion(`${requiredFields[idx]}?\n`);
                if(isNaN(parseFloat(resp))){
                    console.log("Not a floating point number. ")
                    idx--;
                }
                else{
                    console.log("Price input successful.")
                    fieldsArray[idx] = resp;
                }
                break;
            case "size":
                resp = await askQuestion(`${requiredFields[idx]}?\n`);
                fieldsArray[idx] = resp;
            break;
            case "keywords":
                console.log("Input keywords with spaces between them")
                resp = await askQuestion(`${requiredFields[idx]}?\n`);
                let keywords = [];
                keywords = resp.split(" ");

                console.log("Keywords input successful.")
                fieldsArray[idx] = keywords;
                break;
            case "description":
                console.log("Write a product description")
                resp = await askQuestion(`${requiredFields[idx]}?\n`);
                console.log("Description input successful.")
                fieldsArray[idx] = resp;
                rl.close();
                break;

            default:
                break;
        }

    }

    return fieldsArray
}

export default getStringFields
