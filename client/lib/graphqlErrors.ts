import { GraphQLError } from "graphql";

type GraphQLErrorTypes = {
  message: string;
  code: string;
  status: number;
};

export function GraphQLErr(err: GraphQLErrorTypes) {
  return new GraphQLError(err.message, {
    extensions: {
      code: err.code,
      http: {
        status: err.status,
      },
    },
  });
}
