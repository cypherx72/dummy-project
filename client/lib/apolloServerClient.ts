"use server";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import fetch from "cross-fetch";
import { getCookie } from "./get-session";

export const createServerApolloClient = async (token?: string) => {
  const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql",
    fetch,
  });

  const authLink = new SetContextLink(async (prevContext) => {
    return {
      headers: {
        ...prevContext.headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
  });
};

let apolloClient: ApolloClient | null = null;

export async function getServerClient() {
  if (apolloClient) return apolloClient;

  const token = await getCookie();
  apolloClient = await createServerApolloClient(token);
  return apolloClient;
}
