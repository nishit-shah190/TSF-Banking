import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import {dirname} from 'path';

import { Customers , History } from "./database.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

const dbpassword = process.env.MongoPass;
const CONNECTION_URL = "mongodb+srv://Nishit_Shah:"+dbpassword+"@cluster0.w34vn.mongodb.net/tsfbank?retryWrites=true&w=majority";

mongoose.connect(CONNECTION_URL , {useNewUrlParser : true , useUnifiedTopology :true})
   .then(() => app.listen(3000, () => console.log("Server is listening in Port 3000")))
   .catch((error) => console.log(error));

app.get("/", function(req,res){
    res.render("index");
});

app.get("/customers", function(req,res){
    Customers.find({} , function(err,customer)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("customer", {customers:customer})

        }
    })
});
app.get("/transactions", function(req,res){
    History.find({}, function(err,history)
    {
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("transactions", {histories:history})
        }
    })
});

app.get("/transfermoney/:id", function(req,res)
{
    const id = req.params.id;
    Customers.findById(id , function(err,customer)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            var fromName = customer.name;
            if(fromName)
            {
                Customers.find({}, function(err, Customer)
                {
                    
                    res.render("transfermoney", {customerName:fromName, customers:Customer})
                })
            }
        }
    })
    
});
app.post("/transfer/:name", function(req, res) {
    var from = req.params.name;
    var to = req.body.to;
    var amount = req.body.amount;
    var date = new Date();
    var options ={
        weekday:"long",
        day:"numeric",
        month:"long",
        year:"numeric",
        time:"numeric"
    };
    
    var time = date.toLocaleTimeString("en-US", options)
    
    console.log(time);
    const history = new History({
        from:from,
        to:to,
        amount:amount,
        date:time
    })
    history.save();
    Customers.findOneAndUpdate({name:from}, {$inc:{balance:-amount}},function(err, foundData)
    {
        if (!err) {
            Customers.findOneAndUpdate({name:to}, {$inc:{balance:amount}},function(err,Datafound)
            {
                if(err)
                {
                    console.log("To not updated");
                }
                else
                {
                    console.log(Datafound);
                }
            });
            res.render("successful");
        } else {
            console.log(err);
        }
    });
   
    
   
    
});
