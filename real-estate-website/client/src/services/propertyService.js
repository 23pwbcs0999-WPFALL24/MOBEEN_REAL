import api from "./api";

export const fetchProperties = async (params = {}) => {
  const { data } = await api.get("/properties", { params });
  return data;
};

export const fetchPropertyById = async (id) => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};

export const createProperty = async (formData) => {
  const { data } = await api.post("/properties", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return data;
};

export const updateProperty = async (id, payload) => {
  const isFormData = payload instanceof FormData;
  const { data } = await api.put(`/properties/${id}`, payload, {
    headers: isFormData
      ? {
          "Content-Type": "multipart/form-data"
        }
      : undefined
  });
  return data;
};

export const deleteProperty = async (id) => {
  const { data } = await api.delete(`/properties/${id}`);
  return data;
};

export const toggleFavorite = async (id) => {
  const { data } = await api.post(`/properties/${id}/favorite`);
  return data;
};
