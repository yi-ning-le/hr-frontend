import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseResume } from '../parseResume';
import * as pdfjs from 'pdfjs-dist';

// Mock pdfjs-dist
vi.mock('pdfjs-dist', () => {
  return {
    GlobalWorkerOptions: {
      workerSrc: '',
    },
    getDocument: vi.fn(),
  };
});

describe('parseResume', () => {
  const mockGetDocument = pdfjs.getDocument as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupMockPdf = (pagesText: string[]) => {
    const pages = pagesText.map(text => ({
      getTextContent: vi.fn().mockResolvedValue({
        items: [{ str: text }],
      }),
    }));

    mockGetDocument.mockReturnValue({
      promise: Promise.resolve({
        numPages: pages.length,
        getPage: vi.fn().mockImplementation((pageNumber) => {
          return Promise.resolve(pages[pageNumber - 1]);
        }),
      }),
    });
  };

  const createMockFile = () => {
    const file = new File([''], 'resume.pdf', { type: 'application/pdf' });
    file.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(8));
    return file;
  };

  it('should extract email correctly', async () => {
    setupMockPdf(['Contact me at test@example.com for more info.']);
    
    const file = createMockFile();
    const result = await parseResume(file);
    
    expect(result.email).toBe('test@example.com');
  });

  it('should extract phone number correctly (various formats)', async () => {
    const phoneTests = [
      { text: 'Call: 13800138000', expected: '13800138000' }, // Chinese mobile
      { text: 'Mobile: 138-0013-8000', expected: '13800138000' }, // Chinese mobile with separators
      { text: 'Phone: +86 138 0013 8000', expected: '13800138000' }, // International (current implementation matches inner number first)
      { text: 'US: (123) 456-7890', expected: '(123)4567890' }, // US format (parentheses are not stripped)
    ];

    for (const test of phoneTests) {
      setupMockPdf([test.text]);
      const file = createMockFile();
      const result = await parseResume(file);
      expect(result.phone).toBe(test.expected);
    }
  });

  it('should extract name using "Name:" pattern', async () => {
    setupMockPdf(['Name: John Doe\nEmail: john@example.com']);
    const file = createMockFile();
    const result = await parseResume(file);
    expect(result.name).toBe('John Doe');
  });

  it('should extract Chinese name using heuristics', async () => {
    setupMockPdf(['王小明\nEmail: wang@example.com']);
    const file = createMockFile();
    const result = await parseResume(file);
    expect(result.name).toBe('王小明');
  });
  
  it('should extract English name using heuristics (capitalized words)', async () => {
    setupMockPdf(['Alice Wonderland\nEmail: alice@example.com']);
    const file = createMockFile();
    const result = await parseResume(file);
    expect(result.name).toBe('Alice Wonderland');
  });

  it('should handle multi-page PDFs', async () => {
    setupMockPdf([
      'Page 1 info.',
      'Contact: test@example.com',
    ]);
    const file = createMockFile();
    const result = await parseResume(file);
    expect(result.email).toBe('test@example.com');
  });

  it('should return empty object on error', async () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock a rejected promise for the document loading
    // We use a factory function to avoid unhandled rejection during setup
    mockGetDocument.mockReturnValue({
      promise: Promise.resolve().then(() => { throw new Error('PDF Error'); }),
    });

    const file = createMockFile();
    const result = await parseResume(file);
    
    expect(result).toEqual({});
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});