import { Box, Grid, Card, CardContent, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'
import StatsCard from '../components/StatsCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { documentRequests, purokStats, monthlyDocumentRequests, docTypeDistribution } from '../data/mockData.js'

const activityHeaders = ['Request #', 'Resident', 'Type', 'Status', 'Date', 'Fee']
const pieColors = ['#1B5E20', '#FFC107', '#388E3C', '#8D6E63']

export default function Dashboard() {
  const recentRequests = documentRequests.slice(0, 5)

  const handleAction = (label) => {
    window.alert(`${label} clicked`)
    console.log(label)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}><StatsCard title="Total Residents" value="2,847" /></Grid>
        <Grid item xs={12} md={3}><StatsCard title="Total Households" value="712" /></Grid>
        <Grid item xs={12} md={3}><StatsCard title="Pending Documents" value="23" /></Grid>
        <Grid item xs={12} md={3}><StatsCard title="Active Giveaways" value="3" /></Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Monthly Document Requests</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyDocumentRequests} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="requests" stroke="#1B5E20" strokeWidth={3} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Residents per Purok</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={purokStats} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="purok" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="residents" fill="#1B5E20" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Document Types Distribution</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={docTypeDistribution} dataKey="value" nameKey="name" outerRadius={90} fill="#1B5E20" label>
                    {docTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Activity</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {activityHeaders.map((header) => (<TableCell key={header}>{header}</TableCell>))}
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentRequests.map((request) => (
                      <TableRow key={request.id} hover>
                        <TableCell>{request.requestNumber}</TableCell>
                        <TableCell>{request.residentName}</TableCell>
                        <TableCell>{request.documentType}</TableCell>
                        <TableCell><StatusBadge status={request.status} /></TableCell>
                        <TableCell>{request.requestedDate}</TableCell>
                        <TableCell align="right">
                          <Button size="small" color="success" onClick={() => handleAction('Approve')}>Approve</Button>
                          <Button size="small" color="error" onClick={() => handleAction('Decline')}>Decline</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6">Quick Actions</Typography>
              <Button variant="contained" onClick={() => handleAction('Add New Resident')}>+ Add New Resident</Button>
              <Button variant="contained" onClick={() => handleAction('Create Event')}>+ Create Event</Button>
              <Button variant="contained" onClick={() => handleAction('New Giveaway')}>+ New Giveaway</Button>
              <Button variant="outlined" onClick={() => handleAction('Generate Report')}>📊 Generate Report</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
