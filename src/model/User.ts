import mongoose,{Schema,Document} from "mongoose";


export interface Message extends Document{
    _id:string;
    content:string;
    createdAt:Date
}


const MessageSchema:Schema<Message>= new Schema({
    content:{
        type:String,
    },
    createdAt:{
        type:Date,
        required:true,
        default: Date.now,
    },
 
})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[];

}


const userSchema:Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
        unique:true,   
    },
    email:{
        type:String,
        required:[true,"Emaail is required"],
        unique:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Please enter a valid email"]

    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:6, 
        
    },
    verifyCode:{
        type:String,
        required:[true,"Verify code is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify code expiry is required"],
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true,
    
    },
    messages:[MessageSchema],
    
})

const UserModel=(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",userSchema); 

export default UserModel;