const Invoices = require("../model/Invoice");
const SalesOrder = require("../model/SalesOrder");
const generateInvoice = require("../reports/invoice");
const convertToPdf = require("../helpers/htmltopdf");

//Insert Invoice
const insertInvoice = (req, res) => {
    try {
        var item = {
            salesOrderID: req.body.salesOrderID,
            customerID: req.body.customerID,
            invoiceDate: req.body.invoiceDate,
            dueDate: req.body.dueDate,
            otherCharges: req.body.otherCharges,
            status: req.body.status,
            items: req.body.items
        }
        if (item.customerID !== "" && item.customerID !== undefined) {
            const invoice = new Invoices(item);
            invoice.save()
                .then(() => {
                    if (Number(item.salesOrderID) !== 0) {
                        SalesOrder
                            .findOneAndUpdate({
                            "salesOrderID": Number(item.salesOrderID)
                        }, {
                            $set: { "status": "Closed" }
                            }, null)
                            .then({ status: "Success" });
                    }
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

//Update Invoice Status
const updateInvoiceStatus = async (req, res) => {
    try {
        const invoiceID = req.params.id;
        let status = await Invoices.findOne({ invoiceID: invoiceID });
        if (status.status !== "Draft" && req.body.status === "Draft")
            return res.json({ status: "Error", message: "Status cannot be updated to draft." });
        var updateItem = {
                status: req.body.status,
        };
        if (invoiceID !== "" && invoiceID !== undefined) {
            Invoices.updateOne({ invoiceID: Number(invoiceID) }, updateItem, null)
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

//Get Invoice Details
const getInvoice = async (req, res) => {
    try {
        let invoiceID = req.params.id;
        let invoice = "";
        const lookupQ = {
            from: "customers",
            localField: "customerID",
            foreignField: "customerID",
            as: "custDetails"
        };
        
        if (invoiceID === "A") {
            invoice = await Invoices
                .aggregate()
                .lookup(lookupQ)
                .sort({ invoiceDate: -1 });
        } else {
            invoice = await Invoices
                .aggregate()
                .match({ invoiceID: Number(invoiceID) })
                .lookup(lookupQ)
                .sort({ invoiceDate: -1 });
        }
        if (invoice.length > 0) {
            res.json(invoice);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
};

//Get invoice form 
const getInvoiceForm = async (req, res) => {
    try {
        let invoiceID = req.params.id;
        const lookupQ = {
            from: "customers",
            localField: "customerID",
            foreignField: "customerID",
            as: "custDetails"
        };
        let invoice = await Invoices
            .aggregate()
            .match({ invoiceID: Number(invoiceID) })
            .lookup(lookupQ);
        
        if (invoice.length > 0) {
            const template = generateInvoice(invoice[0]);
            convertToPdf(template, res);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        console.log(error);
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
};

//Calculate invoice total
const getInvoiceTotal = async (invoiceID) => {
    try {
        let invoice = await Invoices
            .aggregate()
            .match({ invoiceID: Number(invoiceID) })
            .unwind({
                path: "$items",
                includeArrayIndex: 'string',
                preserveNullAndEmptyArrays: true
            })
            .group({
                _id: "$invoiceID",
                total: { $sum: "$items.total" },
                otherCharges: { $first: "$otherCharges" }
            });
        let grandTotal = Number(invoice.total) + Number(invoice.otherCharges);
        return grandTotal;
        
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    insertInvoice,
    updateInvoiceStatus,
    getInvoice,
    getInvoiceForm,
    getInvoiceTotal
};