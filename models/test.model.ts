import { Model,Document, Schema } from "mongoose";

interface IComment extends Document{
   user:object
   comment:string,
   commentReply:string
}

interface IReview extends Document{
    user:object,
    reviews:number,
    comment:string,
    commentReply:string
}

interface ILink extends Document{
    title:string,
    url:string
}

interface IProductData extends Document{
  name:string,
  description:string,
  quality:string,
  price:number,
  link:ILink[]

}

   const productSchema= new Schema<IProductData>({
     name:{
        type:String,
        required:true
     },
     description:{
        type:String,
        required:true
     },
     quality:{
        type:String,
        required:true
     },
     price:{
        type:Number,
        required:true
     },

   })


interface Seller extends Document{
    name:string,
    age:string,
    product:
}