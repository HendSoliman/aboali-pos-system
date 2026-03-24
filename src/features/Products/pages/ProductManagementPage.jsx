import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import Modal from '../../../components/Modal/Modal';
import { Button } from '../../../components';
import useProducts from '../hooks/useProducts';
import { generateId } from '../../../utils/helpers';
import './ProductManagementPage.css';

const ProductManagementPage = () => {
  const { products, search, setSearch, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEdit = (product) => { setEditingProduct(product); setFormOpen(true); };
  const handleClose = () => { setFormOpen(false); setEditingProduct(null); };

  const handleSubmit = (data) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct({ ...data, id: generateId(), price: Number(data.price), stock: Number(data.stock) });
    }
    handleClose();
  };

  return (
    <div className="pm-page">
      <div className="pm-header">
        <h1 className="pm-title">إدارة المنتجات</h1>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => setFormOpen(true)}>
          إضافة منتج
        </Button>
      </div>

      <div className="pm-search">
        <Search size={16} className="search-ico" />
        <input
          className="pm-input"
          placeholder="بحث في المنتجات..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ProductTable products={products} onEdit={handleEdit} onDelete={deleteProduct} />

      <Modal
        isOpen={isFormOpen}
        onClose={handleClose}
        title={editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
        size="md"
      >
        <ProductForm
          initial={editingProduct || undefined}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </Modal>
    </div>
  );
};

export default ProductManagementPage;