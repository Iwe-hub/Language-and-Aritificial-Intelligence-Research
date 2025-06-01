import dotenv from 'dotenv';
import express from 'express';
import { db } from './backend/database/db.js';
import router from './backend/routes/routes.js';
import { verify } from './backend/middleware/verify.js'
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
const PORT = 9000;
dotenv.config();



//initialise express
const app = express();

//initialise server
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})

//connect to database
db();

//generate randombytes
// console.log(crypto.randomBytes(20).toString("hex"));


//configure file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

//engine
app.use(express.static(path.resolve(__dirname, "frontend", "new-site", "build")));

//enable body parser
app.use(bodyParser.urlencoded({ extended: false }));

//handle post requests efficiently
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(express.json());

//enable cors
app.use(cors());



//INITIALISE ROUTE NAVIGATION
app.use("/", router);












