// components/LoadingPage.tsx
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingPageProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingPage({
  message = 'Loading...',
  fullScreen = true,
}: LoadingPageProps) {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullScreen ? '100vh' : '100%',
        width: '100%',
        gap: 2,
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress size={44} thickness={4} />
      {message && (
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}