import mongoose from 'mongoose';

const customerSchema = mongoose.Schema ({
    name:String,
    email:String,
    contact:String,
    balance:Number
});

const historySchema = mongoose.Schema ({
    from:String,
    to:String,
    amount:Number,
    date:Date
});

export const Customers = mongoose.model('Customer' , customerSchema);
export const History = mongoose.model('History', historySchema);