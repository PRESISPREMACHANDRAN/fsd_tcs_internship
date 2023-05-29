const mongoose = require('mongoose');
const AddedItem = require('./AddedItem');
const Schema = mongoose.Schema;

const PackageSchema = new Schema({
    packageID: {
        type: Number,
        unique: true
    },
    packageDate: {
        type: Date,
        required: true
    },
    items: {
        type: [AddedItem],
        required: true
    },
    status: {
        type: String,
        required: true
    },
    customerID: {
        type: Number,
        required: true
    },
    salesOrderID: {
        type: Number,
        required: true
    }
});

//Generate Package ID
PackageSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            let total = await Package.find().sort({ packageID: -1 }).limit(1);
            this.packageID = total.length === 0 ? 1 : Number(total[0].packageID) + 1;
        }
        next()
    } catch (error) {
        next(error)
    }
})

const Package = mongoose.model("package", PackageSchema);
module.exports = Package;