"use client";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { Assignment, Period, Link } from "@/interfaces/assignment.interface";
import {
  FaArrowRotateRight,
  FaArrowUpRightFromSquare,
  FaCircleMinus,
  FaCirclePlus,
  FaPen,
  FaRegTrashCan,
  FaSort,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa6";
import classNames from "classnames";
import { useResizeDetector } from "react-resize-detector";

const LOCALE = "da-DK";

async function getTableData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}table/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (await res.json()) as Assignment[];
}

export default function Table() {
  const [data, setData] = useState<Assignment[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const columns = useColumns({ expandedRows, setExpandedRows });
  const [groups, setGroups] = useState<Link[]>([]);
  const [subjects, setSubjects] = useState<Link[]>([]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  useEffect(() => {
    async function fetchData() {
      const initialData = await getTableData();
      setData(initialData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    setGroups(
      [
        ...new Map(
          data
            .map((elem) => elem.groups)
            .flat()
            .map((item) => [item["title"], item])
        ).values(),
      ].sort((a, b) => a.title.localeCompare(b.title))
    );

    setSubjects(
      [
        ...new Map(
          data.map((elem) => elem.subject).map((item) => [item["title"], item])
        ).values(),
      ].sort((a, b) => a.title.localeCompare(b.title))
    );
  }, [data]);

  const { width, ref } = useResizeDetector({
    refreshMode: "throttle",
    refreshRate: 100,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableFilters: false,
    manualPagination: true,
  });

  useEffect(() => {
    if (width && ref.current) {
      const columns = table.getAllColumns();
      columns.forEach((column) => {
        const id = column.id;
        if (width < 920) {
          column.toggleVisibility(id !== "groups");
        } else {
          column.toggleVisibility(true);
        }
      });
    }
  }, [ref, table, width]);

  const refreshData = async () => {
    setExpandedRows({});
    setData(await getTableData());
  };

  if (!data.length) {
    return;
  }

  return (
    <div className="w-full max-w-7xl bg-white p-4 grid gap-4">
      {(groups.length || subjects.length) && (
        <div className="flex gap-4">
          {groups.length && (
            <select
              onChange={(event) =>
                setColumnFilters([
                  ...columnFilters,
                  { id: "groups", value: event.target.value },
                ])
              }
            >
              <option value="">Hold/klasse</option>
              {groups.map((group, i) => (
                <option key={i}>{group.title}</option>
              ))}
            </select>
          )}
          {subjects.length && (
            <select
              onChange={(event) =>
                setColumnFilters([
                  ...columnFilters,
                  { id: "subject", value: event.target.value },
                ])
              }
            >
              <option value="">Fag</option>
              {subjects.map((subject, i) => (
                <option key={i}>{subject.title}</option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className="w-full overflow-hidden" ref={ref}>
        <table className="w-full border-separate border-spacing-0">
          <thead className="bg-white sticky top-0 z-10 ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, i) =>
                  i === 0 &&
                  hasHiddenColumns(table.getRowModel().rows[0]) === false ? (
                    <Fragment key={header.id}></Fragment>
                  ) : (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="text-left py-2 px-4 border-b border-gray-500"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={classNames("flex gap-2 items-center", {
                            "cursor-pointer select-none":
                              header.column.getCanSort(),
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() &&
                            ({
                              asc: <FaSortUp />,
                              desc: <FaSortDown />,
                            }[header.column.getIsSorted() as string] ?? (
                              <FaSort />
                            ))}
                        </div>
                      )}
                    </th>
                  )
                )}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <tr>
                  {row.getVisibleCells().map((cell) =>
                    cell.column.id === "expander" &&
                    hasHiddenColumns(row) === false ? (
                      <Fragment key={cell.id}></Fragment>
                    ) : (
                      <td
                        key={cell.id}
                        className={classNames(
                          " py-2 px-4 relative whitespace-nowrap",
                          "[&:not(:first-child)]:before:absolute [&:not(:first-child)]:before:left-0 [&:not(:first-child)]:before:w-px [&:not(:first-child)]:before:bg-black [&:not(:first-child)]:before:h-4 [&:not(:first-child)]:before:top-1/2 [&:not(:first-child)]:before:-translate-y-1/2",
                          { "w-full": cell.column.id === "learningMaterial" },
                          { "border-b border-gray-500": !expandedRows[row.id] }
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  )}
                </tr>
                {expandedRows[row.id] && (
                  <tr>
                    <td className="border-b border-gray-500" />
                    <td
                      colSpan={row.getVisibleCells().length - 1}
                      className="py-2 px-4 border-b border-gray-500"
                    >
                      <table className="w-full">
                        <tbody>
                          {row
                            .getAllCells()
                            .filter((cell) => !cell.column.getIsVisible())
                            .map((cell) => (
                              <tr key={cell.id + "a"}>
                                <th className="font-bold">
                                  {cell.column.columnDef.header?.toString()}:
                                </th>
                                <td className="relative w-full">
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button
          onClick={() => refreshData()}
          className="bg-blue-500 text-white flex gap-2 items-center text-base px-4 py-2 cursor-pointer hover:bg-blue-400 rounded"
        >
          Refresh
          <FaArrowRotateRight />
        </button>
      </div>
    </div>
  );
}

const hasHiddenColumns = (row?: Row<Assignment>) => {
  return (
    row?.getAllCells().some((cell) => !cell.column.getIsVisible()) || false
  );
};

const Ellipsis = ({ children }: { children: ReactNode }) => {
  return (
    <span className="absolute inset-0 py-2 px-4 flex items-center">
      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
        {children}
      </span>
    </span>
  );
};

const ExternalLink = ({ link }: { link: Link }) => {
  return (
    <a
      href={link.url}
      target="_blank"
      className="underline hover:no-underline"
      title={link.title}
    >
      {link.title}
    </a>
  );
};

const useColumns = ({
  expandedRows,
  setExpandedRows,
}: {
  expandedRows: Record<string, boolean>;
  setExpandedRows: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}): ColumnDef<Assignment>[] => {
  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  return [
    {
      id: "expander",
      header: () => null,
      cell: ({ row }) =>
        hasHiddenColumns(row) ? (
          <button
            onClick={() => toggleRow(row.id)}
            className="block p-2 cursor-pointer"
          >
            {expandedRows[row.id] ? <FaCircleMinus /> : <FaCirclePlus />}
          </button>
        ) : null,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "groups",
      cell: (info) => {
        const links = info.getValue<Link[]>();
        const text =
          links.length > 2
            ? `${links[0].title} og ${links.length - 1} mere`
            : links.map((link) => link.title).join(" og ");
        return <Ellipsis>{text}</Ellipsis>;
      },
      header: "Hold/klasse",
      filterFn: (
        row: Row<Assignment>,
        _columnId: string,
        filterValue: string
      ) => {
        if (filterValue === "") {
          return true;
        }
        return row.original.groups.some((group) => group.title === filterValue);
      },
    },
    {
      accessorKey: "subject",
      cell: (info) => {
        const link = info.getValue<Link>();

        return (
          <Ellipsis>
            <ExternalLink link={link} />
          </Ellipsis>
        );
      },
      header: "Fag",
      filterFn: (
        row: Row<Assignment>,
        _columnId: string,
        filterValue: string
      ) => {
        if (filterValue === "") {
          return true;
        }
        return row.original.subject.title === filterValue;
      },
    },
    {
      accessorKey: "portal",
      cell: (info) => {
        const link = info.getValue<Link>();

        return (
          <Ellipsis>
            <ExternalLink link={link} />
          </Ellipsis>
        );
      },
      header: "Læremiddel",
    },
    {
      accessorKey: "learningMaterial",
      cell: (info) => {
        const link = info.getValue<Link>();

        return (
          <Ellipsis>
            <ExternalLink link={link} />
          </Ellipsis>
        );
      },
      header: "Titel",
    },
    {
      accessorKey: "period",
      cell: (info) => {
        const period = info.getValue<Period>();
        const text = `${new Date(period.start).toLocaleDateString(
          LOCALE
        )} - ${new Date(period.end).toLocaleDateString(LOCALE)}`;

        return text;
      },
      header: "Periode",
    },
    {
      accessorKey: "id",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          {row.original.externalManagement ? (
            <button
              onClick={() => alert(`External management: ${row.original.id}`)}
              className="bg-blue-500 text-white flex gap-2 items-center text-base px-4 py-2 cursor-pointer hover:bg-blue-400 rounded"
            >
              Åbn
              <FaArrowUpRightFromSquare />
            </button>
          ) : (
            <>
              <button
                onClick={() => alert(`Edit: ${row.original.id}`)}
                className="bg-blue-500 text-white text-base p-2.5 cursor-pointer hover:bg-blue-400 rounded"
              >
                <FaPen />
              </button>
              <button
                onClick={() => alert(`Delete: ${row.original.id}`)}
                className="bg-white text-black text-base p-2.5 cursor-pointer hover:bg-gray-100 inset-ring inset-ring-blue-500 rounded"
              >
                <FaRegTrashCan />
              </button>
            </>
          )}
        </div>
      ),
      header: "",
      enableSorting: false,
    },
  ];
};
