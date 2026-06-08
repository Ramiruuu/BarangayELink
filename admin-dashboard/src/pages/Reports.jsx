import { useMemo, useState } from 'react'
import { Box, Grid, Paper, Typography, TextField, MenuItem, Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { purokStats, docTypeDistribution } from '../data/mockData.js'

const reportTypes = ['Residents', 'Documents', 'Events', 'Giveaways']
const purokOptions = ['All', 'Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Purok 6', 'Purok 7', 'Purok 8']
const documentTypes = ['All', 'Barangay Clearance', 'Barangay ID', 'Business Clearance', 'Certification']
const chartColors = ['#1B5E20', '#FFC107', '#388E3C', '#8D6E63']

export default function Reports() {
  const [reportType, setReportType] = useState('Residents')
  const [startDate, setStartDate] = useState('2024-07-01')
  const [endDate, setEndDate] = useState('2024-08-31')
  const [purokFilter, setPurokFilter] = useState('All')
  const [documentType, setDocumentType] = useState('All')

  const summaryData = useMemo(() => {
    if (reportType === 'Residents') {
      return purokStats
    }
    if (reportType === 'Documents') {
      return docTypeDistribution
    }
    return [{ name: reportType, value: 100 }]
  }, [reportType])

  const handleGenerate = () => {
    window.alert('Report generated')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField select label="Report Type" fullWidth value={reportType} onChange={(e) => setReportType(e.target.value)}>
              {reportTypes.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Start Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="End Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Grid>
          {reportType === 'Residents' && (
            <Grid item xs={12} md={3}>
              <TextField select label="Purok Filter" fullWidth value={purokFilter} onChange={(e) => setPurokFilter(e.target.value)}>
                {purokOptions.map((purok) => <MenuItem key={purok} value={purok}>{purok}</MenuItem>)}
              </TextField>
            </Grid>
          )}
          {reportType === 'Documents' && (
            <Grid item xs={12} md={3}>
              <TextField select label="Document Type" fullWidth value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                {documentTypes.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
              </TextField>
            </Grid>
          )}
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={handleGenerate}>Generate</Button>
          <Button variant="outlined" onClick={() => window.alert('PDF exported')}>📄 Export as PDF</Button>
          <Button variant="outlined" onClick={() => window.alert('Excel exported')}>📊 Export as Excel/CSV</Button>
          <Button variant="outlined" onClick={() => window.print()}>🖨️ Print Report</Button>
        </Box>
      </Paper>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Summary Table</Typography>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summaryData.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell align="right">{row.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Chart Preview</Typography>
              <Box sx={{ height: 320, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  {reportType === 'Residents' ? (
                    <BarChart data={summaryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="purok" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="residents" fill="#1B5E20" />
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie data={summaryData} dataKey="value" nameKey="name" outerRadius={100} fill="#1B5E20" label>
                        {summaryData.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
