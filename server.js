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

// Database connection
db();

// Configure file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.resolve(__dirname, 'frontend', 'new-site', 'build')));

// API routes
app.use("/api", router);

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'new-site', 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});













