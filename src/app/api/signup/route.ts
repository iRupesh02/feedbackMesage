import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { sendEmailVerification } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const exitingUserVerificationByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (exitingUserVerificationByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }
    const exitingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (exitingUserByEmail) {
      if (exitingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exist with this email" },
          { status: 500 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        exitingUserByEmail.password = hashedPassword;
        exitingUserByEmail.verifyCode = verifyCode;
        exitingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await exitingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    //send verification email
    const verifyEmailResponse = await sendEmailVerification(
      email,
      username,
      verifyCode
    );
    if (!verifyEmailResponse.success) {
      return Response.json(
        { success: false, message: verifyEmailResponse.message },
        { status: 500 }
      );
    }
    return Response.json(
      { success: true, message: "User verify successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      { success: false, message: "error registering user" },
      { status: 500 }
    );
  }
}
