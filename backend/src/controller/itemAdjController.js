const convertJsonToExcel = require("../helpers/convertToExcel");
const InvAdj = require("../model/InventoryAdjustments");

//Insert inventory adjustment
const insertInvAdj = (req, res) => {
    try {
        var item = {
            refNo: req.body.refNo,
            adjMode: req.body.adjMode,
            quantity: req.body.quantity,
            adjDate: req.body.adjDate,
            reason: req.body.reason,
            description: req.body.description,
            itemID: req.body.itemID,
            itemName: req.body.itemName,
            unit: req.body.unit
        };
        if (item.itemID !== "" && item.adjMode !== "" && item.itemID !== undefined) {
            const invAdj = new InvAdj(item);
            invAdj.save()
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

const getInvAdjDatewise = async (req, res) => {
    try {
        let fromDate = new Date(req.query.fromDate);
        let toDate = new Date(req.query.toDate);
        toDate.setDate(toDate.getDate() + 1);
        let exportToExcel = req.query.exportToExcel;

        let filter = {
            adjDate: {
                $gte: fromDate,
                $lt: toDate
            }
        }
        let projection = {
            _id: 0,
            "Date": "$adjDate",
            "Ref No": "$refNo",
            "Adj Mode": "$adjMode",
            "Item ID": "$itemID",
            "Item": "$itemName",
            "Quantity": "$quantity",
            "Unit": "$unit",
            "Reason": "$reason",
            "Description": "$description",
        }
        let invAdj = await InvAdj.find(filter, projection);
        if (invAdj.length > 0) {
            if (exportToExcel === "Y") {
                convertJsonToExcel(invAdj, "Inventory Adjustment", res);
            } else {
                res.json(invAdj);
            }
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
    }catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

module.exports = {
    insertInvAdj,
    getInvAdjDatewise
}