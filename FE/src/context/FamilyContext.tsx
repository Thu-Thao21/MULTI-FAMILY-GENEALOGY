import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useAuthContext } from './AuthContext';
import { getApiErrorMessage } from '../services/api';
import { getFamily } from '../services/familyService';
import type { FamilyDto } from '../types/sprint2';

interface FamilyContextValue {
  currentFamilyId: string | null;
  currentFamily: FamilyDto | null;
  availableFamilies: FamilyDto[];
  loading: boolean;
  error: string | null;
  setCurrentFamilyId: (familyId: string) => void;
  refreshFamily: () => Promise<void>;
}

const FamilyContext = createContext<FamilyContextValue | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { account, loading: authLoading } = useAuthContext();
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [families, setFamilies] = useState<FamilyDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleFamilyIds = useMemo(
    () => Array.from(new Set(
      (account?.roles || [])
        .filter((role) => !role.revoked_at && role.family_id)
        .map((role) => role.family_id as string),
    )),
    [account],
  );

  const resolveFamilies = async () => {
    if (!account) {
      setFamilies([]);
      setSelectedFamilyId(null);
      setError(null);
      return;
    }

    const fallbackFamilyId = import.meta.env.VITE_DEV_FAMILY_ID?.trim();
    const ids = roleFamilyIds.length > 0
      ? roleFamilyIds
      : fallbackFamilyId
        ? [fallbackFamilyId]
        : [];

    if (ids.length === 0) {
      setFamilies([]);
      setSelectedFamilyId(null);
      setError('Backend chưa có endpoint liệt kê clan theo membership và tài khoản không có family-scoped role.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(ids.map((id) => getFamily(id)));
      setFamilies(results);
      setSelectedFamilyId((current) => current && ids.includes(current) ? current : ids[0]);
    } catch (requestError) {
      setFamilies([]);
      setError(getApiErrorMessage(requestError, 'Không tải được clan hiện tại.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) void resolveFamilies();
  }, [account?.id, authLoading, roleFamilyIds.join('|')]);

  const currentFamily = families.find((family) => family.id === selectedFamilyId) || null;

  const refreshFamily = async () => {
    if (!selectedFamilyId) return;
    const refreshed = await getFamily(selectedFamilyId);
    setFamilies((current) => current.map((family) => family.id === refreshed.id ? refreshed : family));
  };

  return (
    <FamilyContext.Provider
      value={{
        currentFamilyId: selectedFamilyId,
        currentFamily,
        availableFamilies: families,
        loading: authLoading || loading,
        error,
        setCurrentFamilyId: setSelectedFamilyId,
        refreshFamily,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export function useFamily() {
  const context = useContext(FamilyContext);
  if (!context) throw new Error('useFamily must be used within FamilyProvider');
  return context;
}
