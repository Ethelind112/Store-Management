import CheckIcon from "@mui/icons-material/Check";
import { Box, Button, InputAdornment, Menu, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface FilterMenuProps {
    options: { key: string; label: string }[];
    anchorEl: HTMLElement | null;
    onClose: () => void;
    hasActiveFilters: boolean;
    draftSortBy: string;
    setDraftSortBy: Dispatch<SetStateAction<string>>;
    draftMinPrice: string;
    setDraftMinPrice: Dispatch<SetStateAction<string>>;
    draftMaxPrice: string;
    setDraftMaxPrice: Dispatch<SetStateAction<string>>;
    onApply: () => void;
    onClear: () => void;
}

function FilterMenu({
    options,
    anchorEl,
    onClose,
    hasActiveFilters,
    draftSortBy,
    setDraftSortBy,
    draftMinPrice,
    setDraftMinPrice,
    draftMaxPrice,
    setDraftMaxPrice,
    onApply,
    onClear,
}: FilterMenuProps) {
    return (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>Filter</Typography>
                {hasActiveFilters && (
                    <Button
                        disableRipple
                        onClick={onClear}
                        sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            textDecoration: "underline",
                            color: "gray",
                            p: 0,
                            minWidth: 0,
                            "&:hover": { color: "primary.main", backgroundColor: "transparent", textDecoration: "underline" },
                        }}
                    >
                        Clear
                    </Button>
                )}
            </Box>

            <Box sx={{ px: 2, py: 1, display: "flex", gap: 1 }}>
                <TextField
                    size="small"
                    type="number"
                    label="Min price"
                    value={draftMinPrice}
                    onChange={(event) => setDraftMinPrice(event.target.value)}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start">Rp</InputAdornment> } }}
                />
                <TextField
                    size="small"
                    type="number"
                    label="Max price"
                    value={draftMaxPrice}
                    onChange={(event) => setDraftMaxPrice(event.target.value)}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start">Rp</InputAdornment> } }}
                />
            </Box>

            {options.map((option) => (
                <MenuItem
                    key={option.key}
                    selected={draftSortBy === option.key}
                    onClick={() => setDraftSortBy(draftSortBy === option.key ? "" : option.key)}
                >
                    {option.label}
                    {draftSortBy === option.key && <CheckIcon fontSize="small" sx={{ ml: "auto" }} />}
                </MenuItem>
            ))}

            <Stack direction="row" sx={{ px: 2, mt: 1, justifyContent: "flex-end" }}>
                <Button
                    onClick={onApply}
                    variant="contained"
                    disableElevation
                    sx={{ textTransform: "none", fontWeight: 600, px: 3, borderRadius: 2, width: "100%" }}
                >
                    Apply
                </Button>
            </Stack>
        </Menu>
    );
}

export default FilterMenu;
