const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    // here no required to define schema for username and password passport-local-mongoose 
    // automatically define.
});

userSchema.pre('findOne', function() {
    // Set the maximum execution time for the query to 30 seconds (30000 milliseconds)
    this.maxTimeMS(30000);
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports=User;