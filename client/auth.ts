import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import { AuthLogIn, AuthSignIn } from "./lib/auth";
import { getCookie } from "./lib/get-cookie";
import { CombinedGraphQLErrors, gql } from "@apollo/client";
import { createServerApolloClient } from "./lib/apolloServerClient";
import { CredentialsSignin } from "next-auth";

const FETCH_SESSION_DATA = gql`
  query FetchSessionData($email: String!) {
    sessionData: FetchSessionData(input: { email: $email }) {
      name
      email
      emailVerified
      contactNumber
      registrationId
      image
    }
  }
`;

const providers: Provider[] = [
  Google,
  LinkedIn,
  Credentials({
    credentials: {
      email: {
        type: "email",
      },
      password: {
        type: "password",
      },
    },

    // running for creds...
    authorize: async (credentials) => {
      if (!credentials) return null;

      const email = credentials?.email as string;
      const password = credentials?.password as string;

      const credentialArgs = {
        email,
        password,
      };

      const token = await getCookie();

      if (!token) {
        try {
          const data = await AuthLogIn("credentials", { credentialArgs });

          return {
            id: data?.id,
            email: data?.email,
            image: data?.image,
            name: data?.name,
          };
        } catch (err) {
          const errorMessage = err?.toString().split(":")[1].trim();

          if (err instanceof CombinedGraphQLErrors) {
            throw new CredentialsSignin(errorMessage);
          }

          return null;
        }
      } else {
        try {
          const data = await AuthSignIn("credentials", { credentialArgs });

          return {
            id: data?.id,
            email: data?.email,
            image: data?.image,
            name: data?.name,
          };
        } catch (err) {
          const errorMessage = err?.toString().split(":")[1].trim();

          if (err instanceof CombinedGraphQLErrors) {
            throw new CredentialsSignin(errorMessage);
          }

          return null;
        }
      }
    },
  }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  session: {
    strategy: "jwt",
    maxAge: 354 * 60 * 60 * 24,
    updateAge: 60 * 60 * 3,
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      if (!user || !account || !user?.email) {
        return false;
      }

      const email = user.email;
      const auth_token = await getCookie();

      if (auth_token) {
        try {
          await AuthSignIn("oauth", {
            providerArgs: {
              ...account,
              email,
            },
          });

          return true;
        } catch (err) {
          const errorMessage = err?.toString().split(":")[1].trim();

          // for seeing error in the frontend
          if (err instanceof CombinedGraphQLErrors) {
            throw new CredentialsSignin(errorMessage);
          }

          return false;
        }
      } else {
        try {
          await AuthLogIn("oauth", {
            providerArgs: {
              ...account,
              email: user.email,
            },
          });

          return true;
        } catch (err) {
          const errorMessage = err?.toString().split(":")[1].trim();

          // for seeing error in the frontend
          if (err instanceof CombinedGraphQLErrors) {
            throw new CredentialsSignin(errorMessage);
          }

          return false;
        }
      }
    },

    async jwt({ token, user, trigger }) {
      //todo : fix token time  and updations
      //send request to fetch user

      try {
        if (trigger === "update") {
        }
        // Only fetch once — when user first signs in
        if (user?.email) {
          const client = createServerApolloClient();

          const { data } = await (
            await client
          ).query<{
            sessionData: {
              name: string;
              email: string;
              contactNumber: string;
              image: string;
              id: string;
            };
          }>({
            query: FETCH_SESSION_DATA,
            variables: { email: user.email },
          });

          const sessionData = data?.sessionData;

          // Merge backend data into JWT token
          token.user = {
            name: sessionData?.name,
            email: sessionData?.email,
            contactNumber: sessionData?.contactNumber,
            registrationId: sessionData?.id,
            image: sessionData?.image || token.picture,
          };
        }

        return token;
      } catch (err) {
        console.error("JWT callback error:", err);
        throw err;
      }
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as typeof session.user;
      }

      return session;
    },
  },
});
