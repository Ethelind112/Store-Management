import {
  Box,
  Button,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, WarningAmber as WarningAmberIcon } from '@mui/icons-material';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, overflow: 'hidden' } } }}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle
        id="confirm-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1.5,
          fontWeight: 700,
          fontSize: '1.1rem',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon color="warning" />
          {title}
        </Box>
        <IconButton size="small" onClick={onCancel} disabled={loading} aria-label="Close dialog">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2, pb: 3 }}>
        <Box id="confirm-dialog-description" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          {message}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onCancel} disabled={loading} sx={{ borderRadius: 2, fontWeight: 700, px: 2.5 }}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
