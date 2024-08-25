// import the express module
const express = require("express");
const fs = require("fs/promises");
// create an express application
const app = express();
const path = require("path");

const getAllFiles = async (request, response) => {
  let results = [];
  /*read the list of files in the folder async */
  try {
    const files = await fs.readdir(path.join(__dirname, "/files"));
    for (const file of files) {
      const content = await fs.readFile(
        path.join(__dirname, `/files/${file}`),
        { encoding: "utf8" }
      );
      results.push({ file, content: new Date(content) });
    }
    
    results.sort((a, b) => a.content - b.content);
    response.send({
      message: " file content: timestamp in ISO string",
      results,
    });
  } catch (err) {
    console.log(err);
    response.send(err.message);
  }
};
const createFile = async (request, response) => {
  const directoryPath = "./files";

  // Use fs.promises.mkdir() to create the directory asynchronously
  fs.mkdir(directoryPath)
    .then(() => console.log(`Directory '${directoryPath}' created.`))
    .catch((err) => console.error(` ${err.message}`));

  //  logic goes here to get the current timestamp and format it
  // and make it as a file name and to be written in the file
  let current_date = new Date();
  let file_name = current_date
    .toLocaleString()
    .replaceAll("/", "-")
    .replaceAll(":", "-");

  // create a file in a folder called as files
  try {
    /*
    file name:  current date - time in locale format
    file content: current timestamp in ISO string
    */
    await fs.writeFile(`files/${file_name}.txt`, current_date.toISOString());
    response.send(`${file_name}.txt created successfully`);
    console.log(`files/${file_name}.txt created successfully`);
  } catch (err) {
    console.log(err);
    response.send("Error creating file");
  }
};
// use the express middleware for enabling access to the files
app.use(express.static("files"));
// use the express middleware for parsing json data
app.use(express.json());
// Define a route handler for the  "GET" request "/createFile"
app.get("/createFile", createFile);
// Define a route handler for the  "GET" request "/getAllFiles"
app.get("/getAllFiles", getAllFiles);
// start the server and listen on port 3000
app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});