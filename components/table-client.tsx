"use client";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { GetTableData } from "./table-server";
import { Assignment, Period, Link } from "@/interfaces/assignment.interface";
import {
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

export default function TableClient({
  initialData,
}: {
  initialData: Assignment[];
}) {
  const [data, setData] = useState<Assignment[]>(initialData);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const ellipsis = (children: ReactNode) => {
    return (
      <span className="absolute inset-0 py-2 px-4 flex items-center">
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
          {children}
        </span>
      </span>
    );
  };

  const columns = React.useMemo<ColumnDef<Assignment>[]>(
    () => [
      {
        id: "expander",
        header: () => null,
        cell: ({ row }) =>
          hasHiddenColumns(row) ? (
            <button onClick={() => toggleRow(row.id)}>
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

          return ellipsis(text);
        },
        header: "Hold/klasse",
      },
      {
        accessorKey: "subject",
        cell: (info) => {
          const link = info.getValue<Link>();

          return ellipsis(
            <a href={link.url} target="_blank">
              {link.title}
            </a>
          );
        },
        header: "Fag",
      },
      {
        accessorKey: "portal",
        cell: (info) => {
          const link = info.getValue<Link>();

          return ellipsis(
            <a href={link.url} target="_blank">
              {link.title}
            </a>
          );
        },
        header: "Læremiddel",
      },
      {
        accessorKey: "learningMaterial",
        cell: (info) => {
          const link = info.getValue<Link>();

          return ellipsis(
            <a href={link.url} target="_blank" className="font-bold">
              {link.title}
            </a>
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
    ],
    [expandedRows]
  );

  const { width, ref } = useResizeDetector({
    refreshMode: "throttle",
    refreshRate: 100,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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

  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const hasHiddenColumns = (row: Row<Assignment>) => {
    return row.getAllCells().some((cell) => !cell.column.getIsVisible());
  };

  const refreshData = async () => {
    setData(await GetTableData());
  };

  if (!data.length) {
    return;
  }

  return (
    <div className="w-full max-w-7xl bg-white p-4">
      <div className="w-full overflow-hidden" ref={ref}>
        <table className="w-full border-separate border-spacing-0">
          <thead className="bg-white sticky top-0 z-10 ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, i) => {
                  return i === 0 &&
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
                  );
                })}
                <th className="border-b border-gray-500"></th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <Fragment key={row.id}>
                  <tr>
                    {row.getVisibleCells().map((cell, i) => {
                      return i === 0 && hasHiddenColumns(row) === false ? (
                        <Fragment key={cell.id}></Fragment>
                      ) : (
                        <td
                          key={cell.id}
                          className={classNames(
                            "border-b border-gray-500 py-2 px-4 relative whitespace-nowrap",
                            "after:content after:absolute after:right-0 after:w-px after:bg-black after:h-4 after:top-1/2 after:-translate-y-1/2",
                            { "w-full": cell.column.id === "learningMaterial" }
                            // { "min-w-48": cell.column.id === "period" }
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                    <td className="py-2 pl-4 border-b border-gray-500">
                      <div className="flex gap-2">
                        {row.original.externalManagement ? (
                          <button
                            onClick={() =>
                              alert(`External management: ${row.original.id}`)
                            }
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
                              onClick={() =>
                                alert(`Delete: ${row.original.id}`)
                              }
                              className="bg-white text-black text-base p-2.5 cursor-pointer hover:bg-gray-100 inset-ring inset-ring-blue-500 rounded"
                            >
                              <FaRegTrashCan />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedRows[row.id] && (
                    <tr>
                      <td />
                      <td
                        colSpan={row.getVisibleCells().length - 1}
                        className="py-2 px-4"
                      >
                        <div>
                          {row
                            .getAllCells()
                            .filter((cell) => !cell.column.getIsVisible())
                            .map((cell) => (
                              <table key={cell.id}>
                                <tr>
                                  <th className="font-bold">
                                    {cell.column.columnDef.header?.toString()}:
                                  </th>
                                  <td>
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </td>
                                </tr>
                              </table>
                            ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="h-2" />
      <button onClick={() => refreshData()}>Refresh Data</button>
    </div>
  );
}
