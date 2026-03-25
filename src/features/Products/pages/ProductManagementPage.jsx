// src/features/Products/pages/ProductManagementPage.jsx
import React, { useState } from 'react';
import { Plus, Search, AlertCircle, Loader2 } from 'lucide-react';
import ProductTable from '../components/ProductTable';
import ProductForm  from '../components/ProductForm';
import Modal        from '../../../components/Modal/Modal';
import { Button }   from '../../../components';
import useProducts  from '../hooks/useProducts';
import './ProductManagementPage.css';

const ProductManagementPage = () => {
  const {
    products, loading, error,
    search,   setSearch,
    addProduct, updateProduct, deleteProduct,
  } = useProducts();

  const [isFormOpen,      setFormOpen]      = useState(false);
  const [editingProduct,  setEditingProduct] = useState(null);
  const [submitError,     setSubmitError]    = useState(null);
  const [isSubmitting,    setIsSubmitting]   = useState(false);

  const handleEdit  = (product) => { setEditingProduct(product); setFormOpen(true); };
  const handleClose = () => { setFormOpen(false); setEditingProduct(null); setSubmitError(null); };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (editingProduct) {
        // ✅ Pass full merged data — updateProduct handles toPayload internally
        await updateProduct(editingProduct.id, { ...editingProduct, ...data });
      } else {
        // ✅ No generateId() — backend assigns the ID
        await addProduct(data);
      }
      handleClose();
    } catch (err) {
      // ✅ Show backend validation errors (e.g. @NotBlank, @DecimalMin)
      const backendMsg = err?.response?.data?.message
        ?? err?.response?.data?.errors?.join(' | ')
        ?? err.message
        ?? 'حدث خطأ، حاول مرة أخرى';
      setSubmitError(backendMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      await deleteProduct(id);
    } catch (err) {
      alert(err?.response?.data?.message ?? 'فشل حذف المنتج');
    }
  };

  return (
    <div className="pm-page">
      <div className="pm-header">
        <h1 className="pm-title">إدارة المنتجات</h1>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => setFormOpen(true)}>
          إضافة منتج
        </Button>
      </div>

      {/* Search */}
      <div className="pm-search">
        <Search size={16} className="search-ico" />
        <input
          className="pm-input"
          placeholder="بحث في المنتجات..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* API error banner */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#7f1d1d33', border: '1px solid #ef444466',
          borderRadius: 10, padding: '10px 14px', marginBottom: 16,
          fontFamily: 'Cairo', fontSize: 13, color: '#ef4444',
        }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60, color: '#6b7280' }}>
          <Loader2 size={28} style={{ animation: 'spin .8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}   // ✅ uses the async version
        />
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleClose}
        title={editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
        size="md"
      >
        {/* Backend submit error */}
        {submitError && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#7f1d1d33', border: '1px solid #ef444466',
            borderRadius: 8, padding: '8px 12px', marginBottom: 12,
            fontFamily: 'Cairo', fontSize: 12, color: '#ef4444',
          }}>
            <AlertCircle size={13} /> {submitError}
          </div>
        )}

        <ProductForm
          initial={editingProduct ?? undefined}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default ProductManagementPage;