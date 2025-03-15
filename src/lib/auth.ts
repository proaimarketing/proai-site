import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

// create prisma instence
const prisma = new PrismaClient();

// handle all social login function
export const authCongig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              username: user.name || "Anonymous",
              email: user.email,
              password: "",
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Error signing in:", error);
        return false;
      }
    },
  },
};
