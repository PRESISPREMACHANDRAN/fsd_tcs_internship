const VendorCreditNotes = require("../model/VendorCreditNote");

//Insert vendor credit note
const insertVendorCreditNote = (req, res) => {
    try {
        var item = {
            creditNoteDate: req.body.creditNoteDate,
            vendorID: req.body.vendorID,
            refNo: req.body.refNo,
            amount: req.body.amount,
            otherCharges: req.body.otherCharges,
            discount: req.body.discount,
            items: req.body.items,
            status: "Draft"
        }
        if (item.vendorID !== "" && item.vendorID !== undefined) {
            const creditNote = new VendorCreditNotes(item);
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

//Update vendor credit note
const updateVendorCreditNote = async (req, res) => {
    try {
        const creditNoteID = Number(req.params.id);
        let status = await VendorCreditNotes.findOne({ creditNoteID: creditNoteID });
        
        var updateItem = {
            status: req.body.status
        };
        if (status.status === "Draft") {
            updateItem = {
                creditNoteDate: req.body.creditNoteDate,
                vendorID: req.body.vendorID,
                refNo: req.body.refNo,
                amount: req.body.amount,
                otherCharges: req.body.otherCharges,
                discount: req.body.discount,
                items: req.body.items,
                status: req.body.status
            }
        }  else {
            if (req.body.status === "Draft")
                return res.json({ status: "Error", message: "Cannot be updated to draft." });
        }
        if (!isNaN(creditNoteID) && creditNoteID !== undefined) {
            VendorCreditNotes.updateOne({creditNoteID: creditNoteID }, updateItem, null)
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

//Get vendor credit note details
const getVendorCreditNote = async (req, res) => {
    try {
        let creditNoteID = req.params.id;
        let creditNote = "";
        const lookupQ = {
            from: "vendors",
            localField: "vendorID",
            foreignField: "vendorID",
            as: "vendorDetails"
        };
        
        if (creditNoteID === "A") {
            creditNote = await VendorCreditNotes
                .aggregate()
                .lookup(lookupQ)
                .sort({ creditNoteDate: -1 });
        } else {
            creditNote = await VendorCreditNotes
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
    insertVendorCreditNote,
    updateVendorCreditNote,
    getVendorCreditNote
}
