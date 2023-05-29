const mongoose = require('mongoose');
const AddedItem = require('./AddedItem');
const Schema = mongoose.Schema;

const SalesReturnSchema = new Schema({
    salesReturnID: {
        type: Number,
        unique: true
    },
    receivedDate: {
        type: Date,
        required: true
    },
    customerID: {
        type: Number,
        required: true
    },
    invoiceID: {
        type: Number,
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
    reason: {
        type: String,
        required: true
    }
});

//Generate Sales return ID
SalesReturnSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            let total = await SalesReturn.find().sort({ salesReturnID: -1 }).limit(1);
            this.salesReturnID = total.length === 0 ? 1 : Number(total[0].salesReturnID) + 1;
        }
        next()
    } catch (error) {
        next(error)
    }
})

const SalesReturn = mongoose.model("salesreturn", SalesReturnSchema);
module.exports = SalesReturn;