import dotenv from 'dotenv';
import express from 'express';
import { db } from './backend/database/db.js';
import router from './backend/routes/routes.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
const PORT = process.env.PORT || 9000;
dotenv.config();



//initialise express
const app = express();

//connect to database
db();

//generate randombytes
// console.log(crypto.randomBytes(20).toString("hex"));


//configure file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// Enable CORS and body parsing
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//INITIALISE ROUTE NAVIGATION
app.use("/api", router);

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'new-site', 'build', 'index.html'))
});

//initialise server
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})













