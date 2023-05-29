const express = require("express");
const auth = require("../helpers/auth");

const {
    insertVendor,
    updateVendor,
    getVendor
} = require("../controller/vendorController");
const {
    insertPurchaseOrder,
    updatePurchaseOrder,
    getPurchaseOrder,
    getPurchaseOrderForm,
    getPurchaseOrderVendorItemwise
} = require("../controller/purchaseController");
const {
    insertBill,
    updateBillStatus,
    getBill
} = require("../controller/billsController");
const {
    insertBillPayment,
    getBillPayment4Period
} = require("../controller/billPaymentController");
const {
    insertVendorCreditNote,
    updateVendorCreditNote,
    getVendorCreditNote
} = require("../controller/vendorCreditNoteController");

const purchaseRouter = express.Router();

//Vendors
purchaseRouter.post("/vendor", auth, (req, res) => insertVendor(req, res));
purchaseRouter.put("/vendor/:id/update", auth, (req, res) => updateVendor(req, res));
purchaseRouter.get("/vendor/:id", auth, (req, res) => getVendor(req, res));

//Purchase Order
purchaseRouter.post("/purchase-order", auth, (req, res) => insertPurchaseOrder(req, res));
purchaseRouter.put("/purchase-order/:id/update", auth, (req, res) => updatePurchaseOrder(req, res));
purchaseRouter.get("/purchase-order", auth, (req, res) => getPurchaseOrderVendorItemwise(req, res));
purchaseRouter.get("/purchase-order/:id", auth, (req, res) => getPurchaseOrder(req, res));
purchaseRouter.get("/po-form/:id", auth, (req, res) => getPurchaseOrderForm(req, res));

//Bills
purchaseRouter.post("/bill", auth, (req, res) => insertBill(req, res));
purchaseRouter.put("/bill/:id/update", auth, (req, res) => updateBillStatus(req, res));
purchaseRouter.get("/bill/:id", auth, (req, res) => getBill(req, res));

//Bills Payment
purchaseRouter.post("/bill-payment", auth, (req, res) => insertBillPayment(req, res));
purchaseRouter.get("/bill-payment", auth, (req, res) => getBillPayment4Period(req, res));

//Vendor Credit Note
purchaseRouter.post("/vendor-credit", auth, (req, res) => insertVendorCreditNote(req, res));
purchaseRouter.put("/vendor-credit/:id/update", auth, (req, res) => updateVendorCreditNote(req, res));
purchaseRouter.get("/vendor-credit/:id", auth, (req, res) => getVendorCreditNote(req, res));

module.exports = purchaseRouter;