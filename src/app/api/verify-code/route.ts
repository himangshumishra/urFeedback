import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";

const VerifyCodeSchema = z.object({
  code: verifySchema,
});

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const user = await UserModel.findOne({
      username,
      verifyCode: code,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User Not Found",
        },
        {
          status: 400,
        }
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
    user.isVerified=true;
    await user.save();
    return Response.json(
      {
        success: true,
        message: "User verified successfully",
      },
      {
        status: 200,
      }
    );
    } else if(!isCodeNotExpired){
        return Response.json(
            {
                success:false,
                message:"Verification code has expired. Signup again to get a new code",
            },
            {
                status:400,
            }
        )
    } else{
        return Response.json(
            {
                success:false,
                message:"Invalid verification code",
            },
            {
                status:400,
            });
        
    }


  } catch (error) {
    console.error("Error while verifying user ", error);
    return Response.json(
      {
        success: false,
        message: "Error while verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
