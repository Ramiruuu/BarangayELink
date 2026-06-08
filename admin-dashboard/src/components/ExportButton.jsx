import { Button } from '@mui/material'

export default function ExportButton({ label, onClick, icon }) {
  return (
    <Button variant="contained" color="secondary" startIcon={icon} onClick={onClick}>
      {label}
    </Button>
  )
}
