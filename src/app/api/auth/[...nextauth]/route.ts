import { authCongig } from "@/lib/auth";
import NextAuth from "next-auth";

// handle request handler for google, facebook etc
const handler = NextAuth(authCongig);

export { handler as GET, handler as POST };
