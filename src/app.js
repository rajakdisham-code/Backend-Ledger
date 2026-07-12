const express = require("express");  // first step to require express  
// Express is minimal flexible Node.js web framework , that make building HTTP server simple 

const cookieParser = require("cookie-parser") ;




const app = express() ;  


app.use(express.json()) ; // middleware is for support for parsing auth , logging , error handling
app.use(cookieParser()); 

/**
* - Routes required
*/
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionRoutes = require("./routes/transaction.routes")


/**
* - Use Routes
*/
app.get("/" , (req,res) =>{
    res.send("Ledger service is up and running")
})
app.use("/api/auth" , authRouter) 
app.use("/api/accounts" , accountRouter)
app.use("/api/transactions" , transactionRoutes)

module.exports = app ;