import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt", // ✅ Use JWT instead of database sessions
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!; // ✅ Store user ID in the session
                // console.log(session.user.id);
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id; // ✅ Store user ID in JWT
            }
            return token;
        },
    },
};

export default NextAuth(authOptions);
