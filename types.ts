
export type Language = 'en' | 'ar' | 'fr';

export interface LocalizedString {
  en: string;
  ar: string;
  fr: string;
}

export type ServiceCategory = 'image' | 'text' | 'security' | 'utility' | 'pdf' | 'dev' | 'office';

export type ToolId = 
  | 'qr-gen' 
  | 'password-gen' 
  | 'image-converter' 
  | 'image-compressor' 
  | 'rotate-image'
  | 'crop-image'
  | 'colorize-photo'
  | 'word-counter' 
  | 'case-converter'
  | 'json-formatter'
  | 'json-to-csv'
  | 'code-playground'
  | 'text-to-pdf'
  | 'image-to-pdf'
  | 'pdf-to-image'
  | 'add-watermark-pdf'
  | 'compress-pdf'
  | 'base64-tool'
  | 'video-to-gif'
  | 'hashtag-gen'
  | 'image-nav'
  | 'speed-test'
  | 'zip-files'
  | 'file-encrypt'
  | 'office-image-compress'
  | 'office-yt-downloader'
  | string;

export interface Tool {
  id: ToolId;
  name: LocalizedString;
  description: LocalizedString;
  icon: string; // SVG path d
  category: ServiceCategory;
  isNew?: boolean;
}

export type ViewState = 'home' | 'pricing' | 'privacy' | 'contact' | 'auth' | 'office';

export interface User {
  name: string;
  email: string;
  plan: 'free' | 'pro';
  tokens: number;
  avatar?: string;
}

export interface AudioBlob {
  data: string;
  mimeType: string;
}