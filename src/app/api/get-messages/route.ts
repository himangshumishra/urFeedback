import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request: Request) {
    await dbConnect();

    const session=await getServerSession(authOptions)
    const user= session?.user as User;
    if(!session || !user){
          return Response.json({
               success:false,
               message:"Not Authenticated",
          },
          {
               status:401,
          })
    }
    const userId=new mongoose.Types.ObjectId(user._id)
    
    try {
        const user = await UserModel.aggregate([
        {
            $match: {
                _id: userId
            }
        },
        {
            $lookup: {
                from: "messages",
                localField: "_id",
                foreignField: "userId",
                as: "content"
            }
        },
        {
            $unwind: {
                path: "$messages",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $sort: {
                "messages.createdAt": -1
            }
        },
        {
            $group: {
                _id: "$_id",
                messages: {
                    $push: "$messages"
                }
            }
        },
        {
            $project: {
                _id: 1,
                messages: {
                    $ifNull: ["$messages", []]
                }
            }
        }
    ]);
       
        
        if(!user || user.length===0){
            return Response.json({
                success:false,
                message:"No User Found",
            },{
                status:401
            })
        }
        if (user[0].messages.length === 0) {
            return Response.json({
                success: false,
                message: "No Messages Found",
            }, {
                status: 404
            });
        }
    
        return Response.json({
            success:true,
            messages:user[0].messages
        },
        {
            status:200
        })

    } catch (error) {
        console.error("Unexpected error error occured",error);
        return Response.json({
            success:false,
            message:"Unexpected error error occured ",
        },
        {
            status:500,
        }) 
        
    }

 
    
}