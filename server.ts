import ConnectDB from "./Utils/db";
import { app } from "./app";
import cloudinary from "cloudinary";
import http from 'http'
import { initSocketServer } from "./socketServer";
require("dotenv").config();
const server=http.createServer(app)

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret:process.env.API_SECRET ,
    secure: true,
  });
   initSocketServer(server)
  server.listen(process.env.PORT, () => {
  console.log(`Server is connected with port ${process.env.PORT}`);
  ConnectDB();
});
