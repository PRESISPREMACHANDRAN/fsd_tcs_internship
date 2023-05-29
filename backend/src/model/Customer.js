const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    customerID: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerType: {
        type: String,
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
        required: true
    },
    addressLine3: {
        type: String,
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    emailID: {
        type: String,
    },
    contactNo1: {
        type: String,
        required: true
    },
    contactNo2: {
        type: String,
    },
    website: {
        type: String,
    }
});

//Generate Customer ID
CustomerSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            let total = await Customer.find().sort({ customerID: -1 }).limit(1);
            this.customerID = total.length === 0 ? 1 : Number(total[0].customerID) + 1;
        }
        next()
    } catch (error) {
        next(error)
    }
})

const Customer = mongoose.model("customer", CustomerSchema);
module.exports = Customer;