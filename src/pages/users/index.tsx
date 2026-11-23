import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Snackbar,
  Skeleton,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  PersonOutlined as PersonOutlineIcon,
  LockOutlined as LockOutlinedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Close as CloseIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthFormErrors, RegisterFormValues } from '../../types/auth';
import { useUsers } from './hooks';
import { ErrorPage } from '../../components/Error';

// ─── Role helpers ─────────────────────────────────────────────────────────────

function getRoleLabel(role: string) {
  switch (role) {
    case 'SUPER_ADMIN':
    case 'super_admin':
      return 'Super Admin';
    case 'ADMIN':
    case 'admin':
      return 'Admin';
    default:
      return 'Kasir';
  }
}

function getRoleColor(role: string): 'error' | 'warning' | 'primary' | 'default' {
  switch (role) {
    case 'SUPER_ADMIN':
    case 'super_admin':
      return 'error';
    case 'ADMIN':
    case 'admin':
      return 'warning';
    default:
      return 'primary';
  }
}

// ─── Add User Dialog ──────────────────────────────────────────────────────────

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (username: string) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, onClose, onSuccess }) => {
  const register = useAuthStore((state) => state.register);
  const currentUser = useAuthStore((state) => state.user);

  const [formValues, setFormValues] = useState<RegisterFormValues>({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'cashier',
  });
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormValues({ username: '', password: '', confirmPassword: '', role: 'cashier' });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleChange = (field: keyof RegisterFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
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
    try {
      await register({
        username: formValues.username.trim(),
        password: formValues.password,
        role: formValues.role,
      });
      onSuccess(formValues.username.trim());
      resetForm();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mendaftarkan pengguna.';
      setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          fontWeight: 700,
          fontSize: '1.1rem',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddIcon color="primary" />
          Tambah Pengguna Baru
        </Box>
        <IconButton size="small" onClick={handleClose} disabled={isSubmitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Operator saat ini:{' '}
            <strong>{currentUser?.username}</strong> (Peran: <em>{getRoleLabel(currentUser?.role ?? '')}</em>)
          </Typography>

          {errors.general && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {errors.general}
            </Alert>
          )}

          <Stack spacing={2.5}>
            {/* Username */}
            <TextField
              fullWidth
              label="Username Pengguna"
              variant="outlined"
              size="small"
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
                      <PersonOutlineIcon fontSize="small" color={errors.username ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password Akun"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              size="small"
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
                      <LockOutlinedIcon fontSize="small" color={errors.password ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            {/* Confirm Password */}
            <TextField
              fullWidth
              label="Konfirmasi Password"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              size="small"
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
                      <LockOutlinedIcon fontSize="small" color={errors.confirmPassword ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            {/* Role */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: '#f8fafc',
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'text.primary', mb: 1 }}>
                  Peran Pengguna (Role)
                </FormLabel>
                <RadioGroup
                  row
                  value={formValues.role}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, role: e.target.value }))}
                >
                  <FormControlLabel
                    value="cashier"
                    control={<Radio size="small" />}
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Kasir</Typography>
                        <Typography variant="caption" color="text.secondary">Transaksi kasir</Typography>
                      </Box>
                    }
                    disabled={isSubmitting}
                    sx={{ mr: 2 }}
                  />
                  <FormControlLabel
                    value="admin"
                    control={<Radio size="small" />}
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Admin</Typography>
                        <Typography variant="caption" color="text.secondary">Kelola produk</Typography>
                      </Box>
                    }
                    disabled={isSubmitting}
                    sx={{ mr: 2 }}
                  />
                  <FormControlLabel
                    value="super_admin"
                    control={<Radio size="small" />}
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Super Admin</Typography>
                        <Typography variant="caption" color="text.secondary">Akses penuh</Typography>
                      </Box>
                    }
                    disabled={isSubmitting}
                  />
                </RadioGroup>
              </FormControl>
            </Paper>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isSubmitting}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <PersonAddIcon />}
            sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
          >
            {isSubmitting ? 'Mendaftarkan...' : 'Daftarkan Pengguna'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

// ─── User Management Page ─────────────────────────────────────────────────────

export default function UserManagementPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, error, totalPages, totalData, refetch, isRefetching, search, setSearch, currentPage, setCurrentPage, handleDeleteUser } = useUsers();

  if (error) {
      return <ErrorPage onRetry={refetch} isRetrying={isRefetching} />;
    }
    
  return (
    <Container disableGutters sx={{ display: 'grid', gap: 4, py: 2.5, px: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
              Manajemen Pengguna
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'gray', mt: 0.5, display: 'block' }}>
            Kelola seluruh akun pengguna sistem
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Search */}
          <TextField
            size="small"
            placeholder="Cari pengguna..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearch(searchInput.trim());
              }
            }}
            sx={{
              width: 240,
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                background: 'white',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Add User Button */}
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setAddDialogOpen(true)}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              px: 2.5,
              boxShadow: '0 4px 14px rgba(25, 118, 210, 0.25)',
            }}
          >
            Tambah Pengguna
          </Button>
        </Box>
      </Box>

      {/* ── Users Table ── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Username
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Role
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, width: 80 }}
                >
                  Aksi
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                    <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={70} height={24} /></TableCell>
                    <TableCell align="center"><Skeleton variant="circular" width={32} height={32} sx={{ mx: 'auto' }} /></TableCell>
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                    <GroupIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {search ? 'Tidak ada pengguna yang sesuai dengan pencarian.' : 'Belum ada data pengguna.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((user, index) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      bgcolor: index % 2 === 0 ? 'white' : 'rgba(0,0,0,0.015)',
                      '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.04)' },
                      transition: 'background-color 0.15s',
                    }}
                  >
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}
                      >
                        {user.id}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            flexShrink: 0,
                          }}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user.username}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={getRoleLabel(user.role)}
                        size="small"
                        color={getRoleColor(user.role)}
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="Hapus pengguna (belum tersedia)" arrow>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteUser(user.id)}
                            sx={{
                              color: 'text.disabled',
                              cursor: 'not-allowed',
                              '&:hover': { color: 'text.disabled', bgcolor: 'transparent' },
                            }}
                            aria-label={`Hapus ${user.username}`}
                          >
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer info */}
        {!isLoading && data.length > 0 && (
          <Box
            sx={{
              px: 3,
              py: 1.5,
              borderTop: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Menampilkan <strong>{data.length}</strong> dari <strong>{totalData}</strong> pengguna
              {search && ` (filter: "${search}")`}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* ── Add User Dialog ── */}
      <AddUserDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={() => refetch}
      />
    </Container>
  );
}
