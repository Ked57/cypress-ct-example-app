import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";
import { fetchCategories, fetchProductsByCategory } from "../api";
import { Categories } from "../components/Categories";
import { DarkModeSelector } from "../components/DarkModeSelector";
import { Products } from "../components/Products";

export async function loader({ params }) {
  return params.category;
}

export const ProductsByCategoryPage = () => {
  const category = useLoaderData();

  const {
    data: products,
    isLoading: isProductsLoading,
    error: productsError,
  } = useQuery(["products", category], () => fetchProductsByCategory(category));

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery(["categories"], fetchCategories);

  return (
    <div className="flex flex-row">
      <div className="flex  flex-col flex-shrink-0 w-96">
        <DarkModeSelector />
        <div className="border shadow-lg dark:border-gray-500 mx-2" />
        <Categories
          categories={categories}
          isLoading={isCategoriesLoading}
          error={categoriesError}
        />
      </div>
      <Products
        products={products}
        isProductsLoading={isProductsLoading}
        productsError={productsError}
      />
    </div>
  );
};
