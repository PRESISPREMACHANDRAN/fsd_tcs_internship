const mongoose = require('mongoose');
const AddedItem = require('./AddedItem');
const Schema = mongoose.Schema;

const DeliveryChallanSchema = new Schema({
    challanID: {
        type: Number,
        unique: true
    },
    refNo: {
        type: String,
        required: true
    },
    customerID: {
        type: Number,
        required: true
    },
    challanDate: {
        type: Date,
        required: true
    },
    challanType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    items: {
        type: [AddedItem],
        required: true
    }
});

//Generate Challan ID
DeliveryChallanSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            let total = await DeliveryChallan.find().sort({ challanID: -1 }).limit(1);
            this.challanID = total.length === 0 ? 1 : Number(total[0].challanID) + 1;
        }
        next()
    } catch (error) {
        next(error)
    }
})

const DeliveryChallan = mongoose.model("deliverychallan", DeliveryChallanSchema);
module.exports = DeliveryChallan;
