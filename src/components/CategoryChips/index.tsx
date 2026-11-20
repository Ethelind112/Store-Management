import { Chip, Skeleton, Stack } from "@mui/material";
import { categoryService } from "../../services/categoryService";
import { Category } from "../../types/category";
import { useQuery } from "@tanstack/react-query";
import { Response } from "../../types/response";
import { LoadingPage } from "../Loading";

interface CategoryChipsProps {
    handleCategoryClick: (cat: string) => void;
    category: string;
}

function CategoryChip({handleCategoryClick, category}: CategoryChipsProps) {
    const { data, isLoading, error } = useQuery<Response<Category[]>>({
        queryKey: ['categories'],
        queryFn: () => categoryService.getAll(),
    });

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
                        <Chip key="all" label="All" color={category === "All" ? "primary" : "default"} variant={category === "All" ? "filled" : "outlined"} onClick={() => handleCategoryClick("All")} clickable />
                        {data?.data?.map((cat) => (
                            <Chip
                                key={cat.id}
                                label={cat.name}
                                color={category === cat.name ? "primary" : "default"}
                                variant={category === cat.name ? "filled" : "outlined"}
                                onClick={() => handleCategoryClick(cat.name)}
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
