const PaymentRec = require("../model/PaymentsRec");
const Invoices = require("../model/Invoice");
const { getInvoiceTotal } = require("./invoiceController");

//Insert Payment Received
const insertPaymentReceived = (req, res) => {
    try {
        var item = {
            paymentRecDate: req.body.paymentRecDate,
            customerID: req.body.customerID,
            invoiceID: req.body.invoiceID,
            amount: req.body.amount,
            bankCharges: req.body.bankCharges,
            modeOfPayment: req.body.modeOfPayment,
            notes: req.body.notes
        };

        if (item.customerID !== "" && item.customerID !== undefined) {
            const paymentRec = new PaymentRec(item);
            paymentRec.save()
                .then(() => {
                    let total = getInvoiceTotal(item.invoiceID);
                    let status = "";
                    if (total > Number(item.amount))
                        status = "Partially Paid";
                    else
                        status = "Paid";
                    Invoices.updateOne({
                        invoiceID: Number(item.invoiceID)
                    }, {
                        status: status
                    }).then("Done").catch((err) => console.log(err));
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

//Get Payment Received for a period customerwise
const getPayRec4Period = async (req, res) => {
    try {
        let fromDate = new Date(req.query.fromDate);
        let toDate = new Date(req.query.toDate);
        let customerID = req.query.id;
               
        toDate.setDate(toDate.getDate() + 1);

        const filter1 = {
            paymentRecDate: {
                $gte: fromDate,
                $lt: toDate
            },
        };
        const filter2 = {
            "customerID": Number(customerID)
        }
        const lookupQ = {
            from: "customers",
            localField: "customerID",
            foreignField: "customerID",
            as: "custDetails"
        };
        let paymentRec = "";
        if (customerID && customerID !== undefined)
            paymentRec = await PaymentRec
                .aggregate()
                .match(filter1)
                .lookup(lookupQ)
                .match(filter2);
        else
            paymentRec = await PaymentRec
            .aggregate()
            .match(filter1)
            .lookup(lookupQ)
            
        if (paymentRec.length > 0) {
            res.json(paymentRec);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }

    } catch (err) {
        console.log(err);
        if (!res.headersSent)
            res.json({ status: "Error", message: err.message });
    }
}

module.exports = {
    insertPaymentReceived,
    getPayRec4Period
}