const SalesReturn = require("../model/SalesReturn");

//Insert Sales Return
const insertSalesReturn = (req, res) => {
    try {
        var item = {
            receivedDate: req.body.receivedDate,
            customerID: req.body.customerID,
            invoiceID: req.body.invoiceID,
            status: "Draft",
            items: req.body.items,
            reason: req.body.reason
        }
        if (item.customerID !== "" && item.customerID !== undefined) {
            const salesReturn = new SalesReturn(item);
            salesReturn.save()
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

//Update Sales Return Status
const updateSalesReturnStatus = (req, res) => {
    try {
        const salesReturnID = req.params.id;
        var updateItem = {
                status: req.body.status,
        };
        if (salesReturnID !== "" && salesReturnID !== undefined) {
            SalesReturn.updateOne({ salesReturnID: Number(salesReturnID) }, updateItem, null)
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

//Get Sales Return Details
const getSalesReturn = async (req, res) => {
    try {
        let salesReturnID = req.params.id;
        let salesReturn = "";
        const lookupQ = {
            from: "customers",
            localField: "customerID",
            foreignField: "customerID",
            as: "custDetails"
        };
        
        if (salesReturnID === "A") {
            salesReturn = await SalesReturn
                .aggregate()
                .lookup(lookupQ)
                .sort({ receivedDate: -1 });
        } else {
            salesReturn = await SalesReturn
                .aggregate()
                .match({ salesReturnID: Number(salesReturnID) })
                .lookup(lookupQ)
                .sort({ receivedDate: -1 });
        }
        if (salesReturn.length > 0) {
            res.json(salesReturn);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
};

module.exports = {
    insertSalesReturn,
    updateSalesReturnStatus,
    getSalesReturn
};