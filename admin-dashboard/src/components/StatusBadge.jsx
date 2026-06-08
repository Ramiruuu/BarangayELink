import { Chip } from '@mui/material'

const colorMap = {
  Pending: 'warning',
  Approved: 'success',
  'Ready for Pickup': 'info',
  Claimed: 'default',
  Declined: 'error',
  Active: 'success',
  Inactive: 'default',
  Upcoming: 'info',
  Ongoing: 'warning',
  Completed: 'success',
  Cancelled: 'error',
}

export default function StatusBadge({ status }) {
  return <Chip label={status} color={colorMap[status] || 'primary'} size="small" />
}
