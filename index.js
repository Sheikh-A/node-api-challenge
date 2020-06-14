require('dotenv').config();// read from a .env file 
//located at the root of the project and merge the key/value pairs
//into process.env

//const server = require("./api/server.js");
const server = require('./server.js');
const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`\n** Server running on http://localhost:${port} *** \n`);
});



