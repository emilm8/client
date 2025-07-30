import toast from "react-hot-toast";
import { axiosInstance, axiosInstanceMultiPart } from "../config/axiosInstance";

export async function getFullCategory() {
  try {
    const response = await axiosInstance.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Categoriyalarin gelmeyinde problem oldu:', error.response?.data || error.message);
    throw error;
  }
}

export async function getFullSubcategory() {
  try {
    const response = await axiosInstance.get('/categories/subcategories');
    return response.data;
  } catch (error) {
    console.error('Subcategoriyalarin gelmeyinde problem oldu:', error.response?.data || error.message);
    throw error;
  }
}

export async function createCategory(categoryData) {
  try {
    const response = await axiosInstance.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Kategoriya yaradilarken problem oldu:', error.response?.data || error.message);
    throw error;
  }
}

export async function getCategoryById(id) {
  try {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Kategoriya getirilemedi:', error.response?.data || error.message);
    throw error;
  }
}

export async function editCategoryById(id, categoryData) {
  try {
    const response = await axiosInstance.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Kategoriya duzeltilemedi:', error.response?.data || error.message);
    throw error;
  }
}

export async function deleteCategoryById(id) {
  try {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Kategoriya silinemedi:', error.response?.data || error.message);
    throw error;
  }
}

export async function createSubcategory(subcategoryData) {
  try {
    const response = await axiosInstance.post('/categories/subcategory', subcategoryData);
    return response.data;
  } catch (error) {
    toast.error("Bu adda subkateqoriya artıq mövcuddur");
    throw error;
  }
}

export async function updateSubcategory(id, subcategoryData) {
  try {
    const response = await axiosInstance.put(`/categories/subcategory/${id}`, subcategoryData);
    return response.data;
  } catch (error) {
    console.error('Subcategory duzeltilemedi:', error.response?.data || error.message);
    throw error;
  }
}

export async function deleteSubcategory(id) {
  try {
    const response = await axiosInstance.delete(`/categories/subcategory/${id}`);
    return response.data;
  } catch (error) {
    console.error('Subcategory silinemedi:', error.response?.data || error.message);
    throw error;
  }
}

export const createProduct = async data => {
  const res = await axiosInstance.post("/products", data);
  return res.data;
};

export async function getProducts(page = 1, filters = {}) {
  try {
    const params = { page, ...filters };
    const response = await axiosInstance.get("/products", { params });
    return response.data;
  } catch (error) {
    console.error("Məhsullar gələndə problem oldu:", error.response?.data || error.message);
    throw error;
  }
}

export async function getProductById(id) {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Məhsul gələndə problem oldu:', error.response?.data || error.message);
    throw error;
  }
}

export async function editProduct(id, productData) {
  try {
    const response = await axiosInstance.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error('Məhsul duzeltilemedi:', error.response?.data || error.message);
    throw error;
  }
}

export async function deleteProductById(id) {
  try {
    const response = await axiosInstance.delete(`/products/${Number(id)}`);
    return response.data;
  } catch (error) {
    console.error('Məhsul silinemedi:', error.response?.data || error.message);
    throw error;
  }
}

export async function createImg(image) {
  const formData = new FormData();
  formData.append('img', image);
  const response = await axiosInstanceMultiPart.post('/img', formData);
  return response.data;
}

export const deleteImage = async filename => {
  const response = await axiosInstance.delete(`/img/${filename}`);
  return response.data;
}

export async function searchProduct(query) {
  try {
    const response = await axiosInstance.get(`/products/search?name=${query}`);
    return response.data;
  } catch (error) {
    console.error('Search error:', error.response?.data || error.message);
    throw error;
  }
}

// === Новые методы ===

export async function getProductsBySubcategory(id, page = 1) {
  try {
    const response = await axiosInstance.get(`/products/subcategory/${id}`, { params: { page } });
    return response.data;
  } catch (error) {
    console.error('BySubcategory error:', error.response?.data || error.message);
    throw error;
  }
}

export async function getProductsByCategory(id, page = 1) {
  try {
    const response = await axiosInstance.get(`/products/category/${id}`, { params: { page } });
    return response.data;
  } catch (error) {
    console.error('ByCategory error:', error.response?.data || error.message);
    throw error;
  }
}

export async function getAllProductsByCategory(id) {
  try {
    const response = await axiosInstance.get(`/products/category/all/${id}`);
    return response.data;
  } catch (error) {
    console.error('AllByCategory error:', error.response?.data || error.message);
    throw error;
  }
}

export default {
  getFullCategory,
  getFullSubcategory,
  createCategory,
  getCategoryById,
  editCategoryById,
  deleteCategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  createProduct,
  getProducts,
  getProductById,
  editProduct,
  deleteProductById,
  createImg,
  deleteImage,
  searchProduct,
  getProductsBySubcategory,
  getProductsByCategory,
  getAllProductsByCategory,
};
