const express = require("express");
const auth = require("../helpers/auth");
const {
    getSummary4DashBoard,
    getPurchaseOrderSummary,
    getSalesOrderSummary,
    getCustomerSummary,
    getVendorSummary,
    getDeliveryChallanSummary,
    getPackagesSummary,
    getSalesReturnSummary,
    getItemSummary,
    getBillSummary,
    getInvoicesSummary,
    getRecPayAdjMonthly
 } = require("../controller/dashboardController");

const dashBoardRouter = express.Router();

dashBoardRouter.get("/general-summary", auth, (req, res) => getSummary4DashBoard(req, res));

dashBoardRouter.get("/salesorder-summary", auth, (req, res) => getSalesOrderSummary(req, res));
dashBoardRouter.get("/purchaseorder-summary", auth, (req, res) => getPurchaseOrderSummary(req, res));
dashBoardRouter.get("/deliverychallan-summary", auth, (req, res) => getDeliveryChallanSummary(req, res));
dashBoardRouter.get("/package-summary", auth, (req, res) => getPackagesSummary(req, res));
dashBoardRouter.get("/salesreturn-summary", auth, (req, res) => getSalesReturnSummary(req, res));
dashBoardRouter.get("/bill-summary", auth, (req, res) => getBillSummary(req, res));
dashBoardRouter.get("/invoice-summary", auth, (req, res) => getInvoicesSummary(req, res));
dashBoardRouter.get("/inv-adj-rec-pay", auth, (req, res) => getRecPayAdjMonthly(req, res));

dashBoardRouter.get("/customer-summary/:id", auth, (req, res) => getCustomerSummary(req, res));
dashBoardRouter.get("/vendor-summary/:id", auth, (req, res) => getVendorSummary(req, res));
dashBoardRouter.get("/item-summary/:id", auth, (req, res) => getItemSummary(req, res));

module.exports = dashBoardRouter;