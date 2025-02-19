import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ResponsivePie } from '@nivo/pie';

interface ProgressChartProps {
  value: number;
  total: number;
  label: string;
  size?: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  value,
  total,
  label,
  size = 120,
}) => {
  const theme = useTheme();
  const percentage = Math.round((value / total) * 100);

  const data = [
    {
      id: 'completed',
      value: value,
      color: theme.palette.primary.main,
    },
    {
      id: 'remaining',
      value: total - value,
      color: theme.palette.grey[200],
    },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <Typography variant="h4" component="div">
          {percentage}%
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Box>
      <ResponsivePie
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        innerRadius={0.8}
        padAngle={0}
        cornerRadius={0}
        activeOuterRadiusOffset={8}
        colors={{ datum: 'data.color' }}
        enableArcLabels={false}
        enableArcLinkLabels={false}
        isInteractive={false}
      />
    </Box>
  );
};

export default ProgressChart;
