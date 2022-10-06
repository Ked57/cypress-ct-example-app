import { useTranslation } from "react-i18next";

export const ProductPreview = ({ product }) => {
  const { t } = useTranslation("productPreview");
  return (
    <div className="flex flex-row p-1 gap-x-5 rounded-md shadow-lg dark:shadow-sm dark:shadow-gray-500 cursor-pointer dark:bg-gray-500">
      <img src={product?.image} height={50} width={50} className="w-16 h-16" />
      <div className="flex flex-col">
        <h1 className="truncate text-ellipsis w-96">{product?.title}</h1>
        <span>{product?.price}$</span>
        <span>
          {t("rating", {
            rate: product?.rating?.rate,
            count: product?.rating?.count,
          })}
        </span>
      </div>
    </div>
  );
};
