import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
  Link,
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
} from '@mui/icons-material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/Auth/AuthLayout';
import { ROUTE } from '../../constants/route';
import { AuthFormErrors, LoginFormValues } from '../../types/auth';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
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

  // Retrieve destination route if redirected by ProtectedRoute
  const redirectPath =
    (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTE.CASHIER;

  const handleChange = (field: keyof LoginFormValues) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    // Clear field-specific error as user types
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

      // Navigate to destination on success
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
    <AuthLayout
      mode="login"
      title="Selamat Datang Kembali"
      subtitle="Silakan masuk untuk mengelola transaksi dan stok produk."
    >
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
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
            />
          </Box>

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
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2.5,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.35)',
              },
            }}
          >
            {isSubmitting ? 'Memverifikasi...' : 'Masuk Sekarang'}
          </Button>

          {/* Switch to Register Link */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Belum memiliki akun?{' '}
              <Link
                component={RouterLink}
                to={ROUTE.REGISTER}
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Daftar sekarang
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;
