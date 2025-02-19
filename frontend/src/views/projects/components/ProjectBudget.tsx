import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { Project, Transaction } from '@/types';

interface ProjectBudgetProps {
  project: Project;
}

const ProjectBudget: React.FC<ProjectBudgetProps> = ({ project }) => {
  const theme = useTheme();

  const getTransactionColor = (type: string) => {
    return type === 'expense' ? theme.palette.error.main : theme.palette.success.main;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Budget Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
        >
          Add Transaction
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Budget Overview Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Budget
              </Typography>
              <Typography variant="h4">
                ${project.budget.toLocaleString()}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(project.spent / project.budget) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Spent
              </Typography>
              <Typography variant="h4" color="error">
                ${project.spent.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {((project.spent / project.budget) * 100).toFixed(1)}% of budget
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Remaining
              </Typography>
              <Typography variant="h4" color="success">
                ${(project.budget - project.spent).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {((1 - project.spent / project.budget) * 100).toFixed(1)}% remaining
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Cost Performance Index
              </Typography>
              <Typography variant="h4">
                {project.cost_performance_index.toFixed(2)}
              </Typography>
              <Typography
                variant="body2"
                color={project.cost_performance_index >= 1 ? 'success.main' : 'error.main'}
              >
                {project.cost_performance_index >= 1 ? 'Under budget' : 'Over budget'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Transactions Table */}
        <Grid item xs={12}>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {project.transactions.map((transaction: Transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {transaction.type === 'expense' ? (
                            <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                          ) : (
                            <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                          )}
                          {transaction.type}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          color={getTransactionColor(transaction.type)}
                        >
                          ${transaction.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectBudget;
