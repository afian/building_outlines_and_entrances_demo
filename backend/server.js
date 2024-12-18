// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const placeDetailsRoute = require("./routes/placeDetails");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Use the place details route
app.use("/api/place-details", placeDetailsRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
