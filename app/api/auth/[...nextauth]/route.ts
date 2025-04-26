import NextAuth from "next-auth";
import prisma from "@prisma/index";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
const bcrypt = require("bcryptjs");

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Your email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = await prisma.admin.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!user) {
          return null;
        }

        const passwordCorrect = await bcrypt.compare(
          credentials?.password || "",
          user.password
        );

        if (passwordCorrect) {
          return {
            id: user.id,
            email: user.email,
          };
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Check if the user already exists
        const existingUser = await prisma.admin.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Create the user if they don't exist
          await prisma.admin.create({
            data: {
              email: user.email!,
              password: "", // optional: keep empty since Google user has no password
              provider: "Google",
            },
          });
        }
      }
      return true; // Allow sign in
    },
  },
});

export { handler as GET, handler as POST };
