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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  PersonOutlined as PersonOutlineIcon,
  LockOutlined as LockOutlinedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/Auth/AuthLayout';
import { ROUTE } from '../../constants/route';
import { AuthFormErrors, RegisterFormValues } from '../../types/auth';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<RegisterFormValues>({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'cashier',
  });

  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (field: keyof RegisterFormValues) => (
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
    } else if (formValues.username.trim().length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
    }

    if (!formValues.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formValues.password.length < 4) {
      newErrors.password = 'Password minimal 4 karakter';
    }

    if (!formValues.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = 'Password dan konfirmasi tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage(null);

    try {
      await register({
        username: formValues.username.trim(),
        password: formValues.password,
        role: formValues.role,
      });

      setSuccessMessage('Registrasi berhasil! Mengalihkan ke halaman masuk...');

      // Redirect to login page after brief confirmation
      setTimeout(() => {
        navigate(ROUTE.LOGIN);
      }, 1500);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Gagal melakukan pendaftaran. Silakan coba lagi.';
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      mode="register"
      title="Daftar Akun Baru"
      subtitle="Buat akun untuk kasir atau admin toko Bright Print."
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

      {successMessage && (
        <Alert
          icon={<CheckCircleIcon fontSize="inherit" />}
          severity="success"
          sx={{
            mb: 3,
            borderRadius: 2,
            fontSize: '0.875rem',
            '& .MuiAlert-message': { width: '100%' },
          }}
        >
          {successMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.2}>
          {/* Username Field */}
          <TextField
            fullWidth
            id="register-username"
            name="username"
            label="Username"
            variant="outlined"
            size="medium"
            value={formValues.username}
            onChange={handleChange('username')}
            error={Boolean(errors.username)}
            helperText={errors.username}
            disabled={isSubmitting || Boolean(successMessage)}
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
            id="register-password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            size="medium"
            value={formValues.password}
            onChange={handleChange('password')}
            error={Boolean(errors.password)}
            helperText={errors.password}
            disabled={isSubmitting || Boolean(successMessage)}
            autoComplete="new-password"
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

          {/* Confirm Password Field */}
          <TextField
            fullWidth
            id="register-confirm-password"
            name="confirmPassword"
            label="Konfirmasi Password"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            size="medium"
            value={formValues.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            disabled={isSubmitting || Boolean(successMessage)}
            autoComplete="new-password"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color={errors.confirmPassword ? 'error' : 'action'} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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

          {/* Role Selection */}
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5,
              }}
            >
              Peran Pengguna (Role)
            </FormLabel>
            <RadioGroup
              row
              value={formValues.role}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, role: e.target.value }))
              }
            >
              <FormControlLabel
                value="cashier"
                control={<Radio size="small" />}
                label={<Typography variant="body2">Kasir</Typography>}
                disabled={isSubmitting || Boolean(successMessage)}
              />
              <FormControlLabel
                value="admin"
                control={<Radio size="small" />}
                label={<Typography variant="body2">Admin Toko</Typography>}
                disabled={isSubmitting || Boolean(successMessage)}
              />
            </RadioGroup>
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting || Boolean(successMessage)}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <PersonAddIcon />
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
            {isSubmitting ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </Button>

          {/* Switch to Login Link */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Sudah memiliki akun?{' '}
              <Link
                component={RouterLink}
                to={ROUTE.LOGIN}
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Masuk di sini
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;
