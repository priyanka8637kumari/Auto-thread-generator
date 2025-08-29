import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Download utility functions for thread export
export interface ThreadData {
  topic: string;
  tone: string;
  tweets: string[];
  timestamp?: Date;
}

export interface DownloadOptions {
  includeMetadata?: boolean;
  includeNumbering?: boolean;
  includeStats?: boolean;
}

/**
 * Sanitizes filename by removing invalid characters
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

/**
 * Generates a filename based on topic and current date
 */
export function generateFilename(topic: string, extension: string): string {
  const sanitizedTopic = sanitizeFilename(topic.slice(0, 30)); // Limit length
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  return `twitter-thread-${sanitizedTopic}-${timestamp}.${extension}`;
}

/**
 * Counts characters and words in a text
 */
export function getTextStats(text: string) {
  const characterCount = text.length;
  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  return { characterCount, wordCount };
}

/**
 * Formats thread data as plain text
 */
export function formatThreadAsTxt(
  threadData: ThreadData, 
  options: DownloadOptions = {}
): string {
  const { 
    includeMetadata = true, 
    includeNumbering = true, 
    includeStats = false 
  } = options;

  let content = '';

  // Add metadata header
  if (includeMetadata) {
    content += '═══════════════════════════════════════\n';
    content += '           TWITTER THREAD\n';
    content += '═══════════════════════════════════════\n\n';
    content += `📝 Topic: ${threadData.topic}\n`;
    content += `🎯 Tone: ${threadData.tone.charAt(0).toUpperCase() + threadData.tone.slice(1)}\n`;
    
    if (threadData.timestamp) {
      content += `📅 Generated: ${threadData.timestamp.toLocaleString()}\n`;
    }
    
    content += `🧵 Thread Length: ${threadData.tweets.length} tweets\n\n`;
    content += '─────────────────────────────────────────\n\n';
  }

  // Add tweets
  threadData.tweets.forEach((tweet, index) => {
    if (includeNumbering) {
      content += `${index + 1}/ ${tweet}\n\n`;
    } else {
      content += `${tweet}\n\n`;
    }

    // Add stats for each tweet if requested
    if (includeStats) {
      const stats = getTextStats(tweet);
      content += `   📊 ${stats.characterCount} chars, ${stats.wordCount} words\n\n`;
    }
  });

  // Add summary statistics
  if (includeStats && includeMetadata) {
    const totalChars = threadData.tweets.reduce((sum, tweet) => sum + tweet.length, 0);
    const totalWords = threadData.tweets.reduce((sum, tweet) => sum + getTextStats(tweet).wordCount, 0);
    
    content += '─────────────────────────────────────────\n';
    content += '📈 THREAD STATISTICS\n';
    content += '─────────────────────────────────────────\n';
    content += `Total Characters: ${totalChars}\n`;
    content += `Total Words: ${totalWords}\n`;
    content += `Average Characters per Tweet: ${Math.round(totalChars / threadData.tweets.length)}\n`;
    content += `Average Words per Tweet: ${Math.round(totalWords / threadData.tweets.length)}\n`;
  }

  return content;
}

/**
 * Formats thread data as CSV
 */
export function formatThreadAsCsv(
  threadData: ThreadData,
  options: DownloadOptions = {}
): string {
  const { includeStats = true } = options;

  // CSV Headers
  let headers = ['Tweet Number', 'Content'];
  if (includeStats) {
    headers.push('Character Count', 'Word Count');
  }

  // Escape CSV content (handle quotes and commas)
  const escapeCsvContent = (content: string): string => {
    // Replace quotes with double quotes and wrap in quotes if contains comma or quote
    if (content.includes('"') || content.includes(',') || content.includes('\n')) {
      return `"${content.replace(/"/g, '""')}"`;
    }
    return content;
  };

  // Build CSV content
  let csvContent = headers.join(',') + '\n';

  // Add metadata as comment rows (if supported by CSV reader)
  csvContent += `# Topic: ${threadData.topic}\n`;
  csvContent += `# Tone: ${threadData.tone}\n`;
  if (threadData.timestamp) {
    csvContent += `# Generated: ${threadData.timestamp.toISOString()}\n`;
  }
  csvContent += `# Total Tweets: ${threadData.tweets.length}\n`;

  // Add tweets data
  threadData.tweets.forEach((tweet, index) => {
    let row = [
      index + 1,
      escapeCsvContent(tweet)
    ];

    if (includeStats) {
      const stats = getTextStats(tweet);
      row.push(stats.characterCount.toString(), stats.wordCount.toString());
    }

    csvContent += row.join(',') + '\n';
  });

  return csvContent;
}

/**
 * Triggers download of content as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  try {
    // Create blob with content
    const blob = new Blob([content], { type: mimeType });
    
    // Create download URL
    const url = window.URL.createObjectURL(blob);
    
    // Create temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Failed to download file. Please try again.');
  }
}

/**
 * Downloads thread as TXT file
 */
export function downloadThreadAsTxt(
  threadData: ThreadData,
  options: DownloadOptions = {}
): void {
  const content = formatThreadAsTxt(threadData, options);
  const filename = generateFilename(threadData.topic, 'txt');
  downloadFile(content, filename, 'text/plain;charset=utf-8');
}

/**
 * Downloads thread as CSV file
 */
export function downloadThreadAsCsv(
  threadData: ThreadData,
  options: DownloadOptions = {}
): void {
  const content = formatThreadAsCsv(threadData, options);
  const filename = generateFilename(threadData.topic, 'csv');
  downloadFile(content, filename, 'text/csv;charset=utf-8');
}

/**
 * Downloads thread in specified format
 */
export function downloadThread(
  threadData: ThreadData,
  format: 'txt' | 'csv',
  options: DownloadOptions = {}
): void {
  switch (format) {
    case 'txt':
      downloadThreadAsTxt(threadData, options);
      break;
    case 'csv':
      downloadThreadAsCsv(threadData, options);
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}
