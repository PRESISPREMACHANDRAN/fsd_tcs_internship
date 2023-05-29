const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 8000;

const userAccountsRouter = require("./src/routes/userAccountsRouter");
const inventoryRouter = require("./src/routes/inventoryRouter");
const salesRouter = require("./src/routes/salesRouter");
const purchaseRouter = require("./src/routes/purchaseRouter");
const dashboardRouter = require("./src/routes/dashboardRouter");
const reportsRouter = require("./src/routes/reportsRouter");

dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/admin", userAccountsRouter);
app.use("/inventory", inventoryRouter);
app.use("/sales", salesRouter);
app.use("/purchase", purchaseRouter);
app.use("/dashboard", dashboardRouter);
app.use("/reports", reportsRouter);

app.use(express.static(path.join(__dirname, "../frontend/public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public", "index.html"));
});

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

app.use((err, req, res, next) => {
  if (!res.headersSent) {
    res.status(err.status || 500);
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    });
  }
});

mongoose
  .connect(
    "mongodb+srv://presi:presi@cluster0.nu5vjuh.mongodb.net/inventory?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  // mongodb+srv://Prince:12348765@cluster0.glgxktq.mongodb.net/inventory
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
  })
  .catch((err) => console.log(err));