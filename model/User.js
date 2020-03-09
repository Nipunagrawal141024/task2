const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
  eid:Number,
  ename:String,
  email:String,
  productImage: { type: String, required: true },
  date:{
    type: Date,
    default: Date.now
}
  });

module.exports=mongoose.model('User',userSchema) ;