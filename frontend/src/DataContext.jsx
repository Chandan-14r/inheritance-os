import { createContext, useContext, useState, useEffect } from 'react';
import api from './api';
import toast from 'react-hot-toast';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [assets, setAssets] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [profile, setProfile] = useState({
    name: 'Loading...', email: '', age: 45,
    executorEmail: '', deadManSwitchDays: 90, switchEnabled: true,
    lastCheckIn: new Date().toISOString(), checkInHistory: [],
  });
  const [notifications, setNotifications] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('ios_token'));

  // Load everything from backend
  const fetchAllData = async () => {
    try {
      if (!localStorage.getItem('ios_token')) return;
      
      const [assetsRes, benRes, profileRes] = await Promise.all([
        api.get('/assets'),
        api.get('/beneficiaries'),
        api.get('/auth/profile')
      ]);
      setAssets(assetsRes.data);
      setBeneficiaries(benRes.data);
      setProfile(prev => ({ ...prev, ...profileRes.data }));
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('ios_token');
        setIsAuthenticated(false);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  // Computed values
  const totalWorth = assets.reduce((s, a) => s + (a.value || 0), 0);
  const byType = {};
  assets.forEach(a => { byType[a.type] = (byType[a.type] || 0) + a.value; });
  const estimatedTax = totalWorth > 10000000 ? totalWorth * 0.30 : 0;
  const totalAllocation = beneficiaries.reduce((s, b) => s + (b.allocationPercent || 0), 0);

  // CRUD for Assets
  const addAsset = async (assetData) => {
    try { const { data } = await api.post('/assets', assetData); setAssets(prev => [...prev, data]); return true; }
    catch (err) { toast.error('Failed to add asset'); return false; }
  };
  const updateAsset = async (id, assetData) => {
    try { const { data } = await api.put(`/assets/${id}`, assetData); setAssets(prev => prev.map(a => a._id === id ? data : a)); return true; }
    catch (err) { toast.error('Failed to update asset'); return false; }
  };
  const deleteAsset = async (id) => {
    try { await api.delete(`/assets/${id}`); setAssets(prev => prev.filter(a => a._id !== id)); return true; }
    catch (err) { toast.error('Failed to delete asset'); return false; }
  };

  // CRUD for Beneficiaries
  const addBeneficiary = async (bData) => {
    try { const { data } = await api.post('/beneficiaries', bData); setBeneficiaries(prev => [...prev, data]); return true; }
    catch (err) { toast.error('Failed to add beneficiary'); return false; }
  };
  const updateBeneficiary = async (id, bData) => {
    try { const { data } = await api.put(`/beneficiaries/${id}`, bData); setBeneficiaries(prev => prev.map(b => b._id === id ? data : b)); return true; }
    catch (err) { toast.error('Failed to update beneficiary'); return false; }
  };
  const deleteBeneficiary = async (id) => {
    try { await api.delete(`/beneficiaries/${id}`); setBeneficiaries(prev => prev.filter(b => b._id !== id)); return true; }
    catch (err) { toast.error('Failed to delete beneficiary'); return false; }
  };

  // Sync Live Financial Market Data
  const syncMarketData = async () => {
    try {
      const { data } = await api.post('/assets/sync-market');
      if (data.updatedCount > 0) {
        toast.success(`Synched live prices for ${data.updatedCount} asset(s)`);
        await fetchAllData(); // Refresh the values
      } else {
        toast.success("No market-linked assets found with tickers");
      }
      return true;
    } catch (err) {
      toast.error('Failed to sync market data');
      return false;
    }
  };

  // Profile Updates & Check-In
  const updateProfile = async (updates) => {
    try {
      const { data } = await api.put('/auth/profile', updates);
      setProfile(prev => ({ ...prev, ...data }));
      return true;
    } catch (err) { toast.error('Failed to update settings'); return false; }
  };

  const checkIn = async () => {
    const now = new Date().toISOString();
    await updateProfile({ lastCheckIn: now });
    addNotification('Check-in successful! Timer reset.', 'success');
  };

  const addNotification = (message, type = 'info') => {
    setNotifications(prev => [{ id: Date.now(), message, type, time: new Date() }, ...prev].slice(0, 50));
  };

  // Generate letter using backend AI fallback wrapper
  const generateLetter = async (beneficiaryId, tone = 'heartfelt', personalMessage = '') => {
    try {
      const { data } = await api.post('/ai/generate-letter', { beneficiaryId, tone, personalMessage });
      // Update local state directly so it reflects immediately
      setBeneficiaries(prev => prev.map(b => b._id === beneficiaryId ? { ...b, aiLetter: data.letter } : b));
      return data.letter;
    } catch (err) {
      toast.error('Failed to generate letter');
      return '';
    }
  };

  const logout = () => {
    localStorage.removeItem('ios_token');
    setIsAuthenticated(false);
  };

  // We expose setProfile loosely so local tweaks don't strictly require API mapping if we only simulate logic,
  // but for Dataflow, we want to map everything.
  const localSetProfile = (updateFn) => {
    setProfile(prev => {
      const copy = typeof updateFn === 'function' ? updateFn(prev) : updateFn;
      // sync subset of fields with backend automatically
      if (copy.deadManSwitchDays !== prev.deadManSwitchDays || 
          copy.executorEmail !== prev.executorEmail || 
          copy.switchEnabled !== prev.switchEnabled) {
        api.put('/auth/profile', { 
          deadManSwitchDays: copy.deadManSwitchDays,
          executorEmail: copy.executorEmail,
          switchEnabled: copy.switchEnabled
        }).catch(err => console.error("Auto-sync failed", err));
      }
      return copy;
    });
  }

  const value = {
    assets, addAsset, deleteAsset, updateAsset,
    beneficiaries, addBeneficiary, deleteBeneficiary, updateBeneficiary,
    profile, setProfile: localSetProfile, checkIn,
    totalWorth, byType, estimatedTax, totalAllocation,
    generateLetter, notifications, addNotification, 
    isAuthenticated, logout, fetchAllData,
    syncMarketData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
