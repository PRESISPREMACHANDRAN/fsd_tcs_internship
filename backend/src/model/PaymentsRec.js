const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentRecSchema = new Schema({
    paymentRecID: {
        type: Number,
        unique: true
    },
    paymentRecDate: {
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
    amount: {
        type: Number,
        required: true
    },
    bankCharges: {
        type: Number,
    },
    modeOfPayment: {
        type: String,
        required: true
    },
    notes: {
        type: String
    }
});

//Generate Payment Rec. ID
PaymentRecSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            let total = await PaymentRec.find().sort({ paymentRecID: -1 }).limit(1);
            this.paymentRecID = total.length === 0 ? 1 : Number(total[0].paymentRecID) + 1;
        }
        next()
    } catch (error) {
        next(error)
    }
})

const PaymentRec = mongoose.model("paymentreceipt", PaymentRecSchema);
module.exports = PaymentRec;