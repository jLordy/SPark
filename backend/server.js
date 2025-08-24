import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors"
import dotenv from "dotenv"

import userRoutes from "./routes/userRoutes.js"
import { sql } from "./config/db.js"
import { aj } from "./lib/arcjet.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

//apply arcjet rate-limit to all routes
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1 //specifies that each request consumes 1 token
        })

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                res.status(429).json({ error: "Too Many Requests" });
            } else if (decision.reason.isBot()){
                res.status(403).json({ error: "Bot Access Denied" });
            } else {
                res.status(403).json({ error: "Forbidden" })
            }
            return 
        }
        
        //check for spoofed bots
        if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            res.status(403).json({ error: "Spoofed bot detected" });
            return;
        }

        next();
    } catch (error) {
        console.log("Arcjet error", error);
        next(error);
    }
})

app.use("/api/users", userRoutes);

async function initDB() {
    try {
        await sql `
            CREATE TABLE IF NOT EXISTS users (
                user_id       SERIAL PRIMARY KEY,                -- unique user identifier
                first_name    VARCHAR(50) NOT NULL,              -- given name
                middle_name   VARCHAR(50),                       -- optional
                last_name     VARCHAR(50) NOT NULL,              -- surname
                position      VARCHAR(100),                      -- e.g. "Student", "Faculty"
                vehicle_type  VARCHAR(50),                       -- e.g. "Car", "Motorcycle"
                plate_number  VARCHAR(20) UNIQUE,                -- vehicle plate, must be unique
                id_picture    TEXT,                              -- store file path or URL 
                preferences   JSONB,                             -- flexible user settings (JSON format)
                is_approved   BOOLEAN DEFAULT FALSE,             -- approval status
                role          VARCHAR(50) DEFAULT 'user'         -- e.g. "dev", "admin", "user"
            );
        `
        console.log("Database Initialized successfully")
    } catch (error) {
        console.log("Error initDB", error);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port " + PORT);
    })
});

