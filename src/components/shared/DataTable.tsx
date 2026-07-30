import type { ReactNode } from 'react'

interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
}

export function DataTable<T extends { id: number | string }>({
  columns,
  data,
  emptyMessage = 'No records found',
}: DataTableProps<T>) {
  if (!data.length) {
    return (
      <div className="admin-card border-dashed p-12 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="admin-table-wrap">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.className || ''}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.key} className={col.className || ''}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
