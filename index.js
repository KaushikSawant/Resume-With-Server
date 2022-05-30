const express = require("express");
const mysql = require("mysql");
const cors= require("cors");
const bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "mlab1234",
    database: "project"
});

app.post('/register',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    var hashedpassword;
    
    async function securityHash(fun){
        console.log("0");
        const salt = await bcrypt.genSalt(10);
        console.log(1);
        hashedpassword = await bcrypt.hash(password, salt);
        console.log(2);
        console.log("hashpass"+ " " + hashedpassword);
        console.log(3);
        fun();//first becrypt will fininsh the insert will be called bcoz of callback earlier insert was getting called with only email and hashing was taking time.
    }
    
    const insert=()=>{
        db.query("INSERT INTO users (email,password) VALUES(?,?)",
        [username, hashedpassword],console.log("4"),console.log("user"+ " "+ username+ " "+"dbq" + " " +hashedpassword),
        (err,result)=>{
        console.log(err);
    });
    }
    securityHash(insert);//callback
    //clear the text fields of username and pass other wise after starting server it will send those values first.
    
});

/*app.post('/login',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
   // bcrypt.compare(password,)
    //db.query("SELECT password FROM users WHERE email = ?"), 
   db.query("SELECT * FROM users WHERE email = ? AND password = ?",
   [username, password],
   (err,result)=>{
       if(err){
           res.send({err:err});
       }
       if(result.length > 0){
           res.send(result);
       }else{
           res.send({message:"wrong credentials"});
       }
   });
});*/

app.post('/login',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
     
   db.query("SELECT * FROM users WHERE email = ?",
   [username],
   (err,result)=>{
       if(err){
           res.send({err:err});
       }
       if(result.length > 0){
           bcrypt.compare(password,result[0].password);
           console.log(result[0].password);
           if(result){
               console.log("success login");
           res.send(result)
           //res.redirect("/Register");
           console.log("redirect");
        };
       }else{
           console.log("error");
           res.send({message:"wrong credentials"});
       }
   });
});

app.listen(3001, () => {
    console.log("running server"); 
});
