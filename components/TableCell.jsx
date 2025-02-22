import React from 'react'

export default function TableCell({ app, children }) {
  const bgClass =
    app.status === 'approved'
      ? 'bg-green-500'
      : app.status === 'rejected'
        ? 'bg-red-500'
        : 'bg-gray-500'

  return (
    <td>
      {/* ...existing code... */}
      <button className={`px-2 py-1 rounded text-white ${bgClass}`}>
        {app.status}
      </button>
      {/* ...existing code... */}
      {children}
    </td>
  )
}
