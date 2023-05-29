const mongoose = require('mongoose');
const AddedItem = require('./AddedItem');
const Schema = mongoose.Schema;

const PurchaseOrderSchema = new Schema({
    purchaseOrderID: {
        type: Number,
        unique: true
    },
    vendorID: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        required: true
    },
    expectedDate: {
        type: Date,
        required: true
    },
    refNo: {
        type:String,
    },
    items: {
        type: [AddedItem],
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

//Generate Purchase Order ID
PurchaseOrderSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            let total = await PurchaseOrder.find().sort({ purchaseOrderID: -1 }).limit(1);
            this.purchaseOrderID = total.length === 0 ? 1 : Number(total[0].purchaseOrderID) + 1;
        }
        next()
    } catch (error) {
        next(error)
    }
})

const PurchaseOrder = mongoose.model("purchaseorder", PurchaseOrderSchema);
module.exports = PurchaseOrder;