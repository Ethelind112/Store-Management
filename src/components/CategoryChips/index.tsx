import { Chip, Stack } from "@mui/material";
import { categoryService } from "../../services/categoryService";
import { Category } from "../../types/category";
import { useQuery } from "@tanstack/react-query";
import { Response } from "../../types/response";

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
            </Stack>
        </>
    )
}

export default CategoryChip;
