const BillPayment = require("../model/BillsPayment");
const Bills = require("../model/BillsPayable");
const CreditNote = require("../model/CreditNote");
const Customers = require("../model/Customer");
const DeliveryChallan = require("../model/DeliveryChallan");
const Invoices = require("../model/Invoice");
const ItemGroups = require("../model/ItemGroups");
const InvAdjustments = require("../model/InventoryAdjustments");
const Items = require("../model/Items");
const Packages = require("../model/Package");
const PaymentsRec = require("../model/PaymentsRec");
const PurchaseOrder = require("../model/PurchaseOrder");
const SalesOrder = require("../model/SalesOrder");
const SalesReturn = require("../model/SalesReturn");
const Vendors = require("../model/Vendor");
const VendorCreditNote = require("../model/VendorCreditNote");


//Get statistics for dashboard
const getSummary4DashBoard = async (req, res) => {
    try {
        let noOfItems = await Items.count();
        let noOfItemGroups = await ItemGroups.count();
        let noOfCustomers = await Customers.count();
        let noOfVendors = await Vendors.count();

        const dashBoard = {
            items: noOfItems,
            itemGroups: noOfItemGroups,
            customers: noOfCustomers,
            vendors: noOfVendors
        }

        res.json(dashBoard);
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
};

const getSummaryMonthly = async (req, res, Collection, field) => {
    try {
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        const summary = [];
        const status = await Collection
            .aggregate()
            .redact({
                "$cond": [{
                    "$and":[
                        { "$eq": [{ "$year": field }, year] },
                        { "$eq": [{ "$month": field }, month] }
                    ]},
                    "$$KEEP",
                    "$$PRUNE"
                ]
            })
            .group({
                _id: "$status",
                count: { $sum: 1 }
            });
       
        status.forEach((item) => {
            let objStatus = {
                Status: item._id,
                Count: item.count
            }
            summary.push(objStatus)
        })
        res.json(summary);
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

//Get Sales Order Summary Monthly
const getSalesOrderSummary = async (req, res) => {
    getSummaryMonthly(req, res, SalesOrder, "$orderDate");
};

//Get Purchase Order Summary Monthly
const getPurchaseOrderSummary = async (req, res) => {
    getSummaryMonthly(req, res, PurchaseOrder, "$orderDate");
};

//Get Sales Returns Summary Monthly
const getSalesReturnSummary = async (req, res) => {
    getSummaryMonthly(req, res, SalesReturn, "$receivedDate");
}

//Get Packages Summary Monthly
const getPackagesSummary = async (req, res) => {
    getSummaryMonthly(req, res, Packages, "$packageDate");
}

//Get Delivery Challan Summary Monthly
const getDeliveryChallanSummary = async (req, res) => {
    getSummaryMonthly(req, res, DeliveryChallan, "$challanDate");
}

//Get Invoice Summary Monthly
const getInvoicesSummary = async (req, res) => {
    getSummaryMonthly(req, res, Invoices, "$invoiceDate");
}

//Get Bill Summary Monthly
const getBillSummary = async (req, res) => {
    getSummaryMonthly(req, res, Bills, "$billDate");
}

//Get Customer Summary
const getCustomerSummary = async (req, res) => {
    try {
        let customerID = Number(req.params.id);

        let receivedPayments = await PaymentsRec.aggregate()
            .match({ customerID: customerID })
            .group({
                _id: "$customerID",
                amount: { $sum: "$amount" }
            });
        if (receivedPayments.length > 0)
            receivedPayments = Number(receivedPayments[0].amount).toFixed(2);
        else
            receivedPayments = "0.00";
        
        let credits = await CreditNote.aggregate()
            .match({ customerID: customerID, status: "Open" })
            .group({
                _id: "$customerID",
                amount: { $sum: "$amount" }
            });
        if (credits.length > 0)
            credits = Number(credits[0].amount).toFixed(2);
        else
            credits = "0.00";
        
        let salesOrders = await SalesOrder.find(
            {
                customerID: customerID,
                status: "Confirmed"
            }).count();

        let unPaidInvoices = await Invoices.find(
            {
                customerID: customerID,
                status: { $in: ["Sent", "Due", "Partially Paid"] }
            }).count();

        let unDeliveredPackages = await Packages.find(
            {
                customerID: customerID,
                status: { $in: ["Not Shipped", "Shipped"] }
            }).count();

        const customerSummary = {
            "Rec Payments": receivedPayments,
            "Credits": credits,
            "Sales orders": salesOrders,
            "Unpaid Invoices": unPaidInvoices,
            "Undelivered Packages": unDeliveredPackages
        }
       
        res.json(customerSummary);
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
};

//Get Vendor Summary
const getVendorSummary = async (req, res) => {
    try {
        let vendorID = Number(req.params.id);

        let payments = await BillPayment.aggregate()
            .match({ vendorID: vendorID })
            .group({
                _id: "$vendorID",
                amount: {
                    $sum: { $add: ["$amount", "$otherCharges"] }
                }
            });
        if (payments.length > 0)
            payments = Number(payments[0].amount).toFixed(2);
        else
            payments = "0.00";
        
        let credits = await CreditNote.aggregate()
            .match({ vendorID: vendorID }, { status: "Open" })
            .group({
                _id: "$vendorID",
                amount: {
                    $sum: {
                        $subtract: [{ $add: ["$amount", "$otherCharges"] }, "$discount"]
                    }
                }
            });
        if (credits.length > 0)
            credits = Number(credits[0].amount).toFixed(2);
        else
            credits = "0.00";
        
        let purchaseOrders = await PurchaseOrder.find(
            {
                vendorID: vendorID,
                status: "Issued"
            }).count();

        let unPaidBills = await Bills.find(
            {
                vendorID: vendorID,
                status: { $in: ["Open", "Due", "Partially Paid"] }
            }).count();
       
        const vendorSummary = {
            "Bill Payments": payments,
            "Credits": credits,
            "Purchase Orders": purchaseOrders,
            "Unpaid Bills": unPaidBills
        }
       
        res.json(vendorSummary);
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
};

//Get item summary
const getItemSummary = async (req, res) => {
    try {
        let itemID = Number(req.params.id);
        let itemStock = await getItemStock(itemID);
        let itemSales = await getItemSales(itemID);
        
        const itemSummary = {
            "Stock in hand": itemStock,
            "Sales": itemSales
        }

        res.json(itemSummary);
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

//Get Item Stock (Opening Stock + Total Adjustment + Total Purchase - Total Sales)
const getItemStock = async (itemID, report=false) => {
    let itemStock = 0;
    let openingStock = await Items.findOne({ itemID: itemID });
    itemStock += Number(openingStock.openingStock);
   
    let invAdj = await getInventoryAdjustment(itemID);
    itemStock += invAdj;
   
    let itemSales = await getItemSales(itemID);
    itemStock -= itemSales;
    
    let itemPurchase = await getItemPurchase(itemID);
    itemStock += itemPurchase;
   
    if (report)
        return {
            itemStock: itemStock,
            invAdj: invAdj,
            itemSales: itemSales,
            itemPurchase: itemPurchase
        }
    else
        return itemStock;
}

//Get Inventory Adjustment
const getInventoryAdjustment = async (itemID) => {
    let invAdj = 0;
    let inventoryAdj = await InvAdjustments.aggregate()
        .match({ itemID: itemID })
        .group({
            _id: "$adjMode", quantity: { $sum: "$quantity" }
        });
    if (inventoryAdj.length > 0) {
        inventoryAdj.forEach((item) => {
            if (item._id === "I")
                invAdj += Number(item.quantity);
            else
                invAdj -= Number(item.quantity);
        })
    }
    return invAdj;
}

//Get item sales (Sales - Sales Returns)
const getItemSales = async (itemID) => {
    let itemSales = 0;
    let invoice = await Invoices.aggregate()
        .match({ status: {$nin: ["Draft", "Void"] } })
        .unwind({
            path: "$items",
            includeArrayIndex: 'string',
            preserveNullAndEmptyArrays: true
        })
        .match({ "items.itemID": itemID })
        .group({
            _id: "$items.itemID", quantity: { $sum: "$items.quantity" }
        });
    if (invoice.length > 0)
        itemSales = Number(invoice[0].quantity);
    
    let salesReturns = await SalesReturn.aggregate()
        .match({ status: "Accepted" })
        .unwind({
            path: "$items",
            includeArrayIndex: 'string',
            preserveNullAndEmptyArrays: true
        })
        .match({ "items.itemID": itemID })
        .group({
            _id: "$items.itemID", quantity: { $sum: "$items.quantity" }
        });
    if (salesReturns.length > 0)
        itemSales -= Number(salesReturns[0].quantity);
    
    return itemSales;
};

//Get item purchase (Purchase - Purchase Returns)
const getItemPurchase = async (itemID) => {
    let itemPurchase = 0;
    let bills = await Bills.aggregate()
        .match({ status: { $nin: ["Draft", "Void"] } })
        .unwind({
            path: "$items",
            includeArrayIndex: 'string',
            preserveNullAndEmptyArrays: true
        })
        .match({ "items.itemID": itemID })
        .group({
            _id: "$items.itemID", quantity: { $sum: "$items.quantity" }
        });
    if (bills.length > 0)
        itemPurchase = Number(bills[0].quantity);
    
    let vendorCreditNote = await VendorCreditNote.aggregate()
        .match({ status: "Open" })
        .unwind({
            path: "$items",
            includeArrayIndex: 'string',
            preserveNullAndEmptyArrays: true
        })
        .match({ "items.itemID": itemID })
        .group({
            _id: "$items.itemID", quantity: { $sum: "$items.quantity" }
        });
    if (vendorCreditNote.length > 0)
        itemPurchase -= Number(vendorCreditNote[0].quantity);
    
    return itemPurchase;
}

//Get details for this month - Payments, Receipts, Inventory Adj
const getRecPayAdjMonthly = async (req, res) => {
    try {
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        const summary = [];

        //Inventory Adjustment
        let invAdj = await InvAdjustments.find({
            "$expr": {
                "$and": [
                    { "$eq": [{ "$year": "$adjDate" }, year] },
                    { "$eq": [{ "$month": "$adjDate" }, month] }
                ]
            }
        }).count();

        //Payment Received
        let recPayments = await PaymentsRec.aggregate()
            .redact({
                "$cond": [{
                    "$and": [
                        { "$eq": [{ "$year": "$paymentRecDate" }, year] },
                        { "$eq": [{ "$month": "$paymentRecDate" }, month] }
                    ]
                },
                    "$$KEEP",
                    "$$PRUNE"
                ]
            })
            .group({
                _id: null,
                amount: { "$sum": "$amount" }
            });
        
        //Bill Payments
        let billPayments = await BillPayment.aggregate()
            .redact({
                "$cond": [{
                    "$and": [
                        { "$eq": [{ "$year": "$paymentDate" }, year] },
                        { "$eq": [{ "$month": "$paymentDate" }, month] }
                    ]
                },
                    "$$KEEP",
                    "$$PRUNE"
                ]
            })
            .group({
                _id: null,
                amount: {
                    "$sum": { "$add": ["$amount", "$otherCharges"] }
                }
            });
       
        const recPayInvAdjSummary = {
            "...": "Total",
            "Inventory Adj": invAdj,
            "Payments Rec": recPayments.length > 0 ? recPayments[0].amount.toFixed(2) : "0.00",
            "Bill Payments": billPayments.length > 0 ? billPayments[0].amount.toFixed(2) : "0.00",
        };

        summary.push(recPayInvAdjSummary);
        res.json(summary);

    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

module.exports = {
    getSummary4DashBoard,
    getSalesOrderSummary,
    getPurchaseOrderSummary,
    getSalesReturnSummary,
    getDeliveryChallanSummary,
    getPackagesSummary,
    getBillSummary,
    getInvoicesSummary,
    getCustomerSummary,
    getVendorSummary,
    getItemSummary,
    getRecPayAdjMonthly,
    getItemStock
}