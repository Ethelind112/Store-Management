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
  FormControlLabel,
  Checkbox,
  Chip,
  Paper,
} from '@mui/material';
import {
  PersonOutlined as PersonOutlineIcon,
  LockOutlined as LockOutlinedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  PointOfSale as PointOfSaleIcon,
  Inventory as InventoryIcon,
  ReceiptLong as ReceiptLongIcon,
  CheckCircleOutlined as CheckCircleOutlineIcon,
  ShieldOutlined as ShieldOutlinedIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ROUTE } from '../../constants/route';
import { AuthFormErrors, LoginFormValues } from '../../types/auth';

const highlights = [
  {
    icon: <PointOfSaleIcon sx={{ color: '#90caf9', fontSize: 22 }} />,
    title: 'Transaksi Kasir Cepat',
    desc: 'Dukungan pembayaran tunai, QRIS, dan debit secara instan.',
  },
  {
    icon: <InventoryIcon sx={{ color: '#90caf9', fontSize: 22 }} />,
    title: 'Katalog & Stok Terpadu',
    desc: 'Monitoring kategori dan persediaan produk secara real-time.',
  },
  {
    icon: <ReceiptLongIcon sx={{ color: '#90caf9', fontSize: 22 }} />,
    title: 'Cetak Struk Otomatis',
    desc: 'Format cetak struk kasir rapi siap pakai untuk pelanggan.',
  },
];

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
        width: '100vw',
        minHeight: '100vh',
        m: 0,
        p: 0,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: '#f4f6f8',
        overflowX: 'hidden',
      }}
    >
      {/* ─── Left Brand Hero Panel (Full Screen Half) ─── */}
      <Box
        sx={{
          flex: { xs: 'none', md: '0 0 50%', lg: '0 0 52%' },
          background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)',
          color: '#ffffff',
          p: { xs: 4, sm: 6, md: 8 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 280, md: '100vh' },
        }}
      >
        {/* Decorative background shapes */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 320,
            height: 320,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -60,
            left: -60,
            width: 260,
            height: 260,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.04)',
            pointerEvents: 'none',
          }}
        />

        {/* Brand Header */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.18)',
                p: 1.25,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              }}
            >
              <PointOfSaleIcon sx={{ fontSize: 36, color: '#ffffff' }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                Bright Print
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}
              >
                Point of Sale & Kasir Pintar
              </Typography>
            </Box>
          </Box>

          {/* Key Features (Visible on md and up) */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, mt: 8 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#ffffff',
                mb: 3,
                lineHeight: 1.3,
              }}
            >
              Sistem Kasir Modern, Cepat & Handal untuk Bisnis Anda
            </Typography>

            <Stack spacing={3}>
              {highlights.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 1.5,
                    borderRadius: 2.5,
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      p: 1,
                      borderRadius: 2,
                      display: 'flex',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ffffff' }}>
                      {item.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(255, 255, 255, 0.8)', display: 'block' }}
                    >
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Bottom Security Note */}
        <Box sx={{ position: 'relative', zIndex: 1, mt: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.25,
              bgcolor: 'rgba(0, 0, 0, 0.18)',
              px: 2,
              py: 1,
              borderRadius: 2,
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#81c784' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.95)' }}>
              Akses aman berbasis JWT token • Terintegrasi Cloud POS
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ─── Right Login Portal Form (Full Screen Half) ─── */}
      <Box
        sx={{
          flex: { xs: 1, md: '0 0 50%', lg: '0 0 48%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 6, md: 8 },
          bgcolor: '#ffffff',
          minHeight: { md: '100vh' },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          {/* Top Form Header */}
          <Box sx={{ mb: 4 }}>
            <Chip
              icon={<ShieldOutlinedIcon sx={{ fontSize: '1rem !important' }} />}
              label="Portal Akses Kasir"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600, mb: 2, borderRadius: 1.5 }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                letterSpacing: -0.5,
                mb: 1,
              }}
            >
              Masuk ke Sistem
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>
              Masukkan username dan password Anda untuk memulai sesi kasir.
            </Typography>
          </Box>

          {/* Error Message */}
          {errors.general && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2.5,
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
                      Ingat sesi saya di perangkat ini
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
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2.5,
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(25, 118, 210, 0.4)',
                  },
                }}
              >
                {isSubmitting ? 'Memverifikasi Kredensial...' : 'Masuk Sekarang'}
              </Button>
            </Stack>
          </Box>

          {/* Admin Notice */}
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 2,
              borderRadius: 2.5,
              bgcolor: 'rgba(25, 118, 210, 0.04)',
              border: '1px dashed rgba(25, 118, 210, 0.25)',
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.4 }}>
              Pendaftaran akun kasir baru hanya dapat dilakukan oleh <strong>Admin</strong> atau <strong>Super Admin</strong> melalui menu Pengaturan Pengguna.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
