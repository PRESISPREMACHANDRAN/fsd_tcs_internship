const CreditNotes = require("../model/CreditNote");

//Insert credit note
const insertCreditNote = (req, res) => {
    try {
        var item = {
            creditNoteDate: req.body.creditNoteDate,
            customerID: req.body.customerID,
            salesReturnID: req.body.salesReturnID,
            invoiceID: req.body.invoiceID,
            refNo: req.body.refNo,
            amount: req.body.amount,
            status: "Draft"
        }
        if (item.customerID !== "" && item.customerID !== undefined) {
            const creditNote = new CreditNotes(item);
            creditNote.save()
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

//Update Credit Note 
const updateCreditNote = async (req, res) => {
    try {
        const creditNoteID = Number(req.params.id);
        let status = await CreditNotes.findOne({ creditNoteID: creditNoteID });
        
        var updateItem = {
            status: req.body.status
        };
        if (status.status === "Draft") {
            updateItem = {
                creditNoteDate: req.body.creditNoteDate,
                customerID: req.body.customerID,
                salesReturnID: req.body.salesReturnID,
                invoiceID: req.body.invoiceID,
                refNo: req.body.refNo,
                amount: req.body.amount,
                status: req.body.status
            }
        }  else {
            if (req.body.status === "Draft")
                return res.json({ status: "Error", message: "Cannot be updated to draft." });
        }
        if (!isNaN(creditNoteID) && creditNoteID !== undefined) {
            CreditNotes.updateOne({creditNoteID: creditNoteID }, updateItem, null)
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

//Get Credit Note Details
const getCreditNote = async (req, res) => {
    try {
        let creditNoteID = req.params.id;
        let creditNote = "";
        const lookupQ = {
            from: "customers",
            localField: "customerID",
            foreignField: "customerID",
            as: "custDetails"
        };
        
        if (creditNoteID === "A") {
            creditNote = await CreditNotes
                .aggregate()
                .lookup(lookupQ)
                .sort({ creditNoteDate: -1 });
        } else {
            creditNote = await CreditNotes
                .aggregate()
                .match({ creditNoteID: Number(creditNoteID) })
                .lookup(lookupQ)
                .sort({ creditNoteDate: -1 });
        }
        if (creditNote.length > 0) {
            res.json(creditNote);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
};

module.exports = {
    insertCreditNote,
    updateCreditNote,
    getCreditNote
}