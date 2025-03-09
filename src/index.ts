import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "@/routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Hello from eBay Sniper API!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
