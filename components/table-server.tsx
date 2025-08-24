import TableClient from "./table-client";
import { Assignment } from "@/interfaces/assignment.interface";

export async function GetTableData() {
  const res = await fetch("http://localhost:3000/table/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ depth: 500 }),
  });
  return (await res.json()) as Assignment[];
}

export default async function TableServer() {
  const data = await GetTableData();
  return <TableClient initialData={data} />;
}
