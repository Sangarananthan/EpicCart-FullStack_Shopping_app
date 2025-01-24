import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import { SlidersHorizontal } from "lucide-react";
import { Separator } from "../components/ui/separator";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Card, CardContent } from "../components/ui/card";
import ProductCard from "./products/ProductCard";
import { useGetCategoriesQuery } from "../redux/api/categoryApiSlice";
import { Checkbox } from "../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { use } from "react";

const PRODUCTS_PER_PAGE = 12;

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );
  const [priceFilter, setPriceFilter] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: getFilteredProducts, isLoading: isFilteredProductsLoading } =
    useGetFilteredProductsQuery({
      checked,
      radio,
    });

  const {
    data: categoriesQuery,
    refetch,
    isLoading: isCategoriesLoading,
  } = useGetCategoriesQuery();
  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!isCategoriesLoading) {
      dispatch(setCategories(categoriesQuery));
    }
  }, [categoriesQuery, dispatch]);

  useEffect(() => {
    if (!isFilteredProductsLoading && getFilteredProducts) {
      let filteredProducts = [...getFilteredProducts];

      // Apply price filter
      if (priceFilter) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price <= parseInt(priceFilter, 10)
        );
      }

      // Apply brand filter
      if (selectedBrand) {
        filteredProducts = filteredProducts.filter(
          (product) => product.brand === selectedBrand
        );
      }

      //Apply category filter
      if (selectedCategory) {
        filteredProducts = filteredProducts.filter(
          (product) => product.category === selectedCategory
        );
      }

      dispatch(setProducts(filteredProducts));
    }
  }, [
    checked,
    radio,
    getFilteredProducts,
    dispatch,
    priceFilter,
    selectedBrand,
    isFilteredProductsLoading,
    selectedCategory,
  ]);

  const handleCheck = (checked, id) => {
    setSelectedCategory(id);
    // const updatedChecked = checked ? [checked, id] : null;
    dispatch(setChecked(id));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand === selectedBrand ? "" : brand);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleReset = () => {
    dispatch(setChecked([]));
    dispatch(setRadio([]));
    setSelectedBrand("");
    setPriceFilter("");
    setCurrentPage(1);
    setSelectedCategory("");
  };

  const handlePriceFilter = (e) => {
    const value = e.target.value;
    // Ensure only numeric input
    if (/^\d*$/.test(value)) {
      setPriceFilter((state) => (state === value ? "" : value));
    }
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        getFilteredProducts
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  // Pagination calculations
  const totalPages = Math.ceil((products?.length || 0) / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories Section */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-3">
          {categories?.map((c) => (
            <div key={c._id} className="flex items-center space-x-2">
              <Checkbox
                id={c._id}
                checked={checked.includes(c._id)}
                onCheckedChange={(checked) => handleCheck(checked, c._id)}
              />
              <label
                htmlFor={c._id}
                className="text-sm text-gray-600 dark:text-gray-300"
              >
                {c.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brands Section */}
      <div>
        <h3 className="font-semibold mb-3">Brands</h3>
        <RadioGroup value={selectedBrand} onValueChange={handleBrandClick}>
          {uniqueBrands?.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <RadioGroupItem value={brand} id={brand} />
              <label
                htmlFor={brand}
                className="text-sm text-gray-600 dark:text-gray-300"
              >
                {brand}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* Price Filter */}
      <div>
        <h3 className="font-semibold mb-3">Price</h3>
        <Input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter maximum price"
          value={priceFilter}
          onChange={handlePriceFilter}
          className="w-full"
        />
      </div>

      <Button variant="outline" className="w-full" onClick={handleReset}>
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 mt-[3rem] md:px-[2rem]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Explore Products</h1>

        {/* Mobile Filters */}
        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="max-h-[calc(100vh-100px)] overflow-y-scroll">
              <FiltersContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Desktop Filters */}
        <Card className="hidden lg:block lg:col-span-3">
          <CardContent className="p-6">
            <FiltersContent />
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="lg:col-span-9">
          {isFilteredProductsLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts?.map((p) => (
                  <ProductCard key={p._id} p={p} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
