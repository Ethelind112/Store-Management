import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  PersonOutlined as PersonOutlineIcon,
  LockOutlined as LockOutlinedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  PointOfSale as PointOfSaleIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ROUTE } from '../../constants/route';
import { AuthFormErrors, LoginFormValues } from '../../types/auth';

export const LoginPage: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  const [formValues, setFormValues] = useState<LoginFormValues>({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const redirectPath =
    (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTE.CASHIER;

  const handleChange = (field: keyof LoginFormValues) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: AuthFormErrors = {};

    if (!formValues.username.trim()) {
      newErrors.username = 'Username wajib diisi';
    }

    if (!formValues.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formValues.password.length < 3) {
      newErrors.password = 'Password minimal 3 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await login({
        username: formValues.username.trim(),
        password: formValues.password,
      });

      navigate(redirectPath, { replace: true });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Gagal masuk. Periksa username dan password Anda.';
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        bgcolor: '#f4f6f8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 3 },
        boxSizing: 'border-box',
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 3.5,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
          bgcolor: '#ffffff',
          overflow: 'hidden',
        }}
      >
        <CardContent
          sx={{
            px: { xs: 3, sm: 4.5 },
            py: { xs: 3.5, sm: 4.5 },
            '&:last-child': {
              pb: { xs: 3.5, sm: 4.5 },
            },
          }}
        >
          {/* Brand Header */}
          <Box sx={{ textAlign: 'center', mb: 3.5 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2.5,
                bgcolor: 'primary.main',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                mb: 1.5,
                boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
              }}
            >
              <PointOfSaleIcon sx={{ fontSize: 30 }} />
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                letterSpacing: -0.5,
              }}
            >
              Bright Print
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Masuk untuk mengakses sistem kasir
            </Typography>
          </Box>

          {/* Error Alert */}
          {errors.general && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                fontSize: '0.875rem',
                '& .MuiAlert-message': { width: '100%' },
              }}
            >
              {errors.general}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              {/* Username Field */}
              <TextField
                fullWidth
                id="login-username"
                name="username"
                label="Username"
                variant="outlined"
                size="medium"
                value={formValues.username}
                onChange={handleChange('username')}
                error={Boolean(errors.username)}
                helperText={errors.username}
                disabled={isSubmitting}
                autoComplete="username"
                autoFocus
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon color={errors.username ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                  },
                }}
              />

              {/* Password Field */}
              <TextField
                fullWidth
                id="login-password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                size="medium"
                value={formValues.password}
                onChange={handleChange('password')}
                error={Boolean(errors.password)}
                helperText={errors.password}
                disabled={isSubmitting}
                autoComplete="current-password"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon color={errors.password ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                  },
                }}
              />

              {/* Remember Me Option */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Ingat sesi saya
                  </Typography>
                }
                sx={{ mt: -0.5 }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <LoginIcon />
                  )
                }
                sx={{
                  py: 1.4,
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2.5,
                  boxShadow: '0 4px 14px rgba(25, 118, 210, 0.28)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 6px 18px rgba(25, 118, 210, 0.38)',
                  },
                }}
              >
                {isSubmitting ? 'Memverifikasi...' : 'Masuk Sekarang'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
