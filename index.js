const helemt = require("helmet");
const home = require("./routes/home");
const loginRouter = require("./routes/login");
const postRouter = require("./routes/p");
const config = require("config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());
app.use(helemt());
app.use("/login", loginRouter);
app.use("/p", postRouter);
app.use("/", home);

mongoose
  .connect(
    config.db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("conected to mongodb"))
  .catch(err => console.err("error", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App lisening on port ${PORT}`);
});
