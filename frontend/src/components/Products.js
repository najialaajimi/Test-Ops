import React, { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../services/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', categoryId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([productAPI.getAll(), categoryAPI.getAll()]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await productAPI.create({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) });
      setForm({ name: '', description: '', price: '', stock: '', categoryId: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      fetchData();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const getCategoryName = (id) => categories.find(c => c._id === id)?.name || id;

  return (
    <div className="section">
      <h2>Products</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="form">
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Price" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
        <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
        <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Add Product'}</button>
      </form>
      <table>
        <thead>
          <tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{getCategoryName(p.categoryId)}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.stock}</td>
              <td><button onClick={() => handleDelete(p._id)} className="btn-danger">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;
