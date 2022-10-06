import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const Categories = ({ categories, isLoading, error }) => {
  const { t } = useTranslation("productsPage");
  return (
    <nav className="flex flex-col gap-y-2 p-2">
      <Link
        to={"/"}
        className="p-1 rounded-md shadow-lg dark:shadow-sm dark:shadow-gray-500 cursor-pointer dark:bg-gray-500 cursor-pointer"
      >
        home
      </Link>
      {isLoading
        ? t("categories.loading")
        : error
        ? t("categories.failure")
        : categories?.map((category) => (
            <Link
              to={`/${category}`}
              key={category}
              className="p-1 rounded-md shadow-lg dark:shadow-sm dark:shadow-gray-500 cursor-pointer dark:bg-gray-500 cursor-pointer"
            >
              {category}
            </Link>
          ))}
    </nav>
  );
};
