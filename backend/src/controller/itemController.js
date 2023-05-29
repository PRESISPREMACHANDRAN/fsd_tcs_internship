const Items = require("../model/Items");
const { getItemStock } = require("./dashboardController");

//Insert Item Group
const insertItem = (req, res) => {
    try {
        var item = {
            groupID: req.body.groupID,
            groupName: req.body.groupName,
            itemName: req.body.itemName,
            unit: req.body.unit,
            dimensions: req.body.dimensions,
            weight: req.body.weight,
            manufacturer: req.body.manufacturer,
            brand: req.body.brand,
            sellingPrice: req.body.sellingPrice,
            costPrice: req.body.costPrice,
            descr: req.body.descr,
            openingStock: req.body.openingStock,
            reorderPoint: req.body.reorderPoint,
            prefVendor: req.body.prefVendor,
            itemImg: req.file.filename
        }
        
        if (item.groupName !== "" && item.itemName !== "" && item.itemName !== undefined) {
            const items = new Items(item);
            items.save()
                .then(() => {
                    res.json({ status: "Success" });
                })
                .catch((er) => {
                    console.log(er);
                    if (!res.headersSent)
                        res.sendStatus(500).json({ status: "Error" });
                });
        } else {
            res.json({ status: "Error", message: "Invalid inputs" });
        }
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
};

//Update item costs, reorder levels, pref vendor, description
const updateItem = (req, res) => {
    try {
        const itemID = req.params.id;
       
        var updateItem = {
            sellingPrice: req.body.sellingPrice,
            costPrice: req.body.costPrice,
            reorderPoint: req.body.reorderPoint,
            prefVendor: req.body.prefVendor,
            descr: req.body.descr
        };
       
        if (itemID !== undefined && itemID !== "") {
            Items.findOneAndUpdate({ itemID: itemID }, updateItem, null)
                .then(res.json({status: "Success"}))
                .catch((er) => {
                    if (!res.headersSent)
                        res.sendStatus(500).json({ status: "Error" });
                });
        } else {
            res.json({ status: "Error", message: "Invalid inputs" });
        }
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

//Get details of a specific item
const getItem =  async (req, res) => {
    try {
        let ID = req.params.id;
        let projection = {
            _id: 0,
        };
        let item = await Items.find({itemID: ID}, projection);
        if (item.length > 0) {
            res.json(item);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

//Get details of all items of a specific group
const getAllItems =  async (req, res) => {
    try {
        let ID = req.params.id;
        let projection = {
            _id: 0,
            itemID: "$itemID",
            itemName: "$itemName",
            brand: "$brand",
            sellingPrice: "$sellingPrice",
            costPrice: "$costPrice",
            descr: "$descr",
            unit: "$unit",
            dimensions: "$dimensions",
            weight: "$weight",
            manufacturer: "$manufacturer",
            openingStock: "$openingStock",
            reorderPoint: "$reorderPoint",
            prefVendor: "$prefVendor",
            itemImg: "$filename"
        };
        let filter = { groupID: ID };
        if (ID === "A")
            filter = {};
        let item = await Items.find(filter, projection);
        if (item.length > 0) {
            res.json(item);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

//Get item stock
const getItemStockOnHand =  async (req, res) => {
    try {
        let ID = Number(req.params.id);
        let stock = await getItemStock(ID);

        res.json({ stockOnHand: stock });
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}



module.exports = {
    insertItem,
    updateItem,
    getItem,
    getAllItems,
    getItemStockOnHand
};