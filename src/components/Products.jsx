import { useTranslation } from "react-i18next";
import { ProductPreview } from "./ProductPreview";

export const Products = ({ products, isProductsLoading, productsError }) => {
  const { t } = useTranslation("productsPage");
  return (
    <div className="grid grid-cols-3 gap-5 p-2">
      {isProductsLoading
        ? t("products.loading")
        : productsError
        ? t("products.failure")
        : products?.map((product) => (
            <ProductPreview key={product?.id} product={product} />
          ))}
    </div>
  );
};
