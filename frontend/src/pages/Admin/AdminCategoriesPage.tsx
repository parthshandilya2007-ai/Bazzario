import React, { useState } from 'react';
import { useCategories } from '@/api/categories.api';
import { useCreateCategory, useDeleteCategory } from '@/api/admin.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit2, FolderTree, CheckCircle2 } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const { data: categories } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Category Hierarchy</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Organize multi-level category trees and catalog navigation
          </p>
        </div>
        <Button
          type="button"
          variant="accent"
          size="default"
          onClick={() => setIsAdding(true)}
          className="font-bold gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {isAdding && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim() && slug.trim()) {
              createCategoryMutation.mutate({ name: name.trim(), slug: slug.trim() });
              setName('');
              setSlug('');
              setIsAdding(false);
            }
          }}
          className="p-5 bg-surface rounded-card border border-border shadow-card space-y-4 max-w-lg"
        >
          <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider">
            Create Marketplace Category
          </h3>
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">Category Name *</label>
            <Input
              required
              placeholder="e.g. Traditional Footwear"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
              }}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">URL Slug *</label>
            <Input required value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="accent" size="sm" className="font-bold">
              Save Category
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(false)}
              className="font-bold"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="text-[11px] font-bold text-text-muted uppercase bg-background border-b border-border">
              <th className="p-4">Category</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Level</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories?.map((cat) => (
              <tr key={cat._id} className="hover:bg-background/40">
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={cat.image?.url || ''}
                    alt=""
                    className="w-10 h-10 rounded-pill object-cover border border-border bg-background"
                  />
                  <span className="font-extrabold text-text-primary">{cat.name}</span>
                </td>
                <td className="p-4 font-mono text-text-muted">/category/{cat.slug}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded-pill bg-primary/10 text-primary text-[10px] font-bold">
                    Depth: {cat.depth}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-success font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Active
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete category "${cat.name}"?`)) {
                          deleteCategoryMutation.mutate(cat.slug);
                        }
                      }}
                      className="p-1.5 rounded text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
