const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddedItem = require('./AddedItem');

const VendorCreditNoteSchema = new Schema({
    creditNoteID: {
        type: Number,
        unique: true
    },
    creditNoteDate: {
        type: Date,
        required: true
    },
    vendorID: {
        type: Number,
        required: true
    },
    refNo: {
        type: String,
        required: true
    },
    items: {
        type: [AddedItem],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    discount: {
        type: Number
    },
    otherCharges: {
        type: Number
    },
    status: {
        type: String,
        required: true
    }
});

//Generate Credit Note ID
VendorCreditNoteSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            let total = await VendorCreditNotes.find().sort({ creditNoteID: -1 }).limit(1);
            this.creditNoteID = total.length === 0 ? 1 : Number(total[0].creditNoteID) + 1;
        }
        next()
    } catch (error) {
        next(error)
    }
})

const VendorCreditNotes = mongoose.model("vendorcreditnote", VendorCreditNoteSchema);
module.exports = VendorCreditNotes;