import React, { useState } from 'react';
import {
  Box,
  InputBase,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Popper,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Business as ProjectIcon,
  Description as DocumentIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: 'project' | 'document' | 'person';
  title: string;
  subtitle: string;
  path: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setAnchorEl(event.currentTarget);

    // Mock search results - replace with actual API call
    if (value.length > 2) {
      setResults([
        {
          id: '1',
          type: 'project',
          title: 'Office Building Construction',
          subtitle: 'In Progress - 75% Complete',
          path: '/projects/1',
        },
        {
          id: '2',
          type: 'document',
          title: 'Site Safety Guidelines',
          subtitle: 'PDF - Last updated 2 days ago',
          path: '/documents/2',
        },
        {
          id: '3',
          type: 'person',
          title: 'John Smith',
          subtitle: 'Project Manager',
          path: '/hr/employees/3',
        },
      ]);
    } else {
      setResults([]);
    }
  };

  const handleResultClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <ProjectIcon />;
      case 'document':
        return <DocumentIcon />;
      case 'person':
        return <PersonIcon />;
      default:
        return <SearchIcon />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
      <Paper
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: 600,
        }}
      >
        <IconButton disabled sx={{ p: '10px' }}>
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search projects, documents, people..."
          value={query}
          onChange={handleSearch}
          autoFocus
        />
        <IconButton sx={{ p: '10px' }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Paper>

      <Popper
        open={results.length > 0}
        anchorEl={anchorEl}
        placement="bottom-start"
        sx={{ width: anchorEl?.clientWidth, zIndex: theme.zIndex.modal }}
      >
        <Paper elevation={3}>
          <List>
            {results.map((result) => (
              <ListItem
                key={result.id}
                button
                onClick={() => handleResultClick(result.path)}
              >
                <ListItemIcon>{getIcon(result.type)}</ListItemIcon>
                <ListItemText
                  primary={result.title}
                  secondary={result.subtitle}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Popper>
    </Box>
  );
};

export default SearchBar;
