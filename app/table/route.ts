import { assignmentsMock } from "@/mocks/assignments.mock";

export async function POST(request: Request) {
  // const depth = ((await request.json()) as {depth: number}).depth;
  // return Response.json(makeData(depth));
  return Response.json(assignmentsMock);
}
