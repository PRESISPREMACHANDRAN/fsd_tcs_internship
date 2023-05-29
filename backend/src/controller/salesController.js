const convertToPdf = require("../helpers/htmltopdf");
const SalesOrder = require("../model/SalesOrder");
const salesOrderForm = require("../reports/salesOrder");

//Insert Sales Order
const insertSalesOrder = (req, res) => {
    try {
        var item = {
            customerID: req.body.customerID,
            orderDate: req.body.orderDate,
            items: req.body.items,
            status: req.body.status
        }
        if (item.customerID !== "" && item.customerID !== undefined) {
            const salesOrder = new SalesOrder(item);
            salesOrder.save()
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

//Update Sales Order
const updateSalesOrder = async (req, res) => {
    try {
        const sID = req.params.id;
        let status = await SalesOrder.findOne({ salesOrderID: sID });
        
        var updateItem = {
            status: req.body.status
        };
        if (status.status === "Draft") {
            var updateItem = {
                customerID: req.body.customerID,
                orderDate: req.body.orderDate,
                items: req.body.items,
                status: req.body.status
            };
        } else {
            if (req.body.status === "Draft")
                return res.json({ status: "Error", message: "Cannot be updated to draft." });
        }
        if (sID !== "" && sID !== undefined) {
            SalesOrder.findOneAndUpdate({ salesOrderID: sID }, updateItem, null)
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

//Get Sales Orders
const getSalesOrder = async (req, res) => {
    try {
        let OrderID = req.params.id;
        let salesOrder = "";
        const lookupQ = {
            from: "customers",
            localField: "customerID",
            foreignField: "customerID",
            as: "custDetails"
        };
        
        if (OrderID === "A") {
            salesOrder = await SalesOrder
                .aggregate()
                .lookup(lookupQ)
                .sort({ orderDate: -1 });
        }else {
            salesOrder = await SalesOrder
                .aggregate()
                .match({salesOrderID: Number(OrderID)})
                .lookup(lookupQ)
                .sort({ orderDate: -1 });
        }
        
        if (salesOrder.length > 0) {
            res.json(salesOrder);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        console.log(error);
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

//Get Sales Orders for a period itemwise, brandwise
const getSalesOrder4Period = async (req, res) => {
    try {
        let fromDate = new Date(req.query.fromDate);
        let toDate = new Date(req.query.toDate);
        let item = req.query.item;
               
        toDate.setDate(toDate.getDate() + 1);

        const filter1 = {
            orderDate: {
                $gte: fromDate,
                $lt: toDate
            },
        };
        const filter2 = {
            "items.itemID": Number(item)
        }
        const lookupQ = {
            from: "customers",
            localField: "customerID",
            foreignField: "customerID",
            as: "custDetails"
        };
        let salesOrder = "";
        if (item && item !== undefined)
            salesOrder = await SalesOrder
                .aggregate()
                .match(filter1)
                .lookup(lookupQ)
                .unwind({
                    path: "$items",
                    includeArrayIndex: 'string',
                    preserveNullAndEmptyArrays: true
                })
                .match(filter2);
        else
            salesOrder = await SalesOrder
            .aggregate()
            .match(filter1)
            .lookup(lookupQ)
            .unwind({
                path: "$items",
                includeArrayIndex: 'string',
                preserveNullAndEmptyArrays: true
            })
        if (salesOrder.length > 0) {
            res.json(salesOrder);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }

    } catch (err) {
        console.log(err);
        if (!res.headersSent)
            res.json({ status: "Error", message: err.message });
    }
}

//Get sales order form 
const getSalesOrderForm = async (req, res) => {
    try {
        let OrderID = req.params.id;
        const lookupQ = {
            from: "customers",
            localField: "customerID",
            foreignField: "customerID",
            as: "custDetails"
        };
        let salesOrder = await SalesOrder
            .aggregate()
            .match({ salesOrderID: Number(OrderID) })
            .lookup(lookupQ)
            .sort({ orderDate: -1 });
        
        if (salesOrder.length > 0) {
            const template = salesOrderForm(salesOrder[0]);
            convertToPdf(template, res);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        console.log(error);
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}


module.exports = {
    insertSalesOrder,
    updateSalesOrder,
    getSalesOrder,
    getSalesOrder4Period,
    getSalesOrderForm
};
