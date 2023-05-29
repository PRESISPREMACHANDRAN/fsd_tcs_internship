const BillPayment = require("../model/BillsPayment");

const Bills = require("../model/BillsPayable");
const { getBillTotal } = require("./billsController");

//Insert Payment Received
const insertBillPayment = (req, res) => {
    try {
        var item = {
            paymentDate: req.body.paymentDate,
            vendorID: req.body.vendorID,
            billID: req.body.billID,
            refNo: req.body.refNo,
            amount: req.body.amount,
            otherCharges: req.body.otherCharges,
            modeOfPayment: req.body.modeOfPayment,
            notes: req.body.notes
        };

        if (item.vendorID !== "" && item.vendorID !== undefined) {
            const billPayment = new BillPayment(item);
            billPayment.save()
                .then(() => {
                    let total = getBillTotal(item.billID);
                    let status = "";
                    if (total > Number(item.amount))
                        status = "Partially Paid";
                    else
                        status = "Paid";
                    Bills.updateOne({
                        billID: Number(item.billID)
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

//Get Payment for a period vendorwise
const getBillPayment4Period = async (req, res) => {
    try {
        let fromDate = new Date(req.query.fromDate);
        let toDate = new Date(req.query.toDate);
        let vendorID = req.query.id;
               
        toDate.setDate(toDate.getDate() + 1);

        const filter1 = {
            paymentDate: {
                $gte: fromDate,
                $lt: toDate
            },
        };
        const filter2 = {
            "vendorID": Number(vendorID)
        }
        const lookupQ = {
            from: "vendors",
            localField: "vendorID",
            foreignField: "vendorID",
            as: "vendorDetails"
        };
        let billPayment = "";
        if (vendorID && vendorID !== undefined)
            billPayment = await BillPayment
                .aggregate()
                .match(filter1)
                .lookup(lookupQ)
                .match(filter2);
        else
            billPayment = await BillPayment
            .aggregate()
            .match(filter1)
            .lookup(lookupQ)
            
        if (billPayment.length > 0) {
            res.json(billPayment);
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
    insertBillPayment,
    getBillPayment4Period
};