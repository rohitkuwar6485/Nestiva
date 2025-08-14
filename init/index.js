// ------------------INITIALIZED DATA-------//
//mongoose required

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main()
    .then(()=>{
        console.log("Connection Successful");
    })
    .catch((err)=>{
        console.log(err);
    });
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initdata.data =initdata.data.map((obj) => ({...obj,owner:"689dc6a5787e535a9c06998a"}));
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");
}

initDB();