import { prismaClient } from "@/app/lib/db";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
// import { NextResponse } from "next/server";

const handler = NextAuth({
  providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
  })
],
secret: process.env.NEXTAUTH_SECRET ?? "secret",
 callbacks: {
  async signIn(params) {
    if(!params.user.email){
      return false
    }
      try {
        await prismaClient.user.create({
          data: {
            email: params.user.email ?? "",
            provider: "Google"
          }
      })
      } catch (e) {
        // return NextResponse.json({
        //   message: "Error while creating a user"
        // },{
        //   status: 403
        // })
      }
      return true
   }
  }
})

export { handler as GET, handler as POST }