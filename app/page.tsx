import TableServer from "@/components/table-server";

export default function Home() {
  return (
    <div className="flex justify-center my-4 px-4">
      <TableServer />
    </div>
  );
}

/* https://github.com/vercel/next.js/discussions/58936#discussioncomment-7701179 */
export const dynamic = "force-dynamic";
