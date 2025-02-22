import React from 'react'

export default function Badge({ variant, children }) {
  const style =
    variant === 'success'
      ? { backgroundColor: 'green', color: 'white' }
      : variant === 'error'
        ? { backgroundColor: 'red', color: 'white' }
        : { backgroundColor: 'gray', color: 'white' }

  return (
    <span style={{ padding: '4px 8px', borderRadius: '4px', ...style }}>
      {children}
    </span>
  )
}
