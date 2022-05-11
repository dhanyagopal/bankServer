//server creation

//import express
const express = require('express')

//to import dataservice.js to index.js
const dataService = require('./services/data.service')

//import jsonwebtoken
const jwt = require('jsonwebtoken')
//const req = require('express/lib/request')
//const res = require('express/lib/response')

//import cors
const cors = require('cors')

//create server app using express
const app = express()

//use cors
app.use(cors({
    origin:'http://localhost:4200'
}))

//to parse json data
app.use(express.json())

//resolving REST API call

//GET-TO READ DATA
app.get('/',(req,res)=>{
    res.send("GET REQUEST")
})

//POST-TO CREATE DATA(use thunderclient ext to view this o/p)
app.post('/',(req,res)=>{
    res.send("POST REQUEST")
})

//PUT-TO UPDATE/MODIFY DATA
app.put('/',(req,res)=>{
    res.send("PUT REQUEST")
})

//PATCH-TO PARTIALLY UPDATE DATA
app.patch('/',(req,res)=>{
    res.send("PATCH REQUEST")
})

//DELETE-TO DELETE DATA
app.delete('/',(req,res)=>{
    res.send("DELETE REQUEST")
})

//logMiddleware -application specific middleware
const logMiddleware =(req,res,next)=>{
    console.log("Application specific Middleware")
    next()
}
app.use(logMiddleware)

//BANK SERVER

//jwtmiddleware - To verify token 
 const jwtmiddleware=(req,res,next)=>{
   try { 
 //const token = req.body.token
 const token = req.headers["x-access-token"]//using headers
 console.log(jwt.verify(token,'supersecret123456789'))
 const data = jwt.verify(token,'supersecret123456789')
 req.currentAcno = data.currentAcno //to check acno while deposit/withdraw
 next()
}
catch{
    res.status(401).json({
        status:false,
        message:"please Log IN"
    })
}
}


//REGISTER API
 app.post('/register',(req,res)=>{
 dataService.register(req.body.uname,req.body.acno,req.body.password)
 .then(result=>{
 res.status(result.statusCode).json(result)
 })

//  if(result){
//      res.send("successfully registered..")
//  }
//  else{
//      res.send("Account number already exist....")
//  }
})

//login API
    app.post('/login',(req,res)=>{
    dataService.login(req.body.acno,req.body.pswd)
    .then(result=>{
    res.status(result.statusCode).json(result)
    })  
})


//Deposit API - router specific middleware:jwtMiddleware
    app.post('/deposit',jwtmiddleware,(req,res)=>{
    dataService.deposit(req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{
    res.status(result.statusCode).json(result)
    })   
})

//Withdraw API - router specific middleware:jwtMiddleware
    app.post('/withdraw',jwtmiddleware,(req,res)=>{
    dataService.withdraw(req,req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{
    res.status(result.statusCode).json(result)
    })
})

//Transaction API - router specific middleware:jwtMiddleware
    app.post('/transaction',jwtmiddleware,(req,res)=>{
     dataService.transaction(req.body.acno)
     .then(result=>{
      res.status(result.statusCode).json(result)
     }) 
})

//onDelete API 
    app.delete('/onDelete/:acno',jwtmiddleware,(req,res)=>{
    dataService.deleteAcc(req.params.acno)
    .then(result=>{
     res.status(result.statusCode).json(result)
    }) 
})

//set port number
app.listen(3000,()=>{
    console.log("server started at 3000");
})

