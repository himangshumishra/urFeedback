import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import axios from "axios";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;

        if (!session || !user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Not Authenticated",
                }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!user.email) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Email not found. Sign up with email first",
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");

        if (!username) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Username parameter is missing",
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if the username is unique
        const response = await axios.get(`/api/check-unique-username`, {
            params: { username },
        });

        if (response.data.success) {
            const email = user.email;

            // Update the user's username
            const updatedUser = await UserModel.findOneAndUpdate(
                { email },
                { $set: { username } },
                { new: true }
            );

            if (updatedUser) {
                return new Response(
                    JSON.stringify({
                        success: true,
                        message: "Username updated successfully",
                    }),
                    { status: 200, headers: { "Content-Type": "application/json" } }
                );
            } else {
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: "User not found",
                    }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
        } else {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: response.data.message || "Username is not unique",
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
    } catch (error) {
        console.error("Error during username update:", error);

        return new Response(
            JSON.stringify({
                success: false,
                message: "Something went wrong",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
