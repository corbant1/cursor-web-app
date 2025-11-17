import { useState, useCallback } from 'react';
import type { TransmittalHeader, TransmittalItem, VaultItem } from '../types';
import { searchVaultItems, createTransmittal } from '../services/api';

export function useTransmittalBuilder() {
  const [header, setHeader] = useState<TransmittalHeader>({
    project: 'LDE North Campus',
    transmittalNumber: 'TR-2025-014',
    revision: 'A',
    date: new Date().toLocaleDateString('en-GB'),
    recipient: 'ABC Construction Ltd.',
    sender: 'LDE Engineering Team',
    comments: 'Package includes structural calculations, site photos, and client correspondence for Building A foundation phase.',
  });

  const [selectedItems, setSelectedItems] = useState<TransmittalItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'document' | 'image' | 'external'>('all');
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdTransmittalId, setCreatedTransmittalId] = useState<string | null>(null);

  const performSearch = useCallback(async () => {
    setIsSearching(true);
    try {
      const results = await searchVaultItems(searchQuery, {
        type: filterType === 'all' ? undefined : filterType,
      });
      setVaultItems(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, filterType]);

  const toggleItemSelection = useCallback((vaultItem: VaultItem) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.vaultItemId === vaultItem.id);
      if (existing) {
        return prev.filter((item) => item.vaultItemId !== vaultItem.id);
      } else {
        return [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            vaultItemId: vaultItem.id,
            type: vaultItem.type,
            title: vaultItem.title,
            project: vaultItem.project,
          },
        ];
      }
    });
  }, []);

  const removeSelectedItem = useCallback((itemId: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const handleCreateTransmittal = useCallback(async () => {
    setIsCreating(true);
    try {
      const result = await createTransmittal(header, selectedItems);
      if (result.success) {
        setCreatedTransmittalId(result.objectId);
        // Reset form after success
        setTimeout(() => {
          setSelectedItems([]);
          setCreatedTransmittalId(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Create transmittal failed:', error);
    } finally {
      setIsCreating(false);
    }
  }, [header, selectedItems]);

  const stats = {
    documents: selectedItems.filter((i) => i.type === 'document').length,
    images: selectedItems.filter((i) => i.type === 'image').length,
    external: selectedItems.filter((i) => i.type === 'external').length,
    total: selectedItems.length,
  };

  return {
    header,
    setHeader,
    selectedItems,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    vaultItems,
    isSearching,
    isCreating,
    createdTransmittalId,
    performSearch,
    toggleItemSelection,
    removeSelectedItem,
    handleCreateTransmittal,
    stats,
  };
}

