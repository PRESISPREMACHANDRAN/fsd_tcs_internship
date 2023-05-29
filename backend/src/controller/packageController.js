const Package = require("../model/Package");

//Insert Package
const insertPackage = (req, res) => {
    try {
        var item = {
            packageDate: req.body.packageDate,
            items: req.body.items,
            status: req.body.status,
            customerID: req.body.customerID,
            salesOrderID: req.body.salesOrderID
        }
        if (item.customerID !== "" && item.customerID !== undefined) {
            const package = new Package(item);
            package.save()
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

//Update Package
const updatePackage = async (req, res) => {
    try {
        const packageID = req.params.id;
        let status = await Package.findOne({ packageID: packageID });
        
        var updateItem = {
            status: req.body.status
        };
        if (status.status === "Not Shipped") {
            var updateItem = {
                packageDate: req.body.packageDate,
                items: req.body.items,
                status: req.body.status,
                customerID: req.body.customerID,
                salesOrderID: req.body.salesOrderID
            };
        } else {
            if (req.body.status === "Not Shipped")
                return res.json({ status: "Error", message: "Cannot be updated to not shipped." });
        }
        if (packageID !== undefined && packageID !== "") {
            Package.findOneAndUpdate({ packageID: packageID }, updateItem, null)
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

//Get Package details
const getPackage = async (req, res) => {
    try {
        let packageID = req.params.id;
        let packages = "";
        const lookupQ = {
            from: "customers",
            localField: "customerID",
            foreignField: "customerID",
            as: "custDetails"
        };
        
        if (packageID === "A") {
            packages = await Package
                .aggregate()
                .lookup(lookupQ)
                .sort({ packageDate: -1 });
        }else {
            packages = await Package
                .aggregate()
                .match({packageID: Number(packageID)})
                .lookup(lookupQ)
                .sort({ packageDate: -1 });
        }
        if (packages.length > 0) {
            res.json(packages);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

module.exports = {
    insertPackage,
    updatePackage,
    getPackage
}