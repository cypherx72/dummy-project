import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { createServerApolloClient } from "./lib/apolloServerClient";
import { gql } from "@apollo/client";

const MIDDLEWARE_ = gql`
  query Middlware {
    middlewareResponse: Middleware {
      message
      code
      status
    }
  }
`;

export default auth(async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  if (url.pathname === "/auth/signin") {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      url.pathname = "/auth/register";
      return NextResponse.redirect(url);
    }
    const client = createServerApolloClient(token);
    try {
      const { data } = await (
        await client
      ).query<{
        middlewareResponse: {
          status: number;
          message: string;
          code: string;
        };
      }>({
        query: MIDDLEWARE_,
        variables: { token },
      });
      if (data?.middlewareResponse.status !== 200) {
        const encoded = Buffer.from("no-token").toString("base64");
        url.searchParams.set("encoded_string", encoded);
        return NextResponse.redirect(url);
      }
    } catch (err) {
      console.log(err);
      url.pathname = "/auth/register";
      const encoded = Buffer.from("no-token").toString("base64");
      url.searchParams.set("enc_str", encoded);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
});
