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
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Container,
  Card,
  CardContent,
  Divider,
  Snackbar,
} from '@mui/material';
import {
  PersonOutlined as PersonOutlineIcon,
  LockOutlined as LockOutlinedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ROUTE } from '../../constants/route';
import { AuthFormErrors, RegisterFormValues } from '../../types/auth';

export const RegisterPage: React.FC = () => {
  const register = useAuthStore((state) => state.register);
  const user = useAuthStore((state) => state.user);
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
  const [errorSnackbar, setErrorSnackbar] = useState<boolean>(false);
  const [errorSnackbarMsg, setErrorSnackbarMsg] = useState<string>('');
  const [successSnackbar, setSuccessSnackbar] = useState<boolean>(false);

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

      const successText = `Pengguna "${formValues.username.trim()}" dengan role "${formValues.role}" berhasil didaftarkan!`;
      setSuccessMessage(successText);
      setSuccessSnackbar(true);
      setFormValues({
        username: '',
        password: '',
        confirmPassword: '',
        role: 'cashier',
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Gagal melakukan pendaftaran pengguna. Silakan coba lagi.';
      setErrors({ general: errorMessage });
      setErrorSnackbarMsg(errorMessage);
      setErrorSnackbar(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container disableGutters sx={{ display: 'grid', gap: 3, py: 2.5, px: 5 }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AdminPanelSettingsIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
              Tambah Pengguna Baru
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'gray', mt: 0.5, display: 'block' }}>
            Hanya Admin dan Super Admin yang berwenang menambahkan akun kasir atau pengelola baru
          </Typography>
        </Box>

        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          size="small"
          onClick={() => navigate(ROUTE.CASHIER)}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Kembali ke Kasir
        </Button>
      </Box>

      {/* Main Registration Card */}
      <Card
        elevation={0}
        sx={{
          maxWidth: 680,
          borderRadius: 3,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Formulir Pendaftaran Akun
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Operator saat ini:{' '}
              <strong>{user?.username}</strong> (Peran: <em>{user?.role}</em>)
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {errors.general && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                fontSize: '0.875rem',
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
              }}
            >
              {successMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              {/* Username Field */}
              <TextField
                fullWidth
                id="register-username"
                name="username"
                label="Username Pengguna"
                variant="outlined"
                value={formValues.username}
                onChange={handleChange('username')}
                error={Boolean(errors.username)}
                helperText={errors.username}
                disabled={isSubmitting}
                autoComplete="off"
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
                label="Password Akun"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={formValues.password}
                onChange={handleChange('password')}
                error={Boolean(errors.password)}
                helperText={errors.password}
                disabled={isSubmitting}
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
                value={formValues.confirmPassword}
                onChange={handleChange('confirmPassword')}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                disabled={isSubmitting}
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
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: '#f8fafc',
                  borderRadius: 2.5,
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                }}
              >
                <FormControl component="fieldset">
                  <FormLabel
                    component="legend"
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 1,
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
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Kasir
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Akses transaksi kasir & penjualan
                          </Typography>
                        </Box>
                      }
                      disabled={isSubmitting}
                      sx={{ mr: 3 }}
                    />
                    <FormControlLabel
                      value="admin"
                      control={<Radio size="small" />}
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Admin
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Kelola produk & tambah kasir
                          </Typography>
                        </Box>
                      }
                      disabled={isSubmitting}
                      sx={{ mr: 3 }}
                    />
                    <FormControlLabel
                      value="super_admin"
                      control={<Radio size="small" />}
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Super Admin
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Hak akses penuh seluruh sistem
                          </Typography>
                        </Box>
                      }
                      disabled={isSubmitting}
                    />
                  </RadioGroup>
                </FormControl>
              </Paper>

              {/* Submit Button */}
              <Box sx={{ pt: 1, display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <PersonAddIcon />
                    )
                  }
                  sx={{
                    px: 4,
                    py: 1.3,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2.5,
                    boxShadow: '0 4px 14px rgba(25, 118, 210, 0.25)',
                  }}
                >
                  {isSubmitting ? 'Mendaftarkan...' : 'Daftarkan Pengguna'}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  disabled={isSubmitting}
                  onClick={() => {
                    setFormValues({
                      username: '',
                      password: '',
                      confirmPassword: '',
                      role: 'cashier',
                    });
                    setErrors({});
                    setSuccessMessage(null);
                  }}
                  sx={{
                    px: 3,
                    borderRadius: 2.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Reset Form
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Error snackbar (matching Cashier notification style, in red) */}
      <Snackbar
        open={errorSnackbar}
        autoHideDuration={4000}
        onClose={() => setErrorSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setErrorSnackbar(false)}
          severity="error"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {errorSnackbarMsg}
        </Alert>
      </Snackbar>

      {/* Success snackbar */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={4000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccessSnackbar(false)}
          severity="success"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterPage;
