import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // ชี้ไปยัง backend
});

export const fetchResearchData = async () => {
  try {
    const response = await api.get("/research");
    return response.data;
  } catch (error) {
    console.error("Error fetching research data:", error);
    throw error;
  }
};
