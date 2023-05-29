const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemGrpSchema = new Schema({
    groupID: {
        type: Number,
        unique: true
    },
    groupName: {
        type: String,
        required: true
    },
    tax: {
        type: Number,
        required: true
    }
});

//Generate Group ID
ItemGrpSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            let total = await ItemGroup.find().sort({ groupID: -1 }).limit(1);
            this.groupID = total.length === 0 ? 1 : Number(total[0].groupID) + 1;
        }
        next()
    } catch (error) {
        next(error)
    }
})

const ItemGroup = mongoose.model("itemgroup", ItemGrpSchema);
module.exports = ItemGroup;