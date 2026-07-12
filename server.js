const dns = require("dns") ;
dns.setServers(["1.1.1.1" , "8.8.8.8"]);

require("dotenv").config() ;
const app = require("./src/app") ; 
const connectDB = require("./src/config/db") ;


connectDB() ;



app.listen(3000 , () => { // app.listen => starts the server using Express.js and make it listen for incoming req on port 3000 
    console.log("Server is running on port 3000")  // port number = Room number , IP add = Building no 
})  // prot 3000 - our computer  , port80 - HTTP , port 443 - HTTPS