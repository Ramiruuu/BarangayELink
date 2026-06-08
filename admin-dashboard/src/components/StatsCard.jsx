import { Card, CardContent, Typography } from '@mui/material'

export default function StatsCard({ title, value }) {
  return (
    <Card sx={{ minWidth: 190, flex: 1 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}
