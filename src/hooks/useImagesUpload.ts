import { useState, useCallback } from 'react';
import type { ImageUploadItem, UploadStatus } from '../types';
import { createImageObjects } from '../services/api';

export function useImagesUpload() {
  const [items, setItems] = useState<ImageUploadItem[]>([]);
  const [useMetadataTemplate, setUseMetadataTemplate] = useState(true);

  const addFiles = useCallback((files: File[]) => {
    const newItems: ImageUploadItem[] = files.map((file) => {
      const id = `${Date.now()}-${Math.random()}`;
      const previewUrl = URL.createObjectURL(file);
      
      // Try to extract EXIF date (mock for now)
      const dateTaken = new Date().toISOString().replace('T', ' ').slice(0, 19);

      return {
        id,
        file,
        previewUrl,
        filename: file.name,
        dateTaken,
        size: file.size,
        status: 'queued' as UploadStatus,
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
            const results = await createImageObjects([item]);
            const result = results[0];
            setItems((prev) =>
              prev.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      status: result.success ? 'success' : 'error',
                      objectId: result.objectId,
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
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
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
              const results = await createImageObjects([item]);
              const result = results[0];
              setItems((prev) =>
                prev.map((i) =>
                  i.id === item.id
                    ? {
                        ...i,
                        status: result.success ? 'success' : 'error',
                        objectId: result.objectId,
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
  }, [items]);

  const clearAll = useCallback(() => {
    items.forEach((item) => {
      if (item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });
    setItems([]);
  }, [items]);

  const stats = {
    total: items.length,
    queued: items.filter((i) => i.status === 'queued').length,
    processing: items.filter((i) => i.status === 'processing').length,
    success: items.filter((i) => i.status === 'success').length,
    error: items.filter((i) => i.status === 'error').length,
  };

  return {
    items,
    useMetadataTemplate,
    setUseMetadataTemplate,
    addFiles,
    removeItem,
    retryFailed,
    clearAll,
    stats,
  };
}

