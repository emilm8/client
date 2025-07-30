import React, { useEffect, useState } from "react";
import { CiEdit, CiTrash } from "react-icons/ci";
import { FaEye, FaEyeSlash, FaPlus } from "react-icons/fa6";
import toast from "react-hot-toast";
import {
  getProducts,
  createProduct,
  deleteProductById,
  editProduct,
  createImg,
  getFullCategory,
  getFullSubcategory,
} from "../../api/api";

export default function AddProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allSubcats, setAllSubcats] = useState([]);
  const [filteredSubcats, setFilteredSubcats] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterSubcat, setFilterSubcat] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [togglePopup, setTogglePopup] = useState(false);
  const [toggleMode, setToggleMode] = useState("deactivate");
  const [loading, setLoading] = useState(false);
  const [delId, setDelId] = useState(null);
  const [toggleId, setToggleId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState({
    name_az: "",
    name_en: "",
    name_ru: "",
    description_az: "",
    description_en: "",
    description_ru: "",
    categoryId: "",
    subcategoryId: "",
    price: "",
    ingridients: "",
    sizes: "",
    status: true,
    isStok: false,
    imgUrls: []
  });

  useEffect(() => {
    async function loadFilters() {
      try {
        const [cats, subs] = await Promise.all([
          getFullCategory(),
          getFullSubcategory()
        ]);
        setCategories(cats);
        setAllSubcats(subs);
      } catch {
        toast.error("Yükləmə xətası");
      }
    }
    loadFilters();
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setFilteredSubcats(
          filterCat
            ? allSubcats.filter(s => s.categoryId === Number(filterCat))
            : []
        );
        const params = { page };
        if (filterCat) params.categoryId = filterCat;
        if (filterSubcat) params.subcategoryId = filterSubcat;
        const res = await getProducts(page, params);
        setProducts(res.products);
        setTotalPages(res.page.totalPages);
      } catch {
        toast.error("Yükləmə xətası");
      }
    }
    loadData();
  }, [page, filterCat, filterSubcat, allSubcats]);

  useEffect(() => {
    if (form.categoryId) {
      setFilteredSubcats(
        allSubcats.filter(s => s.categoryId === Number(form.categoryId))
      );
    } else {
      setFilteredSubcats([]);
    }
    setForm(f => ({ ...f, subcategoryId: "" }));
  }, [form.categoryId, allSubcats]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function handleFilterCat(e) {
    setFilterCat(e.target.value);
    setFilterSubcat("");
    setPage(1);
  }

  function handleFilterSubcat(e) {
    setFilterSubcat(e.target.value);
    setPage(1);
  }

  function openPopup(p = null) {
    if (p) {
      setEditId(p.id);
      setForm({
        name_az: p.name_az,
        name_en: p.name_en,
        name_ru: p.name_ru,
        description_az: p.description_az,
        description_en: p.description_en,
        description_ru: p.description_ru,
        categoryId: String(p.categoryId),
        subcategoryId: String(p.subcategoryId),
        price: p.price,
        ingridients: p.ingridients.join(","),
        sizes: p.sizes.join(","),
        status: !!p.status,
        isStok: !!p.isStok,
        imgUrls: p.img
      });
      setImageFile(null);
    } else {
      setEditId(null);
      setForm({
        name_az: "",
        name_en: "",
        name_ru: "",
        description_az: "",
        description_en: "",
        description_ru: "",
        categoryId: "",
        subcategoryId: "",
        price: "",
        ingridients: "",
        sizes: "",
        status: true,
        isStok: false,
        imgUrls: []
      });
      setImageFile(null);
    }
    setPopupOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let imgArr = form.imgUrls;
      if (imageFile) {
        const imgRes = await createImg(imageFile);
        imgArr = [`https://api.xezernn.com.az${imgRes.file.path}`];
      }
      const payload = {
        ...form,
        price: parseFloat(form.price),
        ingridients: ['kofe'],
        sizes: form.sizes.split(",").map(s => s.trim()),
        status: form.status,
        isStok: Boolean(form.isStok),
        categoryId: Number(form.categoryId),
        subcategoryId: Number(form.subcategoryId),
        img: imgArr
      };
      if (editId) {
        await editProduct(editId, payload);
      } else {
        await createProduct(payload);
      }
      toast.success(editId ? "Məhsul yeniləndi" : "Məhsul əlavə edildi");
      setPopupOpen(false);
      const res = await getProducts(page, { categoryId: filterCat, subcategoryId: filterSubcat });
      setProducts(res.products);
    } catch {
      toast.error("Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteProductById(delId);
      toast.success("Məhsul silindi");
      setDeletePopup(false);
      const res = await getProducts(page, { categoryId: filterCat, subcategoryId: filterSubcat });
      setProducts(res.products);
    } catch {
      toast.error("Silinmə xətası");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus() {
    setLoading(true);
    try {
      const prod = products.find(p => p.id === toggleId);
      const payload = {
        name_az: prod.name_az,
        name_en: prod.name_en,
        name_ru: prod.name_ru,
        description_az: prod.description_az,
        description_en: prod.description_en,
        description_ru: prod.description_ru,
        categoryId: prod.categoryId,
        subcategoryId: prod.subcategoryId,
        price: prod.price,
        ingridients: ['kofe'],
        sizes: prod.sizes,
        status: toggleMode === "activate",
        isStok: Boolean(prod.isStok),
        img: prod.img
      };
      await editProduct(toggleId, payload);
      toast.success(toggleMode === "activate" ? "Məhsul aktiv edildi" : "Məhsul deaktiv edildi");
      setTogglePopup(false);
      const res = await getProducts(page, { categoryId: filterCat, subcategoryId: filterSubcat });
      setProducts(res.products);
    } catch {
      toast.error("Status dəyişmədi");
    } finally {
      setLoading(false);
    }
  }

  const displayed = products
    .filter(p => !filterCat || p.categoryId === Number(filterCat))
    .filter(p => !filterSubcat || p.subcategoryId === Number(filterSubcat))
    .filter(p => {
      if (!search) return true;
      const q = search.trim().toLowerCase();
      return (
        p.name_az.toLowerCase().includes(q) ||
        p.name_en.toLowerCase().includes(q) ||
        p.name_ru.toLowerCase().includes(q)
      );
    })
    .filter(p => {
      if (minPrice && p.price < parseFloat(minPrice)) return false;
      if (maxPrice && p.price > parseFloat(maxPrice)) return false;
      return true;
    });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-4">
        <h1 className="text-2xl font-semibold">Məhsullar</h1>
        <div className="flex gap-2 flex-wrap">
          <select value={filterCat} onChange={handleFilterCat} className="border p-2 pr-8 rounded">
            <option value="">Bütün kateqoriyalar</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name_az}</option>)}
          </select>
          <select value={filterSubcat} onChange={handleFilterSubcat} className="border p-2 pr-8 rounded" disabled={!filterCat}>
            <option value="">Bütün subkateqoriyalar</option>
            {filteredSubcats.map(s => <option key={s.id} value={s.id}>{s.name_az}</option>)}
          </select>
          <input type="text" placeholder="Axtar..." value={search} onChange={e => setSearch(e.target.value)} className="border p-2 rounded w-48"/>
          <input type="number" placeholder="Min ₼" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="border p-2 rounded w-24"/>
          <input type="number" placeholder="Max ₼" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="border p-2 rounded w-24"/>
          <button onClick={() => { setFilterCat(""); setFilterSubcat(""); setSearch(""); setMinPrice(""); setMaxPrice(""); setPage(1); }} className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400">Reset</button>
          <button onClick={() => openPopup()} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"><FaPlus/> Əlavə et</button>
        </div>
      </div>

      <table className="w-full text-sm border text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Şəkil</th>
            <th className="p-2">Ad (AZ)</th>
            <th className="p-2">Ad (EN)</th>
            <th className="p-2">Ad (RU)</th>
            <th className="p-2">Qiymət</th>
            <th className="p-2">Status</th>
            <th className="p-2">Əməliyyatlar</th>
          </tr>
        </thead>
        <tbody>
          {displayed.length > 0 ? displayed.map(p => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-2"><img src={p.img[0]} alt="" className="w-12 h-12 object-cover rounded mx-auto"/></td>
              <td className="p-2">{p.name_az}</td>
              <td className="p-2">{p.name_en}</td>
              <td className="p-2">{p.name_ru}</td>
              <td className="p-2">{p.price} ₼</td>
              <td className="p-2">
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  p.status
                    ? "bg-[#F1F2ED] text-[#919660]"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {p.status ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-2 flex justify-center items-center gap-5">
                <button onClick={() => {
                  setToggleId(p.id);
                  setToggleMode(p.status ? "deactivate" : "activate");
                  setTogglePopup(true);
                }}><span className="text-xl">{p.status ? <FaEye/> : <FaEyeSlash/>}</span></button>
                <button onClick={() => openPopup(p)}><CiEdit className="text-xl text-blue-600"/></button>
                <button onClick={() => { setDelId(p.id); setDeletePopup(true); }}><CiTrash className="text-xl text-red-600"/></button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan={7} className="p-4 text-center">Məhsul mövcud deyil</td></tr>
          )}
        </tbody>
      </table>

      {deletePopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <p className="mb-4">Silmək istədiyinizə əminsiniz?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeletePopup(false)} className="px-4 py-2 bg-gray-300 rounded">Xeyr</button>
              <button onClick={handleDelete} disabled={loading} className="px-4 py-2 bg-red-500 text-white rounded">Bəli</button>
            </div>
          </div>
        </div>
      )}

      {togglePopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xs">
            <p className="mb-4 text-center">
              {toggleMode === "deactivate"
                ? "Bu məhsulu deaktiv etmək istədiyinizə əminsiniz?"
                : "Bu məhsulu aktiv etmək istədiyinizə əminsiniz?"}
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setTogglePopup(false)} className="px-4 py-2 bg-gray-300 rounded">Xeyr</button>
              <button onClick={handleToggleStatus} disabled={loading} className="px-4 py-2 bg-red-500 text-white rounded">Bəli</button>
            </div>
          </div>
        </div>
      )}

      {popupOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div onClick={e => e.stopPropagation()} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">{editId ? "Redaktə Et" : "Yeni Məhsul"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <input name="name_az" value={form.name_az} onChange={handleChange} placeholder="Ad (AZ)" className="w-full border p-2 rounded" required/>
              <input name="name_en" value={form.name_en} onChange={handleChange} placeholder="Ad (EN)" className="w-full border p-2 rounded" required/>
              <input name="name_ru" value={form.name_ru} onChange={handleChange} placeholder="Ad (RU)" className="w-full border p-2 rounded" required/>
              <label>Şəkil</label>
              <div className="flex items-center gap-4">
                {form.imgUrls[0] && !imageFile && <img src={form.imgUrls[0]} alt="" className="w-24 h-24 object-cover rounded"/>}
                {imageFile && <img src={URL.createObjectURL(imageFile)} alt="" className="w-24 h-24 object-cover rounded"/>}
                <input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files[0])}/>
              </div>
              <textarea name="description_az" value={form.description_az} onChange={handleChange} placeholder="Təsvir (AZ)" className="w-full border p-2 rounded h-20"/>
              <textarea name="description_en" value={form.description_en} onChange={handleChange} placeholder="Təsvir (EN)" className="w-full border p-2 rounded h-20"/>
              <textarea name="description_ru" value={form.description_ru} onChange={handleChange} placeholder="Təsvir (RU)" className="w-full border p-2 rounded h-20"/>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full border p-2 rounded" required>
                <option value="">Kateqoriya seçin</option>
                {categories.map(c=> <option key={c.id} value={c.id}>{c.name_az}</option>)}
              </select>
              <select name="subcategoryId" value={form.subcategoryId} onChange={handleChange} className="w-full border p-2 rounded" required disabled={!form.categoryId}>
                <option value="">Subkateqoriya seçin</option>
                {filteredSubcats.map(s=> <option key={s.id} value={s.id}>{s.name_az}</option>)}
              </select>
              <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Qiymət" className="w-full border p-2 rounded" required/>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={()=>setPopupOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Bağla</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading?"Yüklənir...":(editId?"Yenilə":"Əlavə et")}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 w-full bg-white py-3 shadow-inner flex justify-center items-center gap-4 z-40">
  <button
    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
    disabled={page === 1}
    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
  >
    Prev
  </button>
  <span>{page} / {totalPages}</span>
  <button
    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
    disabled={page === totalPages}
    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>
    </>
  );
}
