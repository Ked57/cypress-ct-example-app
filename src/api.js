const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw response;
  }
  return response.json();
};

export const fetchCategories = () =>
  fetcher("https://fakestoreapi.com/products/categories");

export const fetchProductsByCategory = (category) =>
  fetcher(
    category
      ? `https://fakestoreapi.com/products/category/${category}`
      : `https://fakestoreapi.com/products`
  );
