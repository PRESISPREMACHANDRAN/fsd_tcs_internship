const ItemGroup = require("../model/ItemGroups");

//Insert Item Group
const insertItemGroup = (req, res) => {
    try {
        var item = {
            groupName: req.body.groupName,
            tax: req.body.tax
        }
        if (item.groupName !== "" && item.groupName !== undefined) {
            const itemGrp = new ItemGroup(item);
            itemGrp.save()
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

//Update item group
const updateItemGroup = (req, res) => {
    try {
        let groupID = req.params.id;
       
        var updateItem = {
            groupName: req.body.groupName,
            tax: req.body.tax
        };
       
        if (groupID !== undefined && groupID !== "") {
            ItemGroup.findOneAndUpdate({ groupID: groupID }, updateItem, null)
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

//Get Item Groups
const getItemGroups = async (req, res) => {
    try {
        let projection = {
            _id: 0,
            "Group Name": "$groupName",
            "ID": "$groupID",
            "tax": "$tax"
        };
        let groupID = req.params.id;
        let filter = { groupID: groupID };
        if (groupID === "A")
            filter = {}
        let itemGrp = await ItemGroup.find(filter, projection);
        if (itemGrp.length > 0) {
            res.json(itemGrp);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

module.exports = {
    insertItemGroup,
    getItemGroups,
    updateItemGroup
};