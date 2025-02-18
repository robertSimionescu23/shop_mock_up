# Shop Mock-up

This is my attempt of creating a generic clothing shop site, as an exercise.

- I am using Node.js with Express.js for the back end, in conjunction with MongoDB.
- I intend to use React.js for the front end


An item in the shop is defined by the images it has attached to it and the characteristics represented in text, which I dubbed **string Fields**.

These string fields are:

| Name of field | Description |
| ----------- | ----------- |
|name| A simple string containing the name (White T-Shirt etc.)
|clothing gender| A string containing either "female", "male" or "unisex", so the sizes can be defined accordingly
|type| The type of clothing item (Shirt, Blouse, Jumper)
|currency| The currency used. This will be moved to be project wide, as a configurable element. Currently lei or euro are allowed, as I intend to add a way for conversion, and these are the currencies I am most used to.
|price| The floating point number representing the price in the specified currency
|sizes| An array of strings representing sizes(XS, L, XL, 32)
|keywords| A list of keywords that will be used in searching the shop portfolio
|description| A description of the item, as a phrase.
|available| A simple "yes" or "no" field

So far I implemented this elements:

## addArtificialEntriesToDb.js
 Through this file I added a way to jumpstart the shop DB, by adding a way to add items in bulk, through images in a separate folder. I am currently looking into redoing it, as I restructured the images folder anyway.

 The way it works (or I at least intend to make it so) is it gets the images in a arbitrary folder and creates entries in the data base with information inserted into a prompt in the terminal.

 TODO: Restructure, as Image directory has been restructured. This could wait until **after** I move the image storage to the cloud.

## getStringFields.js

Used to get the string fields described earlier for entries made artificially (by the file earlier). The user will need to type the info for the string fields. I added some shortcuts:

| Field | Shortcut |
| ----------- | ----------- |
|clothing gender| "f" to "female" <br/> "m" to "male" <br/> "u" to "unisex"|
|currency| "eur" to euro|
|availability| "y" to "yes" <br/> "n" to "no"|

## askQuestion.js

Intermediary for using keyboard inputs.

## createDBEntry.js

Intermediary for using the converting the input data, stored in an array, to a entry in the DataBase.

## HTTPServer.js

The base of operation for all http requests coming and going to the back end server. It uses **Express.js** to handle the requests.
TODO: Add an authentication method for safe searching.

Images are handled by **Multer**. They are received through http request and then uploaded locally. I intend to move them to the cloud.

### Get requests

They are considered valid if they have an id in the query with which to search the database. If the id cannot be found, an error message and status are sent back.

### Post Item requests
They add the item to the database if all the information described in the body of the request is valid, and if all fields needed are there. It will be assigned a unique id and added to the DB.

### Post Image requests
A method to upload images to the server. It is separate as the mechanics involved are different.

### Put requests
A method to change the characteristics of a existing database item. The fields are checked. Images cannot be changed this way as they have to be uploaded.

TODO: Add a way to delete or change images.
