import { auth, connectAuthDB } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const GET = async (request: Request) => {
  await connectAuthDB();
  return handler.GET(request);
};

export const POST = async (request: Request) => {
  await connectAuthDB();
  return handler.POST(request);
};