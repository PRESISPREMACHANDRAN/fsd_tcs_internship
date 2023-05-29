const express = require("express"); 
const {
    signupUser,
    adminLogin,
    isAdmin
} = require("../controller/userAccountsController");
const accountsRouter = express.Router();
const auth = require("../helpers/auth");

accountsRouter.post("/signup", auth, async (req, res) => {
    signupUser(req, res);
});

accountsRouter.post("/login", async (req, res) => {
    adminLogin(req, res);
});

accountsRouter.get("/is-admin", auth, (req, res) => {
    isAdmin(req, res);
})


module.exports = accountsRouter;
