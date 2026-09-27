import { Chip, Stack } from "@mui/material";
import { useCategories } from "./hooks";

interface CategoryChipsProps {
    handleCategoryClick: (cat: string) => void;
    category: string;
}

function CategoryChip({handleCategoryClick, category}: CategoryChipsProps) {
    const categories = useCategories();

    return (
        <>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1, overflowX: "auto" }}>
                <Chip key="all" label="All" color={category === "All" ? "primary" : "default"} variant={category === "All" ? "filled" : "outlined"} onClick={() => handleCategoryClick("All")} clickable />
                {categories?.map((cat) => (
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
