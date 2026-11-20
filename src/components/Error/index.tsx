import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { alpha, Box, Button, Stack, Typography } from '@mui/material';

interface ErrorPageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  onGoHome?: () => void;
  fullScreen?: boolean;
}

export function ErrorPage({
  title = 'Something went wrong',
  message = "We couldn't load the page data. Please check your connection and try again.",
  onRetry,
  isRetrying = false,
  onGoHome,
  fullScreen = true,
}: ErrorPageProps) {
  return (
    <Box
      role="alert"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: fullScreen ? '100vh' : '60vh',
        width: '100%',
        px: 3,
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
          bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
          color: 'error.main',
        }}
      >
        <ErrorOutlineRoundedIcon sx={{ fontSize: 34 }} />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 420, mb: 3 }}
      >
        {message}
      </Typography>

      {(onRetry || onGoHome) && (
        <Stack direction="row" spacing={1.5}>
          {onRetry && (
            <Button
              variant="contained"
              startIcon={<RefreshRoundedIcon />}
              onClick={onRetry}
              disabled={isRetrying}
            >
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </Button>
          )}

          {onGoHome && (
            <Button variant="outlined" onClick={onGoHome}>
              Back to Home
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
}