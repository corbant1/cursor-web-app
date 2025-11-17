// Status types
export type UploadStatus = 'queued' | 'processing' | 'success' | 'error';

// Image upload types
export interface ImageUploadItem {
  id: string;
  file: File;
  previewUrl?: string;
  filename: string;
  dateTaken?: string; // EXIF date
  size: number;
  status: UploadStatus;
  objectId?: string;
  error?: string;
  metadata?: ImageMetadata;
}

export interface ImageMetadata {
  project?: string;
  site?: string;
  siteVisit?: string;
  gpsCoordinates?: string;
  dateTaken?: string;
}

// External document upload types
export interface ExternalDocumentUploadItem {
  id: string;
  file: File;
  filename: string;
  fileType: string;
  size: number;
  status: UploadStatus;
  titleInMFiles?: string;
  objectId?: string;
  error?: string;
}

export type NamingRule = 'filename' | 'custom';

// Transmittal types
export interface TransmittalHeader {
  project: string;
  transmittalNumber: string;
  revision: string;
  date: string;
  recipient: string;
  sender: string;
  comments: string;
}

export interface VaultItem {
  id: string;
  type: 'document' | 'image' | 'external';
  title: string;
  project: string;
  lastModified: string;
  objectId?: string;
}

export interface TransmittalItem {
  id: string;
  vaultItemId: string;
  type: 'document' | 'image' | 'external';
  title: string;
  project: string;
}

// API response types
export interface ImageUploadResult {
  id: string;
  objectId: string;
  success: boolean;
  error?: string;
}

export interface ExternalDocResult {
  id: string;
  objectId: string;
  titleInMFiles: string;
  success: boolean;
  error?: string;
}

export interface TransmittalResult {
  transmittalId: string;
  objectId: string;
  success: boolean;
  error?: string;
}

