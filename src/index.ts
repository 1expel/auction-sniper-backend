import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import routes from "./routes";
import { verifyPrivyToken } from "./middleware/privy-auth.middleware";
import { createUserOnAuth } from "./middleware/user-creation.middleware";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Attempt to authenticate users if they provide a token
app.use(verifyPrivyToken);

// Create users in the database if they're authenticated
app.use(createUserOnAuth);

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("eBay Auction Sniper API");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
