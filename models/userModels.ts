import mongoose,{Document,Model,Schema} from 'mongoose'
import bcryptjs from 'bcryptjs'

const emailRegexPattern:RegExp=/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/

export interface IUser extends Document{
  name:string,
  email:string,
  password:string,
  avatar:{
    public_id:string,
    url:string
  },
  role:string
  isVerified:boolean,
  courses:Array<{courseId:string}>
  comparePassword:(password:string)=>Promise<boolean>
}

const userSchema:Schema<IUser>=new mongoose.Schema({
  name:{
    type:String,
    required:[true,'please enter your email']
  },
  email:{
    type:String,
    required:[true,'please enter your email'],
    validate:{
     validator:function(value:string){
        return emailRegexPattern.test(value)
     }
    },
    unique:true
  },
  password:{
    type:String,
    required:[true,'Please enter your password'],
    minlength:[6,'Password must be at least 6 characters'],
    select:false
  },
  avatar:{
    public_id:String,
    url:String
  },
  role:{
    type:String,
    default:'user'
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  courses:[
    {courseId:String}
  ]
},{timestamps:true})

// hash password
userSchema.pre<IUser>('save',async function (next) {
    if(!this.isModified('password')){
      next()
    }
    this.password=await bcryptjs.hash(this.password,10)
    next()
} )

// compare password
userSchema.methods.comparePassword= async function (enteredPassword:string): Promise<boolean> {
    return await bcryptjs.compare(enteredPassword,this.password)
}

const UserModel:Model<IUser>=mongoose.model('User',userSchema)
export default UserModel