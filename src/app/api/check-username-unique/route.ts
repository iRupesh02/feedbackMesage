import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = { username: searchParams.get("username") };
    //validate with zod
    const result = usernameQuerySchema.safeParse(queryParam);
    console.log(result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "Inavlid query parameters",
        },
        { status: 401 }
      );
    }
    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        { success: false, message: "username is already taken" },
        { status: 400 }
      );
    }
    return Response.json(
      { success: true, message: "Username is unique" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      { success: false, message: "Error Checking username" },
      { status: 500 }
    );
  }
}
