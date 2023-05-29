const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorSchema = new Schema({
    vendorID: {
        type: Number,
        unique: true
    },
    companyName: {
        type: String,
        required: true
    },
    goodsServices: {
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
    },
    pocName: {
        type: String,
        required: true
    },
    pocEmail: {
        type: String,
        required: true
    },
    pocContactNo: {
        type: String,
        required: true
    }
});

//Generate Vendor ID
VendorSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            let total = await Vendor.find().sort({ vendorID: -1 }).limit(1);
            this.vendorID = total.length === 0 ? 1 : Number(total[0].vendorID) + 1;
        }
        next()
    } catch (error) {
        next(error)
    }
})

const Vendor = mongoose.model("vendor", VendorSchema);
module.exports = Vendor;