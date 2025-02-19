import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Breadcrumbs,
  Link,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { createProject, updateProject, fetchProjectById } from '@/store/slices/projectSlice';
import { addNotification } from '@/store/slices/uiSlice';

const schema = yup.object().shape({
  name: yup.string().required('Project name is required'),
  description: yup.string().required('Description is required'),
  status: yup.string().required('Status is required'),
  budget: yup
    .number()
    .typeError('Budget must be a number')
    .positive('Budget must be positive')
    .required('Budget is required'),
  start_date: yup.date().required('Start date is required'),
  end_date: yup
    .date()
    .min(yup.ref('start_date'), 'End date must be after start date')
    .required('End date is required'),
  client_name: yup.string().required('Client name is required'),
  client_email: yup.string().email('Invalid email').required('Client email is required'),
  location: yup.string().required('Location is required'),
});

const statusOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProject, loading } = useSelector((state: RootState) => state.projects);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      status: 'planning',
      budget: '',
      start_date: null,
      end_date: null,
      client_name: '',
      client_email: '',
      location: '',
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(parseInt(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && currentProject) {
      reset({
        ...currentProject,
        start_date: new Date(currentProject.start_date),
        end_date: new Date(currentProject.end_date),
      });
    }
  }, [currentProject, id, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (id) {
        await dispatch(updateProject({ id: parseInt(id), data }));
        dispatch(
          addNotification({
            type: 'success',
            message: 'Project updated successfully',
          })
        );
      } else {
        await dispatch(createProject(data));
        dispatch(
          addNotification({
            type: 'success',
            message: 'Project created successfully',
          })
        );
      }
      navigate('/projects');
    } catch (error) {
      dispatch(
        addNotification({
          type: 'error',
          message: 'Failed to save project',
        })
      );
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/projects" color="inherit">
            Projects
          </Link>
          <Typography color="text.primary">
            {id ? 'Edit Project' : 'New Project'}
          </Typography>
        </Breadcrumbs>
        <Typography variant="h4">{id ? 'Edit Project' : 'New Project'}</Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Project Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Status"
                      fullWidth
                      error={!!errors.status}
                      helperText={errors.status?.message}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      fullWidth
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="budget"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Budget"
                      fullWidth
                      type="number"
                      error={!!errors.budget}
                      helperText={errors.budget?.message}
                      InputProps={{
                        startAdornment: '$',
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Location"
                      fullWidth
                      error={!!errors.location}
                      helperText={errors.location?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="start_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Start Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.start_date,
                          helperText: errors.start_date?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="end_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="End Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.end_date,
                          helperText: errors.end_date?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="client_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Client Name"
                      fullWidth
                      error={!!errors.client_name}
                      helperText={errors.client_name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="client_email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Client Email"
                      fullWidth
                      error={!!errors.client_email}
                      helperText={errors.client_email?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/projects')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    {id ? 'Update Project' : 'Create Project'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProjectForm;
