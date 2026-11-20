import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterMenu from '../FilterMenu';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import CategoryChip from '../CategoryChips';
import { Category } from '../../types/category';

interface TopSearchBarProps {
    title: string;
    description: string;
    search: string;
    onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
    hasActiveFilters: boolean;
    draftMinPrice: string;
    setDraftMinPrice: Dispatch<SetStateAction<string>>;
    draftMaxPrice: string;
    setDraftMaxPrice: Dispatch<SetStateAction<string>>;
    draftSortBy: string;
    setDraftSortBy: Dispatch<SetStateAction<string>>;
    onApplyFilters: (category: Category | null) => void;
    onClearFilters: () => void;
    category?: Category | null;
    onCategoryChange: (cat: Category | null) => void;
}

const TopSearchBar = ({
    title,
    description,
    search,
    onSearchChange,
    hasActiveFilters,
    draftMinPrice,
    setDraftMinPrice,
    draftMaxPrice,
    setDraftMaxPrice,
    draftSortBy,
    setDraftSortBy,
    onApplyFilters,
    onClearFilters,
    category = null,
    onCategoryChange,
}: TopSearchBarProps) => {
    const [filterMenuAnchor, setFilterMenuAnchor] = useState<HTMLElement | null>(null);

    return (
        <Box 
            sx={{
                display: "grid",
                gap: 3
            }}
        >
            <Box sx={{ display: "grid", gap: 2}}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1 }} >
                            {title}
                        </Typography>

                        <Typography variant="caption" sx={{ color: "gray" }} >
                            {description}
                        </Typography>
                    </Box>

                    <Box sx={{ width: '50%', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Cari produk"
                            value={search}
                            onChange={onSearchChange}
                            sx={{ 
                                width: "80%",
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '20px',
                                    background: 'white',
                                    '& fieldset': { borderColor: 'transparent' },
                                    '&:hover fieldset': { borderColor: 'transparent' },
                                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                }
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <IconButton
                            color={hasActiveFilters ? "primary" : "default"}
                            sx={{ 
                                backgroundColor: hasActiveFilters ? 'primary.main' : 'white',
                                color: hasActiveFilters ? 'primary.contrastText' : 'inherit',
                                '&:hover': { backgroundColor: hasActiveFilters ? 'primary.dark' : 'action.hover' },
                            }}
                            onClick={(event) => setFilterMenuAnchor(event.currentTarget)}
                            aria-label="Open filters"
                        >
                            <FilterListIcon />
                        </IconButton>
                        
                        <FilterMenu
                            anchorEl={filterMenuAnchor}
                            onClose={() => setFilterMenuAnchor(null)}
                            hasActiveFilters={hasActiveFilters}
                            draftSortBy={draftSortBy}
                            setDraftSortBy={setDraftSortBy}
                            draftMinPrice={draftMinPrice}
                            setDraftMinPrice={setDraftMinPrice}
                            draftMaxPrice={draftMaxPrice}
                            setDraftMaxPrice={setDraftMaxPrice}
                            onApply={() => {
                                onApplyFilters(category);
                                setFilterMenuAnchor(null);
                            }}
                            onClear={() => {
                                onClearFilters();
                                setFilterMenuAnchor(null);
                            }}
                        />
                    </Box>
                </Box>
            </Box>

            <CategoryChip handleCategoryClick={onCategoryChange} category={category} />
        </Box>
    )
}

export default TopSearchBar;
