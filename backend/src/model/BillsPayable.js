const mongoose = require('mongoose');
const AddedItem = require('./AddedItem');
const Schema = mongoose.Schema;

const BillsPayableSchema = new Schema({
    billID: {
        type: Number,
        unique: true
    },
    vendorID: {
        type: Number,
        required: true
    },
    purchaseOrderID: {
        type: Number,
    },
    refNo: {
        type: String
    },
    billDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    items: {
        type: [AddedItem],
        required: true
    },
    otherCharges: {
        type: Number
    },
    discount: {
        type: Number
    },
    status: {
        type: String,
        required: true
    }
});

//Generate Bill ID
BillsPayableSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            let total = await Bills.find().sort({ billID: -1 }).limit(1);
            this.billID = total.length === 0 ? 1 : Number(total[0].billID) + 1;
        }
        next()
    } catch (error) {
        next(error)
    }
})

const Bills = mongoose.model("bill", BillsPayableSchema);
module.exports = Bills;