import React from 'react'

export type BadgeStatus = 'approved' | 'rejected' | 'default'

interface BadgeProps {
  status: BadgeStatus;
  children: React.ReactNode;
}

export default function Badge({ status, children }: BadgeProps) {
  const style =
    status === 'approved'
      ? { backgroundColor: 'green', color: 'white' }
      : status === 'rejected'
        ? { backgroundColor: 'red', color: 'white' }
        : { backgroundColor: 'gray', color: 'white' }

  return (
    <span style={{ padding: '4px 8px', borderRadius: '4px', ...style }}>
      {children}
    </span>
  )
}
