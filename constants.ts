
import { Tool, Language } from './types';

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

// Minimalist Icons
export const Icons = {
  Grid: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
  Lock: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  QR: "M12 4v1m6 11h2m-6 0h-2v4h2v-4zm-6 2v3m-2-3v3m-2-3h2m2 7H5a2 2 0 01-2-2v-9a2 2 0 012-2h2m2 13h2m-2-7h2m6-8h5a2 2 0 012 2v9a2 2 0 01-2 2h-5a2 2 0 01-2-2v-9a2 2 0 012-2z",
  Image: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  Crop: "M5.5 2A3.5 3.5 0 002 5.5v11A3.5 3.5 0 005.5 20h13a3.5 3.5 0 003.5-3.5v-11A3.5 3.5 0 0018.5 2h-13zM15 15l-4 4m0-4l4 4",
  Brush: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
  Text: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  Settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  Code: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  Lightning: "M13 10V3L4 14h7v7l9-11h-7z",
  Compress: "M19 14l-7 7m0 0l-7-7m7 7V3",
  PDF: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
  Hash: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14",
  Video: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
  Shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  Wifi: "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0",
  Zip: "M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h2v2H5V5zm4 2h2v2H9V7zm0 4h2v2H9v-2zm-4 0h2v2H5v-2zm0 4h2v2H5v-2zm4 0h2v2H9v-2zm4-8h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6v-2z",
  Rotate: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  Office: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
};

