const cors = require("cors");
const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth')
const taskRouter = require('./routes/tasks')

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"));

app.get("/", async (request, response, next) => {
    response.send("Hello World");
  });

  app.use("/auth", authRouter);

app.use("/tasks", taskRouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
