const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BillPaymentSchema = new Schema({
    billPaymentID: {
        type: Number,
        unique: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    vendorID: {
        type: Number,
        required: true
    },
    billID: {
        type: Number,
        required: true
    },
    refNo: {
        type:String
    },
    amount: {
        type: Number,
        required: true
    },
    otherCharges: {
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

//Generate Bill Payment ID
BillPaymentSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            let total = await BillPayment.find().sort({ billPaymentID: -1 }).limit(1);
            this.billPaymentID = total.length === 0 ? 1 : Number(total[0].billPaymentID) + 1;
        }
        next()
    } catch (error) {
        next(error)
    }
})

const BillPayment = mongoose.model("billpayment", BillPaymentSchema);
module.exports = BillPayment;