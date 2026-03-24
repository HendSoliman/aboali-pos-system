import { useState, useMemo } from 'react';
import { useProductStore } from '../../../store/appStore';
import { debounce } from '../../../utils/helpers';
import { CATEGORY_ALL } from '../../../config/constants';

const useProducts = () => {
  const { products, categories } = useProductStore();
  const [searchQuery,      setSearchQuery]      = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_ALL);

  const filteredProducts = useMemo(() => {
    let list = products;
    if (selectedCategory !== CATEGORY_ALL)
      list = list.filter((p) => p.category === selectedCategory);
    if (searchQuery.trim())
      list = list.filter(
        (p) =>
          p.name.includes(searchQuery) ||
          p.barcode?.includes(searchQuery)
      );
    return list;
  }, [products, selectedCategory, searchQuery]);

  const handleSearch   = debounce((v) => setSearchQuery(v), 250);
  const handleCategory = (cat) => setSelectedCategory(cat);

  return {
    products: filteredProducts,
    categories,
    selectedCategory,
    searchQuery,
    handleSearch,
    handleCategory,
  };
};

export default useProducts;
