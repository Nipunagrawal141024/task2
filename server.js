const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const Login=require('./model/login');
const User=require('./model/User');
const mongoose=require('mongoose');
const URL = "mongodb://localhost:27017/RESTDB";
mongoose.connect(URL);
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
 destination: function(request, file, cb) {
   console.log('heloo',path.join(__dirname,'/uploads'))
    cb(null,path.join(__dirname,'/uploads'));   //PATH TO STORE THE FILE
  },
  filename: function(request, file, cb) {
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
// cb(null, file.fieldname + "-" + Date.now()) + ext;
    cb(null, file.fieldname + "-" + Date.now()+ path.extname(file.originalname) + ext);
  }
});

const fileFilter = (request, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); //Store the file
  } else {
    cb(null, false);//reject the file
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

app.listen(3000,()=>{
  console.log("Server started....");
});


//to set CSRF Token
 app.use(bodyParser.urlencoded({
     extended: true
   }));

//configure body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));
app.use('/uploads', express.static('uploads'));

app.post('/newuser',upload.single('productImage'),(request,response)=>{
     console.log(request.body);
    var newUser=new User({
        eid:request.body.eid,
        ename:request.body.ename,
        email:request.body.email,
        productImage: request.file.path 
      });

newUser.save(function (err, result) {
      if (err)
      response.json({msg:'Data Not Inserted',description:err})
      else
      response.json({msg:'Data Inserted'})
    });
});

app.put('/updateuser',(request,response,next)=>{
     console.log(request.body);
User.updateOne({eid:request.params.eid},{
  ename:request.params.ename,
  email:request.params.email},function (err, result) {
      if (err)
      response.json({msg:'Data Not Updated',description:err})
      else
      response.json({msg:'Data Updated'})
    });
});

app.patch('/updateusersalarybyeid',(request,response,next)=>{
     console.log(request.body);
User.updateOne({eid:request.params.eid},{
  email:request.params.email},function (err, result) {
      if (err)
      response.json({msg:'Data Not Updateed',description:err})
      else
      response.json({msg:'Data Updated'})
    });
});

app.get('/viewalluser',(request,response,next)=>{
User.find(function (err, result) {
      if (err)
      response.json({description:err})
      else
      response.json({data:result})
    });
});

app.get('/viewuserbyeid',(request,response,next)=>{
User.findOne({eid:request.params.eid},function (err, result) {
      if (err)
      response.json({description:err})
      else
      response.json({data:result})
    });
});


app.get('/checklogin',(request,response)=>{
  Login.findOne({userid:request.body.uid,password:request.body.pwd},function (err, result) {
        if (err)
        response.json({description:err})
        else if(result==null)
        response.json({msg:'Login Fail'})
        else
        response.json({msg:'Login Success'})
    });
  });
  
app.get('/deluser',(request,response,next)=>{
User.deleteOne({eid:request.params.eid},function (err, result) {
  console.log(result);
      if (err)
      response.json({description:err})
      else
      response.json({desc:result})
  });
});