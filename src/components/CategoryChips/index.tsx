import { Box, Chip, Skeleton, Stack } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { categoryService } from "../../services/categoryService";
import { Category } from "../../types/category";
import { useQuery } from "@tanstack/react-query";
import { Response } from "../../types/response";

interface CategoryChipsProps {
    handleCategoryClick: (cat: Category | null) => void;
    category: Category | null;
}

function CategoryChip({handleCategoryClick, category}: CategoryChipsProps) {
    const { data, isLoading, error, refetch, isRefetching } = useQuery<Response<Category[]>>({
        queryKey: ['categories'],
        queryFn: () => categoryService.getAll(),
    });

   if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Chip
                    icon={<RefreshIcon />}
                    label={isRefetching ? 'Retrying...' : "Couldn't load categories. Retry"}
                    color="error"
                    variant="outlined"
                    onClick={() => refetch()}
                    disabled={isRefetching}
                    clickable
                />
            </Box>
        )
    }

    return (
        <>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1, overflowX: "auto" }}>
                
                {isLoading ? (
                    <Stack direction="row" spacing={1}>
                        <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: '16px' }} />
                        <Skeleton variant="rounded" width={96} height={32} sx={{ borderRadius: '16px' }} />
                        <Skeleton variant="rounded" width={72} height={32} sx={{ borderRadius: '16px' }} />
                    </Stack>
                ) : (
                    <>
                        <Chip key="all" label="All" color={category === null ? "primary" : "default"} variant={category === null ? "filled" : "outlined"} onClick={() => handleCategoryClick(null)} clickable />
                        {data?.data?.map((cat) => (
                            <Chip
                                key={cat.id}
                                label={cat.name}
                                color={category?.id === cat.id ? "primary" : "default"}
                                variant={category?.id === cat.id ? "filled" : "outlined"}
                                onClick={() => handleCategoryClick(cat)}
                                clickable
                            />
                        ))}
                    </>
                )}
            </Stack>
        </>
    )
}

export default CategoryChip;
