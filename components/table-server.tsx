import TableClient from "./table-client";
import { Assignment } from "@/interfaces/assignment.interface";

export async function GetTableData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}table/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (await res.json()) as Assignment[];
}

export default async function TableServer() {
  const data = await GetTableData();
  return <TableClient initialData={data} />;
}
