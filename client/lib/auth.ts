"use server";
import { signIn, signOut } from "@/auth";
import { gql } from "@apollo/client";
import { getServerClient } from "./apolloServerClient";
import { redirect } from "next/navigation";
import { showToast } from "@/components/ui/toast";
import { cookies } from "next/headers";

export type userDataArgs = {
  providerArgs?: {
    provider: string;
    providerAccountId: string;
    access_token?: string;
    expires_in?: number;
    scope?: string;
    token_type?: string;
    expires_at?: number;
    id_token?: string;
    email?: string;
    type?: string;
  };
  credentialArgs?: {
    email: string;
    password: string;
  };
};

type userAuthData = {
  name: string;
  email: string;
  image: string;
  id: string;
};

const SIGN_IN_VIA_PASSWORD = gql`
  mutation SignInViaPassword($email: String!, $password: String!) {
    signInResult: SignInViaPassword(
      input: { email: $email, password: $password }
    ) {
      id
      email
      name
      image
    }
  }
`;

const LOG_IN_VIA_PASSWORD = gql`
  query LogInViaPassword($email: String!, $password: String!) {
    logInResult: LogInViaPassword(
      input: { email: $email, password: $password }
    ) {
      email
      id
      image
      name
    }
  }
`;

const LOG_IN_VIA_PROVIDER = gql`
  query LogInViaProvider(
    $provider: String!
    $providerAccountId: String!
    $type: String!
    $expires_at: Int!
    $id_token: String!
    $token_type: String!
    $scope: String!
    $access_token: String!
    $email: String!
  ) {
    logInResult: LogInViaProvider(
      input: {
        access_token: $access_token
        provider: $provider
        providerAccountId: $providerAccountId
        type: $type
        expires_at: $expires_at
        id_token: $id_token
        token_type: $token_type
        scope: $scope
        email: $email
      }
    ) {
      email
      id
      image
      name
    }
  }
`;

const SIGN_IN_VIA_PROVIDER = gql`
  mutation SignInViaProvider(
    $provider: String!
    $providerAccountId: String!
    $type: String!
    $expires_at: Int!
    $id_token: String!
    $token_type: String!
    $scope: String!
    $access_token: String!
    $email: String!
  ) {
    signInResult: SignInViaProvider(
      input: {
        access_token: $access_token
        provider: $provider
        providerAccountId: $providerAccountId
        type: $type
        expires_at: $expires_at
        id_token: $id_token
        token_type: $token_type
        scope: $scope
        email: $email
      }
    ) {
      email
      id
      name
      image
    }
  }
`;

export const credentials = async (userData: userDataArgs) => {
  const email = userData.credentialArgs?.email;
  const password = userData.credentialArgs?.password;

  // this function is being called in form-input.tsx, it doesn't return if all goes well,
  // rather it redirects to the dashboard, if something goes wrong, an error is raised in the
  // auth.ts and is then handled in the frontend if it doesn't pop up
  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  redirect("/dashboard");
};

export const AuthLogIn = async (
  type: "credentials" | "oauth",
  payload: userDataArgs
) => {
  const query =
    type === "credentials" ? LOG_IN_VIA_PASSWORD : LOG_IN_VIA_PROVIDER;
  const client = getServerClient();
  const variables =
    type === "credentials" ? payload.credentialArgs : payload.providerArgs;
  const { data } = await (
    await client
  ).query<{
    logInResult: userAuthData;
  }>({
    query,
    variables,
  });

  if (!data || !data.logInResult) return null;

  return data.logInResult;
};

export const AuthSignIn = async (
  type: "credentials" | "oauth",
  payload: userDataArgs
): Promise<userAuthData | null> => {
  const mutation =
    type === "credentials" ? SIGN_IN_VIA_PASSWORD : SIGN_IN_VIA_PROVIDER;

  const variables =
    type === "credentials" ? payload.credentialArgs : payload.providerArgs;
  const client = getServerClient();

  const { data, error } = await (
    await client
  ).mutate<{
    signInResult: userAuthData;
  }>({
    mutation,
    variables,
  });

  if (error) {
    console.log(error);
    showToast("Session Error", error.message, "error");
    return null;
  }

  if (!data || !data.signInResult?.email) return null;

  //delete token
  (await cookies()).delete("auth-token");

  return data.signInResult;
};

export async function SignIn(oathProvider: string) {
  await signIn(oathProvider, {
    redirectTo: "/dashboard",
  });
}

export async function SignOut() {
  await signOut();
}
