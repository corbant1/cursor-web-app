import { useState, useCallback } from 'react';
import type { ExternalDocumentUploadItem, NamingRule } from '../types';
import { createExternalDocuments } from '../services/api';

export function useExternalDocsUpload() {
  const [items, setItems] = useState<ExternalDocumentUploadItem[]>([]);
  const [namingRule, setNamingRule] = useState<NamingRule>('filename');
  const [customPattern, setCustomPattern] = useState('[ProjectCode] - [FilenameWithoutExtension]');

  const addFiles = useCallback((files: File[]) => {
    const newItems: ExternalDocumentUploadItem[] = files.map((file) => {
      const id = `${Date.now()}-${Math.random()}`;
      const extension = file.name.split('.').pop()?.toUpperCase() || '';
      
      return {
        id,
        file,
        filename: file.name,
        fileType: extension,
        size: file.size,
        status: 'queued' as const,
      };
    });

    setItems((prev) => [...prev, ...newItems]);
    
    // Simulate processing
    newItems.forEach((item) => {
      setTimeout(() => {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: 'processing' } : i
          )
        );

        // Simulate completion
        setTimeout(async () => {
          try {
            const results = await createExternalDocuments([item], namingRule, customPattern);
            const result = results[0];
            setItems((prev) =>
              prev.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      status: result.success ? 'success' : 'error',
                      objectId: result.objectId,
                      titleInMFiles: result.titleInMFiles,
                      error: result.error,
                    }
                  : i
              )
            );
          } catch (error) {
            setItems((prev) =>
              prev.map((i) =>
                i.id === item.id
                  ? { ...i, status: 'error', error: 'Upload failed' }
                  : i
              )
            );
          }
        }, 2000);
      }, 500);
    });
  }, [namingRule, customPattern]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const retryFailed = useCallback(() => {
    const failedItems = items.filter((item) => item.status === 'error');
    failedItems.forEach((item) => {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: 'queued', error: undefined } : i
        )
      );
    });
    // Re-process failed items
    setTimeout(() => {
      failedItems.forEach((item) => {
        setTimeout(async () => {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, status: 'processing' } : i
            )
          );
          setTimeout(async () => {
            try {
              const results = await createExternalDocuments([item], namingRule, customPattern);
              const result = results[0];
              setItems((prev) =>
                prev.map((i) =>
                  i.id === item.id
                    ? {
                        ...i,
                        status: result.success ? 'success' : 'error',
                        objectId: result.objectId,
                        titleInMFiles: result.titleInMFiles,
                        error: result.error,
                      }
                    : i
                )
              );
            } catch (error) {
              setItems((prev) =>
                prev.map((i) =>
                  i.id === item.id
                    ? { ...i, status: 'error', error: 'Upload failed' }
                    : i
                )
              );
            }
          }, 2000);
        }, 500);
      });
    }, 100);
  }, [items, namingRule, customPattern]);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const stats = {
    total: items.length,
    queued: items.filter((i) => i.status === 'queued').length,
    processing: items.filter((i) => i.status === 'processing').length,
    success: items.filter((i) => i.status === 'success').length,
    error: items.filter((i) => i.status === 'error').length,
  };

  return {
    items,
    namingRule,
    setNamingRule,
    customPattern,
    setCustomPattern,
    addFiles,
    removeItem,
    retryFailed,
    clearAll,
    stats,
  };
}

