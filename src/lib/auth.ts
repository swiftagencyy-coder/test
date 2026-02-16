import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import prisma from "@/lib/prisma";

const secret = process.env.NEXTAUTH_SECRET;

if (!secret && process.env.NODE_ENV === "production") {
    console.warn("WARNING: NEXTAUTH_SECRET is not defined in production environment variables.");
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: secret,
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.sub;
            }
            return session;
        },
    },
    // Removal of custom pages to use NextAuth defaults until pages are built
    /*
    pages: {
        signIn: "/login",
    },
    */
    debug: true,
    logger: {
        error(code, metadata) {
            console.error("NEXTAUTH_ERROR", code, metadata);
        },
    },
};
