/**
 * Content parsing utilities
 */

/**
 * Parse content string and convert to text array
 * Removes HTML tags and splits by common separators
 * @param content - Raw content string that may contain HTML
 * @returns Array of clean text strings
 */
export const parseContentToTextArray = (content: string): string[] => {
  if (!content || typeof content !== 'string') {
    return [];
  }

  // Remove HTML tags using regex
  const cleanText = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .trim();

  // If empty after cleaning, return empty array
  if (!cleanText) {
    return [];
  }

  // Split by various separators and filter out empty strings
  // Prioritize newline separators for better parsing
  const separators = /[\n\r]+|[,，；;、|]/;

  return cleanText
    .split(separators)
    .map(item => item.trim())
    .filter(item => item.length > 0);
};

/**
 * Validate if content contains meaningful text
 * @param content - Content string to validate
 * @returns Boolean indicating if content is meaningful
 */
export const hasValidContent = (content: string): boolean => {
  const textArray = parseContentToTextArray(content);
  return textArray.length > 0;
};
