import React from 'react'
import Badge from './Badge'

export default function TableCell({ app, children }) {
  return (
    <td>
      {/* ...existing code... */}
      <Badge
        variant={
          app.status === 'approved'
            ? 'success'
            : app.status === 'rejected'
              ? 'error'
              : 'default'
        }
      >
        {/* ...existing content... */}
      </Badge>
      {/* ...existing code... */}
      {children}
    </td>
  )
}
