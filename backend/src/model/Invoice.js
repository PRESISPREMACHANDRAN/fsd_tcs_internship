const mongoose = require('mongoose');
const AddedItem = require('./AddedItem');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
    invoiceID: {
        type: Number,
        unique: true
    },
    customerID: {
        type: Number,
        required: true
    },
    salesOrderID: {
        type: Number,
    },
    invoiceDate: {
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
        type: Number,
    },
    status: {
        type: String,
        required: true
    }
});

//Generate Invoice ID
InvoiceSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            let total = await Invoices.find().sort({ invoiceID: -1 }).limit(1);
            this.invoiceID = total.length === 0 ? 1 : Number(total[0].invoiceID) + 1;
        }
        next()
    } catch (error) {
        next(error)
    }
})

const Invoices = mongoose.model("invoice", InvoiceSchema);
module.exports = Invoices;