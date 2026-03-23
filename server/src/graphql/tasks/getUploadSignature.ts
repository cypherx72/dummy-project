import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!;

export async function GetUploadSignature(
  _: unknown,
  input: {
    courseId: string;
  },
  context: contextType,
) {
  const { cloudinary } = context;
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "assignments";
  const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!;

  try {
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      CLOUDINARY_API_SECRET,
    );

    return {
      signature,
      timestamp,
      apiKey: CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder: "assignments",
    };
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }

    throw GraphQLCustomLError({
      message: "We couldn't create the task. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
