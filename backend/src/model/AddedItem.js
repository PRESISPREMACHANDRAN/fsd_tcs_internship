const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddedItem = new Schema({
    itemID: {
        type: Number,
        required: true
    },
    itemName: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    tax: {
        type: Number
    },
    quantity: {
        type: Number
    },
    total: {
        type: Number,
        required: true
    }
});

module.exports = AddedItem;