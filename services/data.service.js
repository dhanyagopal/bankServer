//jsonwebtoken import
const jwt = require('jsonwebtoken')

//import db
const db = require('./db')

//database
database = {
    1000:{acno:1000,uname:"arun",password:1000,balance:5000,transaction:[]},
    1001:{acno:1001,uname:"vineeth",password:1001,balance:3000,transaction:[]},
    1002:{acno:1002,uname:"shyam",password:1002,balance:7000,transaction:[]},
  }


  //register - index.js will give uname,acno,password
  //register
   const register = (uname, acno, password)=> {

    //asynchronous
   return db.User.findOne({acno})
   .then(user=>{
     console.log(user);
     if(user){
      //already exist
      return {
        statusCode:401,
        status:false,
        message:"Account number already exist..."
      }
    }
    else{
      const newUser = new db.User({
          acno,
          uname,
          password,
          balance:0,
          transaction:[]
        })
        newUser.save()
        return {
          statusCode:200,
          status:true,
          message:"Successfully registered... Please Log in"
         }  
    }

   })
     
  }

//login -updated
const login = (acno,pswd)=>{

 return db.User.findOne({acno,password:pswd})
  .then(user=>{
    if(user){
      currentUser = user.uname
      currentAcno = acno 
      //token generate
      const token = jwt.sign({
      currentAcno: acno
      },'supersecret123456789')
     return {
     statusCode:200,
     status:true,
     message:"Login successfull....",
     currentAcno,
     currentUser,
     token
 }
}
else{
     return {
    statusCode:401,
      status:false,
      message:"Invalid Credentials..."
      }
     }
  }) 
}


  //login
//  const login = (acno,pswd)=>{

//   if(acno in database){

//     if(pswd == database[acno]["password"]){
//       currentUser = database[acno]["uname"]
//       currentAcno = acno 
//       //token generate
//        const token = jwt.sign({
//         currentAcno: acno
//         },'supersecret123456789')

//        return {
//         statusCode:200,
//         status:true,
//         message:"Login successfull",
//         token,
//         currentAcno,
//         currentUser
//        }
//     }
//     else{
//       return {
//         statusCode:422,
//         status:false,
//         message:"Incorrect password"
//       }
//     }
//   }
//   else{
    
//     return {
//       statusCode:401,
//         status:false,
//         message:"user does not exist..."
//     }
//   }
// }

//deposit -updated
const deposit = (acno,pswd,amt)=>{
  var amount = parseInt(amt)
 
  return db.User.findOne({acno,password:pswd})
  .then(user=>{
    if(user){
      user.balance +=amount
      user.transaction.push({
        type:"CREDIT",
        amount:amount    
  })
   user.save()
      return {
        statusCode:200,
        status:true,
        message:amount +"successfully deposited..And new balance is:" +  user.balance
       }
    }
    else{
      return {
        statusCode:401,
          status:false,
          message:"Invalid Credentials..."
       }
    }
  })
}

//deposit
//  const deposit = (acno,pswd,amt)=>{
//   var amount = parseInt(amt)
 
//   if(acno in database){
//     if(pswd == database[acno]["password"]){
//       database[acno]["balance"] +=amount
//       database[acno]["transaction"].push({
//         type:"CREDIT",
//         amount:amount    
//       })

//       return {
//         statusCode:200,
//         status:true,
//         message:amount +"successfully deposited..And new balance is:" +  database[acno]["balance"]
//        }
//     }
//     else{
//       return {
//         statusCode:422,
//         status:false,
//         message:"Incorrect password!!!"
//       }
//     }
//   }
// else{
//   return {
//     statusCode:401,
//       status:false,
//       message:"user does not exist..."
//    }
//   }
//  }


//withdraw-updated
 const withdraw = (req,acno,pswd,amt)=>{
  var amount = parseInt(amt)

  return db.User.findOne({acno,password:pswd})
  .then(user=>{
    if(req.currentAcno!=acno){
      return {
        statusCode:422,
        status:false,
        message:"operation Denied!!!"
      }
    }
    if(user){
      if(user.balance>amount){
        user.balance -=amount
        user.transaction.push({
          type:"DEBIT",
          amount:amount    
        })
        user.save()
        return {
          statusCode:200,
          status:true,
          message:amount +"successfully debitted..And new balance is:" +   user.balance
         }
       }
       else{
        return {
          statusCode:401,
            status:false,
            message:"Insufficient Balance..."
         }
       }
    }
    else {
      return {
        statusCode:401,
          status:false,
          message:"Invalid Credentials..."
       }
    }
  })
}
  
//withdraw
// const withdraw = (req,acno,pswd,amt)=>{
//   var amount = parseInt(amt)

//   if(acno in database){
//     if(pswd == database[acno]["password"]){

//         if(req.currentAcno!=acno){
//           return {
//             statusCode:422,
//             status:false,
//             message:"operation Denied!!!"
//           }
//         }

//         if(database[acno]["balance"]>amount){
//           database[acno]["balance"] -=amount
//           database[acno]["transaction"].push({
//             type:"DEBIT",
//             amount:amount    
//           })
          
//           return {
//             statusCode:200,
//             status:true,
//             message:amount +"successfully debitted..And new balance is:" +   database[acno]["balance"]
//            }
//         }
//         else{
//           return {
//             statusCode:422,
//             status:false,
//             message:"Insuficcient balance!!!"
//           }
//         }
//       }
//     else{
//         return {
//         statusCode:422,
//         status:false,
//         message:"Incorrect password!!!"
//       }
//     }
//   }
// else{
//   return {
//     statusCode:401,
//       status:false,
//       message:"User doesnot exist!!!"
//    }
//  }
// }

//transaction-updated
 const transaction = (acno)=>{
   return db.User.findOne({acno})
   .then(user=>{
     if(user){
      return {
        statusCode:200,
        status:true,
        transaction:user.transaction
       }
     }
     else{
      return {
        statusCode:401,
          status:false,
          message:"User doesnot exist!!!"
       }
     }
   })
}

//transaction
// const transaction = (acno)=>{
//   if(acno in database){
//    return {
//      statusCode:200,
//      status:true,
//      transaction:database[acno].transaction
//     }
//   }
//  else{
//    return {
//      statusCode:401,
//        status:false,
//        message:"User doesnot exist!!!"
//     }
//  }
 
// }

//deleteAccount
const deleteAcc=(acno)=>{
  return db.User.deleteOne({acno})
  .then(user=>{
    if(!user){
      return{
        statusCode:401,
        status:false,
        message:"Operation Failed!!!"
      }
    }
    else{
      return {
        statusCode:200,
        status:true,
        message:"Account Number" +acno+ "deleted successfully...."
      }
    }
  })
}

  //export
  module.exports={
    register,
    login,
    deposit,
    withdraw,
    transaction,
    deleteAcc
  }