import React, { useState } from "react"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import { toast } from 'react-toastify';
import { Layanan } from "@/types/types";

type Session = {
  id: string
  name: string
  type: string
}

type Props = {
  session?: Session
  data: Layanan[]
  refetch: () => void
}

function TableAntrian({ session, data, refetch }: Props) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const handleProses = async (antrianID: string) => {
    toast.promise(
      (async () => {
        const response = await fetch(`/api/antrian`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ antrianID, userID: session?.id, statusAntrian: "Progress", operation: "Ambil" }),
        });
  
        // If response is not ok, throw error to trigger catch block
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update Antrian');
        }
  
        const data = await response.json();
        console.log('Antrian updated successfully:', data);
  
        // Optionally refetch or update the UI
        refetch();
  
        return data;
      })(),
      {
        pending: 'Proses pengambilan Antrian...',
        success: 'Antrian berhasil diambil, Selamat bekerja.',
        error: {
          render({ data }: any) {
            return data.message || 'Failed to update Antrian. Please try again.';
          }
        }
      }
    );
  };

  const columns: ColumnDef<Layanan>[] = [
    {
      accessorKey: "nomorAntrian",
      header: "Nomor Antrian",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nomorAntrian")}</div>
      ),
    },
    {
      accessorKey: "layanan",
      header: "Layanan",
      cell: ({ row }) => (
        <div
          className={`
            w-fit h-fit px-4 py-1 rounded-full font-bold
            ${row.getValue("layanan") === "Layanan Pelanggan" ? 
            "bg-blue-50 border-blue-200 text-blue-500 hover:bg-blue-100 hover:text-blue-600" 
            : "bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100 hover:text-rose-600"}
          `}
        >
          <p>{row.getValue("layanan")}</p>
        </div>
      ),
    },
    {
      accessorKey: "kategoriLayanan",
      header: "Kategori",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("kategoriLayanan")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const antrianID = row.original.id

        return (
          <Button
            className={`
              bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-700 active:scale-95
            `}
            onClick={() => handleProses(antrianID)}
          >
            Proses Antrian
          </Button>
        )
      },
    },
  ]

  const table = useReactTable<Layanan>({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="col-span-2 w-full h-fit px-6 p-6 rounded-xl border">
      <div className="flex items-center py-4">
        {/* header here */}
        <h1 className="text-xl text-stone-950">Daftar Antrian</h1>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TableAntrian