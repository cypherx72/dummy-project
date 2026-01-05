"use server";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import fetch from "cross-fetch";
import { getCookie } from "./get-cookie";

export const createServerApolloClient = async (token?: string) => {
  const httpLink = new HttpLink({
    uri: process.env.GRAPHQL_ENDPOINT || "http://localhost:4000/",
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
