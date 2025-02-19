import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  AvatarGroup,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { Project, TeamMember } from '@/types';

interface ProjectTeamProps {
  project: Project;
}

const ProjectTeam: React.FC<ProjectTeamProps> = ({ project }) => {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Project Team</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
        >
          Add Team Member
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Team Overview Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Team Members
              </Typography>
              <Typography variant="h4">
                {project.team.length}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <AvatarGroup max={5}>
                  {project.team.map((member) => (
                    <Avatar
                      key={member.id}
                      alt={member.name}
                      src={member.avatar}
                    />
                  ))}
                </AvatarGroup>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Project Manager
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={project.manager.avatar}
                  sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1">
                    {project.manager.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.manager.title}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Departments
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {project.departments.map((dept) => (
                  <Chip
                    key={dept}
                    label={dept}
                    size="small"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Team Utilization
              </Typography>
              <Typography variant="h4">
                {project.team_utilization}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average allocation
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Members Table */}
        <Grid item xs={12}>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Member</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Allocation</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {project.team.map((member: TeamMember) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={member.avatar}
                            sx={{ width: 32, height: 32, mr: 2 }}
                          />
                          <Box>
                            <Typography variant="subtitle2">
                              {member.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {member.title}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {member.allocation}%
                          </Typography>
                          <Box
                            sx={{
                              width: 100,
                              backgroundColor: theme.palette.grey[200],
                              borderRadius: 1,
                              height: 4,
                            }}
                          >
                            <Box
                              sx={{
                                width: `${member.allocation}%`,
                                backgroundColor: theme.palette.primary.main,
                                borderRadius: 1,
                                height: '100%',
                              }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" sx={{ mr: 1 }}>
                          <MailIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <PhoneIcon fontSize="small" />
                        </IconButton>
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

export default ProjectTeam;
