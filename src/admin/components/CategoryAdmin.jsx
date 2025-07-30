import { useEffect, useState } from 'react';
import { BiEdit } from 'react-icons/bi';
import { MdDeleteForever } from 'react-icons/md';
import toast from 'react-hot-toast';
import {
  getFullCategory,
  getCategoryById,
  createCategory,
  editCategoryById,
  deleteCategoryById,
  createImg,
} from '../../api/api';

function CategoryAdmin() {
  const [categoryList, setCategoryList] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name_az: '',
    name_en: '',
    name_ru: '',
    img: [''],
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setDisplayed(
      categoryList.filter(c =>
        c.name_az.toLowerCase().includes(term) ||
        c.name_en.toLowerCase().includes(term) ||
        c.name_ru.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, categoryList]);

  async function loadCategories() {
    try {
      const data = await getFullCategory();
      setCategoryList(data);
    } catch {
      toast.error("Kateqoriyalar yüklənmədi!");
    }
  }

  const openForm = async id => {
    setEditId(id);
    setFile(null);
    if (id) {
      try {
        const data = await getCategoryById(id);
        setFormData({
          name_az: data.name_az || '',
          name_en: data.name_en || '',
          name_ru: data.name_ru || '',
          img: data.img || [''],
        });
      } catch {
        toast.error("Redaktə üçün məlumat tapılmadı");
      }
    } else {
      setFormData({ name_az: '', name_en: '', name_ru: '', img: [''] });
    }
    setFormOpen(true);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let imgArr = formData.img;
      if (file) {
        const imgRes = await createImg(file);
        imgArr = [`https://api.xezernn.com.az${imgRes.file.path}`];
      }
      const payload = {
        name_az: formData.name_az,
        name_en: formData.name_en,
        name_ru: formData.name_ru,
        img: imgArr,
      };
      if (editId) {
        await editCategoryById(editId, payload);
        toast.success("Kateqoriya yeniləndi");
      } else {
        await createCategory(payload);
        toast.success("Yeni kateqoriya əlavə olundu");
      }
      await loadCategories();
      setFormOpen(false);
    } catch {
      toast.error("Əməliyyat zamanı xəta baş verdi");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    setLoading(true);
    try {
      await deleteCategoryById(deleteId);
      toast.success("Kateqoriya silindi");
      await loadCategories();
    } catch {
      toast.error("Silinmə zamanı xəta baş verdi");
    } finally {
      setDeletePopup(false);
      setLoading(false);
    }
  }

  function resetSearch() {
    setSearchTerm('');
  }

  return (
    <main className="p-4">
      <h1 className="text-center text-2xl font-semibold my-6">
        Kateqoriyaların idarə olunması
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Axtar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3"
        />
        <button
          onClick={resetSearch}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
        >
          Reset
        </button>
        <button
          onClick={() => openForm(null)}
          className="ml-auto bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Yüklənir...' : '+ Kateqoriya əlavə et'}
        </button>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Ad (AZ / EN / RU)</th>
            <th className="border px-4 py-2">Şəkil</th>
            <th className="border px-4 py-2">Əməliyyatlar</th>
          </tr>
        </thead>
        <tbody>
          {displayed.length > 0 ? (
            displayed.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  <div>AZ: {item.name_az}</div>
                  <div>EN: {item.name_en}</div>
                  <div>RU: {item.name_ru}</div>
                </td>
                <td className="border px-4 py-2">
                  {item.img?.[0] && (
                    <img
                      src={item.img[0]}
                      alt=""
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="space-x-4 border flex justify-center items-center px-4 py-2 text-2xl min-h-[108px]">
                  <BiEdit
                    className="cursor-pointer text-blue-600"
                    onClick={() => openForm(item.id)}
                  />
                  <MdDeleteForever
                    className="cursor-pointer text-red-600"
                    onClick={() => {
                      setDeleteId(item.id);
                      setDeletePopup(true);
                    }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="border px-4 py-6 text-center">
                Kateqoriya mövcud deyil
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {formOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white p-6 rounded-lg w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">
              {editId ? 'Kateqoriyanı redaktə et' : 'Yeni kateqoriya əlavə et'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Ad (AZ)"
                value={formData.name_az}
                onChange={e =>
                  setFormData({ ...formData, name_az: e.target.value })
                }
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Ad (EN)"
                value={formData.name_en}
                onChange={e =>
                  setFormData({ ...formData, name_en: e.target.value })
                }
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Ad (RU)"
                value={formData.name_ru}
                onChange={e =>
                  setFormData({ ...formData, name_ru: e.target.value })
                }
                required
                className="w-full border p-2 rounded"
              />
              <div>
                <label className="block mb-1 font-medium">Şəkil yüklə</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setFile(e.target.files[0])}
                  className="w-full"
                />
                {(file || formData.img[0]) && (
                  <img
                    src={file ? URL.createObjectURL(file) : formData.img[0]}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded mt-2"
                  />
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Bağla
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  {loading ? 'Yüklənir...' : 'Yadda saxla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4 text-red-700">
              Silmək istədiyinizə əminsiniz?
            </h3>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeletePopup(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Xeyr
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                {loading ? 'Silinir...' : 'Bəli'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default CategoryAdmin;
