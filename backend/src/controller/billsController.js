const Bills = require("../model/BillsPayable");

//Insert Bill
const insertBill = (req, res) => {
    try {
        var item = {
            purchaseOrderID: req.body.purchaseOrderID,
            vendorID: req.body.vendorID,
            refNo: req.body.refNo,
            billDate: req.body.billDate,
            dueDate: req.body.dueDate,
            otherCharges: req.body.otherCharges,
            discount: req.body.discount,
            status: req.body.status,
            items: req.body.items
        }
        if (item.vendorID !== "" && item.vendorID !== undefined) {
            const bill = new Bills(item);
            bill.save()
                .then(() => {
                    res.json({ status: "Success" })
                })
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

//Update Bill Status
const updateBillStatus = (req, res) => {
    try {
        const billID = req.params.id;
        var updateItem = {
                status: req.body.status,
        };
        if (billID !== "" && billID !== undefined) {
            Bills.updateOne({ billID: Number(billID) }, updateItem, null)
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

//Get Bill Details
const getBill = async (req, res) => {
    try {
        let billID = req.params.id;
        let bill = "";
        const lookupQ = {
            from: "vendors",
            localField: "vendorID",
            foreignField: "vendorID",
            as: "vendorDetails"
        };
        
        if (billID === "A") {
            bill = await Bills
                .aggregate()
                .lookup(lookupQ)
                .sort({ billDate: -1 });
        } else {
            bill = await Bills
                .aggregate()
                .match({ billID: Number(billID) })
                .lookup(lookupQ)
        }
        if (bill.length > 0) {
            res.json(bill);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
};

//Calculate bill total
const getBillTotal = async (billID) => {
    try {
        let bill = await Bills
            .aggregate()
            .match({ billID: Number(billID) })
            .unwind({
                path: "$items",
                includeArrayIndex: 'string',
                preserveNullAndEmptyArrays: true
            })
            .group({
                _id: "$billID",
                total: { $sum: "$items.total" },
                otherCharges: { $first: "$otherCharges" },
                discount: { $first: "$discount" }
            });
        let grandTotal = Number(bill.total) +
            Number(bill.otherCharges) -
            Number(bill.discount);
        return grandTotal;
        
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    insertBill,
    updateBillStatus,
    getBill,
    getBillTotal
}