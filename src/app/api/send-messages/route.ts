import dbConnect from "@/lib/dbConnect";
import UserModel  from "@/model/User";
import {Message} from '@/model/User';

export async function POST(request:Request){
    dbConnect();
    const{username,content}=await request.json()
    try {
        // console.log("username",username);
        
        
        const user=await UserModel.findOne({
            username
        })

        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{
                status:404
            })
            
        }
        
        //if user accepting the messages
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User not accepting messages"
            },{
                status:403
            })
        }
        const newMessage={content,createdAt:new Date()}
        user.messages.push(newMessage as Message)

            await user.save()
            return Response.json({
                success:true,
                message:"Message sent successfully"
            },{
                status:200
            })
    } catch (error) {
        console.error("Error in adding messages",error);
        return Response.json({
            success:false,
            message:"Error in adding messages",
        },
        {
            status:500,
        
        })
    }
}