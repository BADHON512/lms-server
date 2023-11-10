require("dotenv").config();
import mongoose from 'mongoose'

const dbUrl:string=process.env.MONGOODB_URL|| ""

const ConnectDB=async()=>{
    await mongoose.connect(dbUrl).then((res:any)=>{
        console.log(`mongooDB connected with ${res.connection.host} `)
    }).then((err:any)=>{
       
    })
}


export default ConnectDB