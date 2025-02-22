import React from 'react'
import Badge from './Badge'

export default function TableCell({ app, children }) {
  return (
    <td>
      {/* ...existing code... */}
      <Badge
        status={
          app.status === 'approved'
            ? 'approved'
            : app.status === 'rejected'
              ? 'rejected'
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
