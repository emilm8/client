import { useState, useEffect } from 'react';
import {
  getFullCategory,
  getFullSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} from '../../api/api';
import { BiEdit } from 'react-icons/bi';
import { MdDeleteForever } from 'react-icons/md';
import toast from 'react-hot-toast';

function SubcategoryAdmin() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name_az: '', name_en: '', name_ru: '', categoryId: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let list = subcategories;
    if (filterCat) list = list.filter(s => s.categoryId === Number(filterCat));
    if (search) {
      const t = search.toLowerCase();
      list = list.filter(s =>
        s.name_az.toLowerCase().includes(t) ||
        s.name_en.toLowerCase().includes(t) ||
        s.name_ru.toLowerCase().includes(t)
      );
    }
    setFiltered(list);
  }, [search, filterCat, subcategories]);

  async function loadData() {
    try {
      const cats = await getFullCategory();
      const subs = await getFullSubcategory();
      setCategories(cats);
      setSubcategories(subs);
    } catch {
      toast.error('Veri yüklənmədi');
    }
  }

  const openForm = sub => {
    if (sub) {
      setEditingId(sub.id);
      setFormData({
        name_az: sub.name_az,
        name_en: sub.name_en,
        name_ru: sub.name_ru,
        categoryId: String(sub.categoryId)
      });
    } else {
      setEditingId(null);
      setFormData({ name_az: '', name_en: '', name_ru: '', categoryId: '' });
    }
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.categoryId) {
      alert('Kateqoriya seçilməyib!');
      return;
    }
    const payload = {
      name_az: formData.name_az,
      name_en: formData.name_en,
      name_ru: formData.name_ru,
      categoryId: Number(formData.categoryId)
    };
    setLoading(true);
    try {
      if (editingId) {
        await updateSubcategory(editingId, payload);
        toast.success('Subkategoriya yeniləndi');
      } else {
        await createSubcategory(payload);
        toast.success('Subkategoriya yaradıldı');
      }
      closeForm();
      await loadData();
    } catch {
      toast.error('Əməliyyat uğursuz oldu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Silmək istədiyinizə əminsiniz?')) return;
    try {
      await deleteSubcategory(id);
      toast.success('Subkategoriya silindi');
      await loadData();
    } catch {
      toast.error('Silinmə zamanı səhv');
    }
  };

  return (
    <main className="pt-10 px-4">
      <h1 className="text-2xl font-semibold text-center mb-6">Subkateqoriyalar</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Axtar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="border p-2 pr-8 rounded"
        >
          <option value="">Bütün kateqoriyalar</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name_az}</option>
          ))}
        </select>
        <button onClick={() => { setSearch(''); setFilterCat(''); }} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">Reset</button>
        <button onClick={() => openForm()} className="bg-green-600 text-white px-4 py-2 rounded ml-auto">+ Əlavə et</button>
      </div>
      
    <div className='overflow-x-auto'>
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Ad (AZ)</th>
            <th className="p-2">Ad (EN)</th>
            <th className="p-2">Ad (RU)</th>
            <th className="p-2">Kateqoriya</th>
            <th className="p-2">Əməliyyatlar</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center">Subkategoriya tapılmadı</td>
            </tr>
          ) : filtered.map(sub => {
            const cat = categories.find(c => c.id === sub.categoryId);
            return (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td className="p-2">{sub.name_az}</td>
                <td className="p-2">{sub.name_en}</td>
                <td className="p-2">{sub.name_ru}</td>
                <td className="p-2">{cat?.name_az || sub.categoryId}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => openForm(sub)}><BiEdit className="text-blue-600" size={20} /></button>
                  <button onClick={() => handleDelete(sub.id)}><MdDeleteForever className="text-red-600" size={20} /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div onClick={e => e.stopPropagation()} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl mb-4">{editingId ? 'Subkategoriya Redaktə Et' : 'Yeni Subkategoriya Əlavə Et'}</h2>
            <div className="space-y-3">
              <input name="name_az" value={formData.name_az} onChange={handleChange} placeholder="Ad (AZ)" className="border p-2 rounded w-full" />
              <input name="name_en" value={formData.name_en} onChange={handleChange} placeholder="Ad (EN)" className="border p-2 rounded w-full" />
              <input name="name_ru" value={formData.name_ru} onChange={handleChange} placeholder="Ad (RU)" className="border p-2 rounded w-full" />
              <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="border p-2 rounded w-full">
                <option value="">Kateqoriya seçin</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name_az}</option>
                ))}
              </select>
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={closeForm} className="bg-gray-300 px-4 py-2 rounded">Bağla</button>
                <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>
                  {editingId ? 'Yenilə' : 'Əlavə et'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default SubcategoryAdmin;
