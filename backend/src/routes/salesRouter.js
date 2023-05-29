const express = require("express");
const {
    insertCustomer,
    updateCustomer,
    getCustomer
} = require("../controller/customerController");
const {
    insertSalesOrder,
    updateSalesOrder,
    getSalesOrder,
    getSalesOrder4Period,
    getSalesOrderForm
} = require("../controller/salesController");
const {
    insertPackage,
    updatePackage,
    getPackage
} = require("../controller/packageController");

const auth = require("../helpers/auth");
const {
    insertDeliveryChallan,
    updateDeliveryChallan,
    getDeliveryChallan
} = require("../controller/challanController");
const {
    insertInvoice,
    updateInvoiceStatus,
    getInvoice,
    getInvoiceForm
} = require("../controller/invoiceController");
const {
    insertPaymentReceived,
    getPayRec4Period
} = require("../controller/paymentRecController");
const {
    insertSalesReturn,
    getSalesReturn,
    updateSalesReturnStatus
} = require("../controller/salesReturnController");
const {
    insertCreditNote,
    updateCreditNote,
    getCreditNote
} = require("../controller/creditNoteController");

const salesRouter = express.Router();

//Customers
salesRouter.post("/customer", auth, (req, res) => insertCustomer(req, res));
salesRouter.put("/customer/:id/update", auth, (req, res) => updateCustomer(req, res));
salesRouter.get("/customer/:id", auth, (req, res) => getCustomer(req, res));

//Sales Order
salesRouter.post("/sales-order", auth, (req, res) => insertSalesOrder(req, res));
salesRouter.put("/sales-order/:id/update", auth, (req, res) => updateSalesOrder(req, res));
salesRouter.get("/sales-order/:id", auth, (req, res) => getSalesOrder(req, res));
salesRouter.get("/sales-order", auth, (req, res) => getSalesOrder4Period(req, res));
salesRouter.get("/so-form/:id", auth, (req, res) => getSalesOrderForm(req, res));

//Package
salesRouter.post("/package", auth, (req, res) => insertPackage(req, res));
salesRouter.put("/package/:id/update", auth, (req, res) => updatePackage(req, res));
salesRouter.get("/package/:id", auth, (req, res) => getPackage(req, res));

//Delivery Challan
salesRouter.post("/challan", auth, (req, res) => insertDeliveryChallan(req, res));
salesRouter.put("/challan/:id/update", auth, (req, res) => updateDeliveryChallan(req, res));
salesRouter.get("/challan/:id", auth, (req, res) => getDeliveryChallan(req, res));

//Invoice
salesRouter.post("/invoice", auth, (req, res) => insertInvoice(req, res));
salesRouter.put("/invoice/:id/update", auth, (req, res) => updateInvoiceStatus(req, res));
salesRouter.get("/invoice/:id", auth, (req, res) => getInvoice(req, res));
salesRouter.get("/view-invoice/:id", auth, (req, res) => getInvoiceForm(req, res));

//Payments Received
salesRouter.post("/payments-rec", auth, (req, res) => insertPaymentReceived(req, res));
salesRouter.get("/payments-rec", auth, (req, res) => getPayRec4Period(req, res));

//Sales Returns
salesRouter.post("/sales-return", auth, (req, res) => insertSalesReturn(req, res));
salesRouter.put("/sales-return/:id/update", auth, (req, res) => updateSalesReturnStatus(req, res));
salesRouter.get("/sales-return/:id", auth, (req, res) => getSalesReturn(req, res));

//Credit Note
salesRouter.post("/credit-note", auth, (req, res) => insertCreditNote(req, res));
salesRouter.put("/credit-note/:id/update", auth, (req, res) => updateCreditNote(req, res));
salesRouter.get("/credit-note/:id", auth, (req, res) => getCreditNote(req, res));

module.exports = salesRouter;