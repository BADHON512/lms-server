import ConnectDB from './Utils/db';
import { app } from './app';
require("dotenv").config()

app.listen(process.env.PORT,()=>{
 console.log(`Server is connected with port ${process.env.PORT}`)
 ConnectDB()
})