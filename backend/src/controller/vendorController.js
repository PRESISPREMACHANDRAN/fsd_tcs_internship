const Vendor = require("../model/Vendor");

//Insert Vendor
const insertVendor = (req, res) => {
    try {
        var item = {
            companyName: req.body.companyName,
            goodsServices: req.body.goodsServices,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            addressLine3: req.body.addressLine3,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            country: req.body.country,
            emailID: req.body.emailID,
            contactNo1: req.body.contactNo1,
            contactNo2: req.body.contactNo2,
            website: req.body.website,
            pocName: req.body.pocName,
            pocEmail: req.body.pocEmail,
            pocContactNo: req.body.pocContactNo
        }
        if (item.companyName !== "" && item.companyName !== undefined) {
            const vendor = new Vendor(item);
            vendor.save()
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

//Update Vendor
const updateVendor = (req, res) => {
    try {
        const vendorId = req.params.id;
        var updateItem = {
            companyName: req.body.companyName,
            goodsServices: req.body.goodsServices,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            addressLine3: req.body.addressLine3,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            country: req.body.country,
            emailID: req.body.emailID,
            contactNo1: req.body.contactNo1,
            contactNo2: req.body.contactNo2,
            website: req.body.website,
            pocName: req.body.pocName,
            pocEmail: req.body.pocEmail,
            pocContactNo: req.body.pocContactNo
        };
        if (updateItem.companyName !== "" && updateItem.companyName !== undefined && vendorId !== "") {
            Vendor.findOneAndUpdate({ vendorID: vendorId }, updateItem, null)
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

//Get Customer Details
const getVendor = async (req, res) => {
    try {
        let vendorID = req.params.id;
        let filter = {
            vendorID: vendorID
        };
        let projection = {
            _id: 0,
            vendorID: "$vendorID",
            goodsServices: "$goodsServices",
            companyName: "$companyName",
            pocName: "$pocName",
            addressLine1: "$addressLine1",
            addressLine2: "$addressLine2",
            addressLine3: "$addressLine3",
            city: "$city",
            state: "$state",
            pincode: "$pincode",
            country: "$country",
            emailID: "$emailID",
            pocEmail: "$pocEmail",
            contactNo1: "$contactNo1",
            contactNo2: "$contactNo2",
            pocContactNo: "$pocContactNo",
            website: "$website"
        };
        if (vendorID === "A")
            filter = {};
        let vendor = await Vendor.find(filter, projection);
        if (vendor.length > 0) {
            res.json(vendor);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

module.exports = {
    insertVendor,
    updateVendor,
    getVendor
}