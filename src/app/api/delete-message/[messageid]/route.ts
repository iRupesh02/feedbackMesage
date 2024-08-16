import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { User } from "next-auth";


export async function DELETE(request: Request , {params} : {params:{messageid:string}}) {
    const messageId=params.messageid
  dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session?.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  
  try {
    const updateResult = await UserModel.updateOne(
        {_id:user._id},
        {$pull:{message:{_id:messageId}}}
    )
    if(updateResult.modifiedCount==0){
        return Response.json(
            { success: false, message: "Message not found or already delete" },
            { status: 401 }
          );
    }
    return Response.json(
        { success: true, message: "Message Deleted" },
        { status: 201 }
      );
  } catch (error: any) {
    console.log("Error is delete message route",error);
    return Response.json(
        { success: false, message: "Error deleting message" },
        { status: 401 }
      );
    
  }

}
