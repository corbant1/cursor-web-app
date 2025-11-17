// TODO: Replace these mock implementations with real API calls to M-Files backend

import type {
  ImageUploadItem,
  ImageUploadResult,
  ExternalDocumentUploadItem,
  ExternalDocResult,
  TransmittalHeader,
  TransmittalItem,
  TransmittalResult,
  VaultItem,
} from '../types';

/**
 * Create Image objects in M-Files from uploaded files
 * TODO: Implement real API call
 */
export async function createImageObjects(
  items: ImageUploadItem[]
): Promise<ImageUploadResult[]> {
  // Mock implementation - simulates API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const results: ImageUploadResult[] = items.map((item, index) => ({
        id: item.id,
        objectId: `1245${3 + index}`, // Mock object IDs
        success: Math.random() > 0.1, // 90% success rate
        error: Math.random() > 0.9 ? 'Upload failed' : undefined,
      }));
      resolve(results);
    }, 2000);
  });
}

/**
 * Create External Document objects in M-Files from uploaded files
 * TODO: Implement real API call
 */
export async function createExternalDocuments(
  items: ExternalDocumentUploadItem[],
  namingRule: 'filename' | 'custom',
  customPattern?: string
): Promise<ExternalDocResult[]> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const results: ExternalDocResult[] = items.map((item, index) => {
        let title = item.filename.replace(/\.[^/.]+$/, ''); // Remove extension
        if (namingRule === 'custom' && customPattern) {
          // Simple mock pattern replacement
          title = customPattern
            .replace('[ProjectCode]', 'LDE-NC')
            .replace('[FilenameWithoutExtension]', title);
        }
        return {
          id: item.id,
          objectId: `1523${4 + index}`,
          titleInMFiles: title,
          success: Math.random() > 0.1,
          error: Math.random() > 0.9 ? 'Upload failed' : undefined,
        };
      });
      resolve(results);
    }, 2000);
  });
}

/**
 * Search vault items by query and filters
 * TODO: Implement real API call
 */
export async function searchVaultItems(
  query: string,
  filters: {
    type?: 'document' | 'image' | 'external';
    project?: string;
  }
): Promise<VaultItem[]> {
  // Mock implementation with sample data
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockItems: VaultItem[] = [
        {
          id: '1',
          type: 'document',
          title: 'Structural Calculations - Building A',
          project: 'LDE North Campus',
          lastModified: '2025-11-10',
          objectId: '1001',
        },
        {
          id: '2',
          type: 'document',
          title: 'Foundation Design Report Rev B',
          project: 'LDE North Campus',
          lastModified: '2025-11-09',
          objectId: '1002',
        },
        {
          id: '3',
          type: 'image',
          title: 'Site Photo - North Elevation',
          project: 'LDE North Campus',
          lastModified: '2025-11-08',
          objectId: '12453',
        },
        {
          id: '4',
          type: 'external',
          title: 'Client Approval Letter 2025-11',
          project: 'LDE North Campus',
          lastModified: '2025-11-07',
          objectId: '15235',
        },
      ];

      let filtered = mockItems;
      if (filters.type) {
        filtered = filtered.filter((item) => item.type === filters.type);
      }
      if (filters.project) {
        filtered = filtered.filter((item) => item.project === filters.project);
      }
      if (query) {
        const lowerQuery = query.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.project.toLowerCase().includes(lowerQuery)
        );
      }

      resolve(filtered);
    }, 500);
  });
}

/**
 * Create a Transmittal object in M-Files
 * TODO: Implement real API call
 */
export async function createTransmittal(
  header: TransmittalHeader,
  _items: TransmittalItem[]
): Promise<TransmittalResult> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        transmittalId: header.transmittalNumber,
        objectId: '20001',
        success: true,
      });
    }, 1500);
  });
}

