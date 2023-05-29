const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CreditNoteSchema = new Schema({
    creditNoteID: {
        type: Number,
        unique: true
    },
    creditNoteDate: {
        type: Date,
        required: true
    },
    customerID: {
        type: Number,
        required: true
    },
    salesReturnID: {
        type: Number,
        unique: true
    },
    invoiceID: {
        type: Number,
        required: true
    },
    refNo: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

//Generate Credit Note ID
CreditNoteSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            let total = await CreditNotes.find().sort({ creditNoteID: -1 }).limit(1);
            this.creditNoteID = total.length === 0 ? 1 : Number(total[0].creditNoteID) + 1;
        }
        next()
    } catch (error) {
        next(error)
    }
})

const CreditNotes = mongoose.model("creditnote", CreditNoteSchema);
module.exports = CreditNotes;