const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();

// Increase payload size limit (adjust as needed)
app.use(bodyParser.json({ limit: "5mb" }));
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
mongoose.connect(
  "mongodb+srv://siva:siva123@cluster0.neskd7q.mongodb.net/saloon?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const CustomerRoutes = require("./routes/CustomerRoutes");
const AppointmentRoutes = require("./routes/AppointmentRoutes");
const BillingRoutes = require("./routes/BillingRoutes");

const EmployeeRoutes = require("./routes/EmployeeRoutes");
const ServiceRoutes = require("./routes/ServiceRoutes");
const ProductRoutes = require("./routes/ProductRoutes");
const PurchaseStockRoutes = require("./routes/PurchaseStockRoutes");
const StockSelfUseRoutes = require("./routes/StockSelfUseRoutes");
const SupplierRoutes = require("./routes/SupplierRoutes");
const LoginRoutes = require("./routes/LoginRoutes");
const RegisterRoutes = require("./routes/RegisterRoutes");

app.use(express.json());
// app.use('/api', routes); // Use the combined routes
app.use("/api", LoginRoutes);
app.use("/api", RegisterRoutes);
app.use("/api", CustomerRoutes);
app.use("/api", AppointmentRoutes);
app.use("/api", BillingRoutes);
app.use("/api", ServiceRoutes);
app.use("/api", EmployeeRoutes);
app.use("/api", ProductRoutes);
app.use("/api", SupplierRoutes);
app.use("/api", PurchaseStockRoutes);
app.use("/api", StockSelfUseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
