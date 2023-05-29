const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvAdjSchema = new Schema({
    adjID: {
        type: Number,
        unique: true
    },
    refNo: {
        type: String,
        required: true
    },
    adjMode: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    adjDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    itemID: {
        type: Number,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    }
});

//Generate Adj ID
InvAdjSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            let total = await InvAdj.find().sort({ adjID: -1 }).limit(1);
            this.adjID = total.length === 0 ? 1 : Number(total[0].adjID) + 1;
        }
        next()
    } catch (error) {
        next(error)
    }
})

const InvAdj = mongoose.model("inventoryadj", InvAdjSchema);
module.exports = InvAdj;