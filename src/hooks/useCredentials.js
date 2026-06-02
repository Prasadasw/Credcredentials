import { useState, useCallback } from 'react';
import api from '../api/axiosClient';

export function useCredentials(initialFilters = {}) {
  const [data, setData] = useState({ docs: [], totalDocs: 0, page: 1, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchCredentials = useCallback(async (override = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = { ...filters, ...override };
      const { data: result } = await api.get('/credentials', { params });
      setData(result);
      setFilters(params);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load credentials');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createCredential = async (payload) => {
    const { data: created } = await api.post('/credentials', payload);
    return created;
  };

  const updateCredential = async (id, payload) => {
    const { data: updated } = await api.put(`/credentials/${id}`, payload);
    return updated;
  };

  const deleteCredential = async (id) => {
    await api.delete(`/credentials/${id}`);
  };

  const getCredential = async (id, reveal = false) => {
    const { data } = await api.get(`/credentials/${id}`, { params: { reveal } });
    return data;
  };

  const exportCredentials = async (params = {}, format = 'csv') => {
    const response = await api.get('/credentials/export', {
      params: { ...params, format },
      responseType: 'blob',
    });
    const ext = format === 'xlsx' ? 'xlsx' : 'csv';
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `credentials.${ext}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return {
    credentials: data.docs,
    pagination: data,
    loading,
    error,
    filters,
    setFilters,
    fetchCredentials,
    createCredential,
    updateCredential,
    deleteCredential,
    getCredential,
    exportCredentials,
  };
}
