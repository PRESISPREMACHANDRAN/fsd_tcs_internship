const express = require("express");
const path = require("path");
const auth = require("../helpers/auth");
const {
    insertItemGroup,
    getItemGroups,
    updateItemGroup
} = require("../controller/itemGrpController");
const {
    insertItem,
    getItem,
    getAllItems,
    getItemStockOnHand,
    updateItem
} = require("../controller/itemController");
const {
    insertInvAdj,
    getInvAdjDatewise
} = require("../controller/itemAdjController");


const inventoryRouter = express.Router();

var multer = require('multer')

var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, path.join(__dirname, "../../public/", "uploads"));
    },
    filename: function (request, file, callback) {
        callback(null, Math.random().toString() + Date.now().toString() + "-" + file.originalname);
    }
});

var upload = multer({ storage: storage });


//Item Groups
inventoryRouter.post("/item-group", auth, (req, res) => insertItemGroup(req, res));
inventoryRouter.put("/item-group/:id/update", auth, (req, res) => updateItemGroup(req, res));
inventoryRouter.get("/item-groups/:id", auth, async (req, res) => getItemGroups(req, res));

//Items
inventoryRouter.post("/item", auth, upload.single('itemImg'), (req, res) => insertItem(req, res));
inventoryRouter.put("/item/:id/update", auth, (req, res) => updateItem(req, res));
inventoryRouter.get("/item/:id", auth, async (req, res) => getItem(req, res));
inventoryRouter.get("/allitems4group/:id", auth, async (req, res) => getAllItems(req, res));
inventoryRouter.get("/item-stock/:id", auth, async (req, res) => getItemStockOnHand(req, res));

//Inventory Adjustment
inventoryRouter.post("/inv-adj", auth, (req, res) => insertInvAdj(req, res));
inventoryRouter.get("/inv-adj-datewise", auth, async (req, res) => getInvAdjDatewise(req, res));

module.exports = inventoryRouter;