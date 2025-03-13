import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Success!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
