var express=require("express");
var cors=require("cors");
var bodyparser=require("body-parser");
var nodemailer = require("nodemailer");
var app=express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
var sharedObj = require('./connection');
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your email",
        pass: "password"
    }
});
var rand,mailOptions;

app.post('/reg-user', function (req, res) {
    var dataObj = req.body.data;
    sharedObj.fnGetMongoCon(res, function (db) {
        var collection = db.collection('register');
        collection.insertOne(dataObj, function (e, r) {
            if (e) {
                res.send(e);
            } else {
                res.send(r);
            }
        })
    });

})

app.post('/login-check', function (req, res) {
    var userObj = req.body.data;
    sharedObj.fnGetMongoCon(res, function (db) {
        var collectin = db.collection('register');
        collectin.find(userObj).toArray(function (e, r) {
            if (e) {
                res.send({login:"success"});
            } else {
                res.send({login:"failed"});
            }
        })
    })
})




app.get('/fetch',(req,res)=>
{
 
    var userObj = req.body.data;
    sharedObj.fnGetMongoCon(res, function (db) {
        var collectin = db.collection('register');
        collectin.find().toArray(function (e, r) {
            if (e) {
				console.log(e);
                res.send(e);
				
            } else {
				console.log(r);
                res.send(r);
				
            }
        })
    })
})

app.get('/send',function(req,res){
    rand=Math.floor(1000 + Math.random() * 9000);

mailOptions={
    from: "balendrabcaigntu@gmail.com",
    to : "balendramcapu@gmail.com",
    subject : "ONE TIME PASSWORD",
    html : "Hello,<br> <h1>your one time password is </h1><b>"+ rand +"</b>"	
}
console.log(mailOptions);
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    res.end("error");
 }else{
        console.log("Message sent: " + response.message);
    res.end("sent");
     }
});
});

app.listen(8080);
console.log('server lsitening');