// 30+ Utility Tools
export const tools: Tool[] = [
  // --- Office ---
  {
    id: 'file-encrypt',
    name: { en: 'File Encryption', ar: 'تشفير الملفات', fr: 'Chiffrement de Fichiers' },
    description: { en: 'Securely encrypt or decrypt any file with a password locally.', ar: 'تشفير أو فك تشفير أي ملف بكلمة مرور محلياً.', fr: 'Chiffrez ou déchiffrez n\'importe quel fichier.' },
    icon: Icons.Lock,
    category: 'office',
    isNew: true
  },
  {
    id: 'office-image-compress',
    name: { en: 'Pro Image Compressor', ar: 'ضغط الصور باحترافية', fr: 'Compression d\'Image Pro' },
    description: { en: 'Download our professional desktop image compressor.', ar: 'حمل برنامج ضغط الصور الاحترافي للمكتب.', fr: 'Téléchargez notre compresseur d\'images de bureau.' },
    icon: Icons.Compress,
    category: 'office',
    isNew: true
  },
  {
    id: 'office-yt-downloader',
    name: { en: 'YouTube Downloader', ar: 'محمل فيديو يوتيوب', fr: 'Téléchargeur YouTube' },
    description: { en: 'Download YouTube videos in high quality directly to your desktop.', ar: 'حمل فيديوهات اليوتيوب بجودة عالية مباشرة على سطح المكتب.', fr: 'Téléchargez des vidéos YouTube en haute qualité.' },
    icon: Icons.Video,
    category: 'office',
    isNew: true
  },

  // --- Utility ---
  {
    id: 'speed-test',
    name: { en: 'Internet Speed Test', ar: 'فحص سرعة الإنترنت', fr: 'Test de Vitesse Internet' },
    description: { en: 'Check your ping, download, and upload speeds.', ar: 'افحص سرعة الاتصال والتحميل والرفع بدقة عالية.', fr: 'Vérifiez votre ping et votre vitesse de téléchargement.' },
    icon: Icons.Wifi,
    category: 'utility',
    isNew: true
  },
  {
    id: 'zip-files',
    name: { en: 'ZIP Files', ar: 'ضغط الملفات (ZIP)', fr: 'Fichiers ZIP' },
    description: { en: 'Combine multiple files into a single ZIP archive.', ar: 'اجمع ملفات متعددة في ملف مضغوط واحد.', fr: 'Combinez plusieurs fichiers dans une seule archive ZIP.' },
    icon: Icons.Zip,
    category: 'utility',
    isNew: true
  },
  {
    id: 'qr-gen',
    name: { en: 'QR Code Generator', ar: 'صانع رمز الاستجابة السريعة', fr: 'Générateur de QR Code' },
    description: { en: 'Convert text or URLs into QR codes.', ar: 'حول النصوص والروابط إلى رموز QR.', fr: 'Convertissez du texte ou des URL en codes QR.' },
    icon: Icons.QR,
    category: 'utility'
  },

  // --- Security ---
  {
    id: 'password-gen',
    name: { en: 'Password Generator', ar: 'مولد كلمات المرور', fr: 'Générateur de Mots de Passe' },
    description: { en: 'Create strong, secure passwords instantly.', ar: 'أنشئ كلمات مرور قوية وآمنة فوراً.', fr: 'Créez des mots de passe forts et sécurisés.' },
    icon: Icons.Lock,
    category: 'security'
  },
  {
    id: 'base64-tool',
    name: { en: 'Base64 Encrypt/Decrypt', ar: 'تشفير Base64', fr: 'Chiffrement Base64' },
    description: { en: 'Encode or decode text using Base64.', ar: 'تشفير أو فك تشفير النصوص باستخدام Base64.', fr: 'Encoder ou décoder du texte en Base64.' },
    icon: Icons.Shield,
    category: 'security',
    isNew: true
  },
  
  // --- PDF ---
  {
    id: 'text-to-pdf',
    name: { en: 'Text to PDF', ar: 'تحويل النص إلى PDF', fr: 'Texte en PDF' },
    description: { en: 'Convert plain text into a PDF document.', ar: 'حول النصوص العادية إلى ملفات PDF.', fr: 'Convertissez du texte brut en document PDF.' },
    icon: Icons.PDF,
    category: 'pdf',
    isNew: true
  },
  {
    id: 'image-to-pdf',
    name: { en: 'Image to PDF', ar: 'تحويل الصور إلى PDF', fr: 'Image en PDF' },
    description: { en: 'Combine images into a single PDF.', ar: 'دمج الصور في ملف PDF واحد.', fr: 'Combinez des images dans un seul PDF.' },
    icon: Icons.PDF,
    category: 'pdf',
    isNew: true
  },
  {
    id: 'add-watermark-pdf',
    name: { en: 'Add Watermark to PDF', ar: 'إضافة علامة مائية لـ PDF', fr: 'Ajouter Filigrane PDF' },
    description: { en: 'Stamp text watermarks on your PDF files.', ar: 'أضف نصوص كعلامة مائية على ملفات PDF.', fr: 'Ajoutez des filigranes de texte sur vos fichiers PDF.' },
    icon: Icons.PDF,
    category: 'pdf',
    isNew: true
  },
  {
    id: 'pdf-to-image',
    name: { en: 'PDF to Image', ar: 'تحويل PDF إلى صور', fr: 'PDF en Image' },
    description: { en: 'Extract pages from PDF as images.', ar: 'استخرج صفحات PDF كصور.', fr: 'Extrayez des pages PDF sous forme d\'images.' },
    icon: Icons.Image,
    category: 'pdf',
    isNew: true
  },
  {
    id: 'compress-pdf',
    name: { en: 'Compress PDF', ar: 'ضغط ملفات PDF', fr: 'Compresser PDF' },
    description: { en: 'Reduce PDF file size efficiently.', ar: 'قلل حجم ملف PDF بكفاءة.', fr: 'Réduisez efficacement la taille du fichier PDF.' },
    icon: Icons.Compress,
    category: 'pdf',
    isNew: true
  },

  // --- Image / Video ---
  {
    id: 'colorize-photo',
    name: { en: 'Pro Photo Colorizer', ar: 'تلوين الصور الاحترافي', fr: 'Coloriser Photo Pro' },
    description: { en: 'Restore and colorize black & white photos with pro controls.', ar: 'استعادة وتلوين الصور القديمة مع أدوات تحكم احترافية.', fr: 'Ajouter de la couleur aux photos noir et blanc.' },
    icon: Icons.Brush,
    category: 'image',
    isNew: true
  },
  {
    id: 'rotate-image',
    name: { en: 'Rotate Image', ar: 'تدوير الصورة', fr: 'Pivoter l\'Image' },
    description: { en: 'Rotate images 90, 180, or 270 degrees.', ar: 'قم بتدوير الصور 90 أو 180 درجة بسهولة.', fr: 'Faites pivoter les images de 90, 180 ou 270 degrés.' },
    icon: Icons.Rotate,
    category: 'image',
    isNew: true
  },
  {
    id: 'crop-image',
    name: { en: 'Crop Image', ar: 'قص الصور', fr: 'Rogner l\'Image' },
    description: { en: 'Crop images to specific aspect ratios.', ar: 'قص الصور بأبعاد محددة.', fr: 'Rognez les images selon des ratios spécifiques.' },
    icon: Icons.Crop,
    category: 'image',
    isNew: true
  },
  {
    id: 'video-to-gif',
    name: { en: 'Video to GIF', ar: 'تحويل الفيديو إلى GIF', fr: 'Vidéo en GIF' },
    description: { en: 'Convert video clips to animated GIFs.', ar: 'حول مقاطع الفيديو إلى صور GIF متحركة.', fr: 'Convertissez des clips vidéo en GIF animés.' },
    icon: Icons.Video,
    category: 'image',
    isNew: true
  },
  {
    id: 'image-converter',
    name: { en: 'Image Converter', ar: 'محول الصيغ', fr: 'Convertisseur d\'Images' },
    description: { en: 'Convert between JPG, PNG, and WEBP formats.', ar: 'حول بين صيغ JPG و PNG و WEBP.', fr: 'Convertissez entre les formats JPG, PNG et WEBP.' },
    icon: Icons.Image,
    category: 'image'
  },
  {
    id: 'image-compressor',
    name: { en: 'Image Compressor', ar: 'ضغط الصور', fr: 'Compresseur d\'Images' },
    description: { en: 'Reduce image size without losing quality.', ar: 'قلل حجم الصورة دون فقدان الجودة.', fr: 'Réduisez la taille de l\'image sans perte de qualité.' },
    icon: Icons.Compress,
    category: 'image'
  },
  {
    id: 'image-nav',
    name: { en: 'Minimo Gallery', ar: 'معرض الصور (Minimo)', fr: 'Galerie Minimo' },
    description: { en: 'Private photo gallery and organizer.', ar: 'معرض صور خاص ومنظم وسريع.', fr: 'Galerie photo privée et organisatrice.' },
    icon: Icons.Grid,
    category: 'image'
  },

  // --- Text / Dev ---
  {
    id: 'code-playground',
    name: { en: 'Web Playground', ar: 'مشغل أكواد الويب', fr: 'Éditeur Web' },
    description: { en: 'Write and run HTML, CSS, and JS instantly.', ar: 'اكتب وشغل أكواد HTML, CSS, JS مباشرة.', fr: 'Écrivez et exécutez HTML, CSS et JS instantanément.' },
    icon: Icons.Code,
    category: 'dev',
    isNew: true
  },
  {
    id: 'json-to-csv',
    name: { en: 'JSON to CSV', ar: 'تحويل JSON إلى CSV', fr: 'JSON vers CSV' },
    description: { en: 'Convert JSON data to CSV spreadsheet format.', ar: 'حول بيانات JSON إلى ملفات CSV.', fr: 'Convertissez les données JSON au format CSV.' },
    icon: Icons.Code,
    category: 'dev',
    isNew: true
  },
  {
    id: 'hashtag-gen',
    name: { en: 'Hashtag Generator', ar: 'مولد هاشتاغات', fr: 'Générateur de Hashtags' },
    description: { en: 'Generate simple hashtags from text.', ar: 'أنشئ هاشتاغات بسيطة من النص.', fr: 'Générez des hashtags simples à partir de texte.' },
    icon: Icons.Hash,
    category: 'text',
    isNew: true
  },
  {
    id: 'word-counter',
    name: { en: 'Word Counter', ar: 'عداد الكلمات', fr: 'Compteur de Mots' },
    description: { en: 'Count words, characters, and lines.', ar: 'احسب الكلمات والحروف والأسطر.', fr: 'Comptez les mots, les caractères et les lignes.' },
    icon: Icons.Text,
    category: 'text'
  },
  {
    id: 'case-converter',
    name: { en: 'Case Converter', ar: 'محول حالة الأحرف', fr: 'Convertisseur de Casse' },
    description: { en: 'UPPERCASE, lowercase, Title Case, etc.', ar: 'تحويل الحروف إلى كبيرة أو صغيرة.', fr: 'MAJUSCULES, minuscules, etc.' },
    icon: Icons.Text,
    category: 'text'
  },
  {
    id: 'json-formatter',
    name: { en: 'JSON Formatter', ar: 'منسق JSON', fr: 'Formateur JSON' },
    description: { en: 'Prettify or minify JSON data.', ar: 'تنسيق بيانات JSON.', fr: 'Embellir ou minifier les données JSON.' },
    icon: Icons.Code,
    category: 'dev'
  },
];