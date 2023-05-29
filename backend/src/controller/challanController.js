const DeliveryChallan = require("../model/DeliveryChallan");

//Insert Delivery Challan
const insertDeliveryChallan = (req, res) => {
    try {
        var item = {
            refNo: req.body.refNo,
            customerID: req.body.customerID,
            challanDate: req.body.challanDate,
            challanType: req.body.challanType,
            status: req.body.status,
            items: req.body.items
        }
        if (item.customerID !== "" && item.customerID !== undefined) {
            const challan = new DeliveryChallan(item);
            challan.save()
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

//Update Delivery Challan
const updateDeliveryChallan = (req, res) => {
    try {
        const challanID = req.params.id;
        var updateItem = {
            refNo: req.body.refNo,
            customerID: req.body.customerID,
            challanDate: req.body.challanDate,
            challanType: req.body.challanType,
            status: req.body.status,
            items: req.body.items
        };
        if (updateItem.customerID !== "" && updateItem.customerID !== undefined && challanID !== "") {
            DeliveryChallan.findOneAndUpdate({ challanID: challanID }, updateItem, null)
                .then(res.json({ status: "Success" }))
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
};

//Get Delivery Challan
const getDeliveryChallan = async (req, res) => {
    try {
        let challanID = req.params.id;
        let challan = "";
        const lookupQ = {
            from: "customers",
            localField: "customerID",
            foreignField: "customerID",
            as: "custDetails"
        };
        
        if (challanID === "A") {
            challan = await DeliveryChallan
                .aggregate()
                .lookup(lookupQ)
                .sort({ challanDate: -1 });
        } else {
            challan = await DeliveryChallan
                .aggregate()
                .match({ challanID: Number(challanID) })
                .lookup(lookupQ)
                .sort({ challanDate: -1 });
        }
        if (challan.length > 0) {
            res.json(challan);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
};


module.exports = {
    insertDeliveryChallan,
    updateDeliveryChallan,
    getDeliveryChallan
};