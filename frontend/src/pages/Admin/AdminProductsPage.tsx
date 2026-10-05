import React, { useState } from 'react';
import {
  useAdminProducts,
  useApproveProduct,
  useRejectProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUpdateProductStock,
} from '@/api/admin.api';
import { StatusPill } from '@/components/shared/StatusPill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/formatters';
import {
  Package,
  Check,
  X,
  Plus,
  Search,
  Filter,
  Star,
  Trash2,
  Edit2,
  Upload,
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const { data: products } = useAdminProducts();
  const approveMutation = useApproveProduct();
  const rejectMutation = useRejectProduct();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const stockMutation = useUpdateProductStock();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_review' | 'active' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // New/Edit product form state
  const [productForm, setProductForm] = useState({
    title: '',
    brand: '',
    basePrice: '',
    discountPercent: '',
    category: 'women-ethnic',
    description: '',
  });

  const filteredProducts = (products || []).filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Products Management</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Review supplier submissions, approve catalog items, and manage variant stock
          </p>
        </div>
        <Button
          type="button"
          variant="accent"
          size="default"
          onClick={() => setIsDrawerOpen(true)}
          className="font-bold gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface p-4 rounded-card border border-border shadow-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder="Search by title, brand, or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending_review', label: 'Pending Review' },
            { id: 'active', label: 'Active' },
            { id: 'rejected', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-pill text-xs font-bold transition-colors ${
                statusFilter === tab.id
                  ? 'bg-primary text-surface'
                  : 'bg-background text-text-muted hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-[11px] font-bold text-text-muted uppercase bg-background border-b border-border">
                <th className="p-4">Product Details</th>
                <th className="p-4">Supplier</th>
                <th className="p-4">Price / MRP</th>
                <th className="p-4">Inventory</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((p) => {
                const imgUrl = p.images?.[0]?.url || '';
                const isOutOfStock = p.stock === 0;

                return (
                  <tr key={p._id} className="hover:bg-background/40 transition-colors">
                    {/* Title & Thumbnail */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={imgUrl}
                          alt=""
                          className="w-12 h-14 object-cover rounded-input bg-background border border-border shrink-0"
                        />
                        <div className="max-w-xs">
                          <span className="text-[10px] font-bold text-text-muted uppercase">{p.brand}</span>
                          <p className="font-extrabold text-text-primary line-clamp-1">{p.title}</p>
                          <p className="text-[11px] text-text-muted">Slug: {p.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Supplier */}
                    <td className="p-4 font-medium text-text-primary">
                      {typeof p.seller === 'object' ? p.seller.storeName : 'Surat Hub Direct'}
                    </td>

                    {/* Price & Quick Price Edit */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-accent">{formatPrice(p.finalPrice)}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newPrice = prompt(`Enter new selling price (₹) for "${p.title}":`, String(p.finalPrice));
                            if (newPrice && !isNaN(Number(newPrice)) && Number(newPrice) > 0) {
                              updateMutation.mutate({ id: p._id, updates: { finalPrice: Number(newPrice) } });
                            }
                          }}
                          className="p-1 text-text-muted hover:text-accent rounded hover:bg-background transition-colors"
                          title="Edit Selling Price"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-text-muted line-through text-[11px]">
                        {formatPrice(p.basePrice)}
                      </span>
                    </td>

                    {/* Inventory & Out-of-Stock Toggle */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isOutOfStock ? 'text-danger' : 'text-success'}`}>
                          {isOutOfStock ? '0 (Out of stock)' : `${p.stock ?? 25} pcs`}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newStock = isOutOfStock ? 25 : 0;
                            stockMutation.mutate({ id: p._id, stock: newStock });
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                            isOutOfStock
                              ? 'border-success text-success hover:bg-success/10'
                              : 'border-danger text-danger hover:bg-danger/10'
                          }`}
                          title={isOutOfStock ? 'Click to Restock (25 pcs)' : 'Click to Mark Out of Stock'}
                        >
                          {isOutOfStock ? 'Restock' : 'Set 0'}
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <StatusPill status={p.status} />
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.status !== 'active' && (
                          <button
                            type="button"
                            onClick={() => approveMutation.mutate(p._id)}
                            className="p-1.5 bg-success/10 hover:bg-success hover:text-surface text-success rounded-input transition-colors"
                            title="Approve Product (Make Live)"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {p.status !== 'rejected' && (
                          <button
                            type="button"
                            onClick={() => rejectMutation.mutate({ id: p._id, reason: 'Does not meet catalog quality standard' })}
                            className="p-1.5 bg-amber-500/10 hover:bg-amber-500 hover:text-surface text-amber-600 rounded-input transition-colors"
                            title="Reject Product (Hide from Catalog)"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to permanently delete "${p.title}"?`)) {
                              deleteMutation.mutate(p._id);
                            }
                          }}
                          className="p-1.5 bg-danger/10 hover:bg-danger hover:text-surface text-danger rounded-input transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Add Product Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-primary/60 backdrop-blur-xs" onClick={() => setIsDrawerOpen(false)} />
          <aside className="relative w-full max-w-lg bg-surface h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-extrabold text-primary">Add New Marketplace Product</h3>
              <button onClick={() => setIsDrawerOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const base = Number(productForm.basePrice) || 999;
                const disc = Number(productForm.discountPercent) || 0;
                createMutation.mutate({
                  title: productForm.title,
                  brand: productForm.brand,
                  basePrice: base,
                  discountPercent: disc,
                  finalPrice: Math.round(base * (1 - disc / 100)),
                  category: productForm.category,
                  description: productForm.description,
                  status: 'active',
                  stock: 30,
                });
                setIsDrawerOpen(false);
                setProductForm({
                  title: '',
                  brand: '',
                  basePrice: '',
                  discountPercent: '',
                  category: 'women-ethnic',
                  description: '',
                });
              }}
              className="space-y-4 text-xs"
            >
              <div className="space-y-1">
                <label className="font-bold text-text-primary">Product Title *</label>
                <Input
                  required
                  placeholder="e.g. Pure Cotton Embroidered Kurti"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">Brand Name *</label>
                  <Input
                    required
                    placeholder="e.g. Libas"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">Category</label>
                  <select
                    className="w-full h-10 px-3 rounded-input border border-border bg-surface text-xs font-bold"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="women-ethnic">Women Ethnic</option>
                    <option value="men-fashion">Men Fashion</option>
                    <option value="footwear">Footwear</option>
                    <option value="home-kitchen">Home & Kitchen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">Base MRP (₹) *</label>
                  <Input
                    type="number"
                    required
                    placeholder="1499"
                    value={productForm.basePrice}
                    onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">Discount Percent (%)</label>
                  <Input
                    type="number"
                    placeholder="65"
                    value={productForm.discountPercent}
                    onChange={(e) => setProductForm({ ...productForm, discountPercent: e.target.value })}
                  />
                </div>
              </div>

              {/* Variant Table (Size / Colour / SKU / Stock) */}
              <div className="space-y-2 pt-2">
                <label className="font-bold text-text-primary block">Variants & Real-time Stock</label>
                <div className="p-3 bg-background rounded-card border border-border space-y-2 text-[11px]">
                  <div className="grid grid-cols-4 font-bold text-text-muted pb-1 border-b border-border">
                    <span>Size</span>
                    <span>Colour</span>
                    <span>SKU</span>
                    <span>Stock</span>
                  </div>
                  {[
                    { size: 'S', col: 'Maroon', sku: 'SKU-MAR-S', stock: 25 },
                    { size: 'M', col: 'Maroon', sku: 'SKU-MAR-M', stock: 50 },
                    { size: 'L', col: 'Maroon', sku: 'SKU-MAR-L', stock: 30 },
                  ].map((v) => (
                    <div key={v.sku} className="grid grid-cols-4 font-medium">
                      <span>{v.size}</span>
                      <span>{v.col}</span>
                      <span className="text-text-muted">{v.sku}</span>
                      <span className="font-bold text-success">{v.stock} pcs</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mock Image Upload Area */}
              <div className="p-4 border-2 border-dashed border-border rounded-card text-center space-y-1.5 hover:border-accent cursor-pointer transition-colors">
                <Upload className="h-6 w-6 text-accent mx-auto" />
                <p className="font-bold text-text-primary">Drop product photos here or click to browse</p>
                <p className="text-[10px] text-text-muted">JPEG, PNG, WebP up to 5MB each (Max 8 images)</p>
              </div>

              <div className="pt-3 flex gap-2">
                <Button type="submit" variant="accent" size="lg" className="flex-1 font-bold">
                  Publish to Catalog
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setIsDrawerOpen(false)}
                  className="font-bold"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
};
