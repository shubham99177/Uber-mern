import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
import http from "http";
import userrouter from "./routes/user.route.js";
import captainrouter from "./routes/captain.router.js";

export const app = express();

export const server = http.createServer(app);

app.use(cors({
    origin :process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({
    limit : "50mb"
}));

app.use(express.urlencoded({
    limit : "50mb",
    extended : true
}));

app.use(express.static("public"));

app.use(cookieParser()); 


app.use("/api/v1/user", userrouter);
app.use("/api/v1/captain", captainrouter);
