import api from "./api";

export const submitContactInquiry = async (payload) => {
  const { data } = await api.post("/contact/inquiry", payload);
  return data;
};
