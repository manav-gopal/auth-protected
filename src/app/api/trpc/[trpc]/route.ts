import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../trpc-router";
import { createContext } from "@/utils/trpc-context";
import { addCorsHeaders } from "@/utils/cors";

const handler = async (request: Request) => {
  console.log(`incoming request ${request.url}`);

  if (request.method === 'OPTIONS') {
    return addCorsHeaders(new Response(null, { status: 204 }));
  }

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: createContext,
  });

  return addCorsHeaders(response);
};

export { handler as GET, handler as POST };
