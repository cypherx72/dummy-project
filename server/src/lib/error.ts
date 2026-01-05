import { type GraphQLErrorTypes } from "./types.js";
import { GraphQLError } from "graphql";

export function GraphQLCustomLError(err: GraphQLErrorTypes) {
  return new GraphQLError(err.message, {
    extensions: {
      status: err.status,
      code: err.code,
    },
  });
}
