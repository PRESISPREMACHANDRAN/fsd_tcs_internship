const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    itemID: {
        type: Number,
        unique: true
    },
    groupID: {
        type: Number,
        required: true
    },
    groupName: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    dimensions: {
        type: String
    },
    weight: {
        type: String
    },
    manufacturer: {
        type: String,
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    costPrice: {
        type: Number,
        required: true
    },
    descr: {
        type: String,
        required: true
    },
    openingStock: {
        type: Number,
        required: true
    },
    reorderPoint: {
        type: Number,
        required: true
    },
    prefVendor: {
        type: String,
    },
    itemImg: {
        type: String,
    }
});

//Generate Group ID
ItemSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            let total = await Item.find().sort({ itemID: -1 }).limit(1);
            this.itemID = total.length === 0 ? 1 : Number(total[0].itemID) + 1;
        }
        next()
    } catch (error) {
        next(error)
    }
})

const Item = mongoose.model("item", ItemSchema);
module.exports = Item;