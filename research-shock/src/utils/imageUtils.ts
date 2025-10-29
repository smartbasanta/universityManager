// utils/imageUtils.ts
export const fixPhotoUrl = (photoUrl: string): string => {
  console.log('fixPhotoUrl input:', photoUrl);
  
  if (!photoUrl || typeof photoUrl !== 'string') {
    return '';
  }
  
  let correctedUrl = photoUrl;
  
  // Remove 'undefined' from the URL
  if (correctedUrl.includes('undefined')) {
    correctedUrl = correctedUrl.replace('undefined', '');
    console.log('After removing undefined:', correctedUrl);
    
    // Ensure proper path formatting
    if (!correctedUrl.startsWith('/')) {
      correctedUrl = '/' + correctedUrl;
    }
    
    const baseUrl ='http://localhost:4000';
    correctedUrl = `${baseUrl.replace(/\/$/, '')}${correctedUrl}`;
  } else {

  }
  
  return correctedUrl;
};
// New function specifically for handling uploaded images
export const fixImageUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return '';

  // If it's a blob URL, ignore it (we want server URLs only)
  if (url.startsWith('blob:')) return '';

  // Remove any 'undefined/' prefixes
  let cleanUrl = url.replace(/undefined\//g, '/');

  // If URL starts with '/uploads', prepend the base URL
  if (cleanUrl.startsWith('/uploads')) {
    const base =  'http://localhost:4000';
    cleanUrl = base.replace(/\/$/, '') + cleanUrl;
  }

  return cleanUrl;
};
