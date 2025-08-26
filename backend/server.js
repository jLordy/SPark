import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors"
import dotenv from "dotenv"
import path from "path";
import fs from 'fs';

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

// Secure static file serving middleware
app.use("/uploads", (req, res, next) => {
  // Validate request path to prevent directory traversal
  const requestedPath = req.path;
  if (requestedPath.includes('../') || requestedPath.includes('..\\')) {
    return res.status(400).json({ error: "Invalid request" });
  }

  // Set security headers
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL] 
    : ["http://localhost:5173"];
  
  if (allowedOrigins.includes(req.headers.origin)) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  }
  
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  
  // Cache headers for production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
  
  next();
});

app.use("/uploads", express.static("uploads", {
  // Additional security options
  dotfiles: 'ignore', // ignore dotfiles like .git, .env
  index: false, // disable directory indexing
  setHeaders: (res, filePath) => {
    // Set proper content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    
    if (mimeTypes[ext]) {
      res.setHeader('Content-Type', mimeTypes[ext]);
    }
  }
}));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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
                role          VARCHAR(50) DEFAULT 'user',        -- e.g. "dev", "admin", "user"
                username      VARCHAR(50) UNIQUE NOT NULL,       -- unique login username
                password      TEXT NOT NULL                      -- hashed password 
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

