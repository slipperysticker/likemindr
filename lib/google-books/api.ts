// Google Books API integration for Likemindr

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    pageCount?: number;
    categories?: string[];
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

export interface BookSearchResult {
  google_books_id: string;
  title: string;
  author: string;
  cover_url?: string;
  description?: string;
  page_count?: number;
  genres: string[];
  isbn?: string;
}

/**
 * Search for books using Google Books API
 */
export async function searchBooks(
  query: string,
  maxResults: number = 10
): Promise<BookSearchResult[]> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY || '';

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}&maxResults=${maxResults}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to search books');
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    return data.items.map((book: GoogleBook) => transformGoogleBook(book));
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
}

/**
 * Get a single book by Google Books ID
 */
export async function getBookById(
  googleBooksId: string
): Promise<BookSearchResult | null> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY || '';

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${googleBooksId}?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch book');
    }

    const book: GoogleBook = await response.json();
    return transformGoogleBook(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
}

/**
 * Transform Google Books API response to our Book format
 */
function transformGoogleBook(book: GoogleBook): BookSearchResult {
  const volumeInfo = book.volumeInfo;

  // Get ISBN (prefer ISBN_13, fallback to ISBN_10)
  const isbn13 = volumeInfo.industryIdentifiers?.find(
    (id) => id.type === 'ISBN_13'
  );
  const isbn10 = volumeInfo.industryIdentifiers?.find(
    (id) => id.type === 'ISBN_10'
  );
  const isbn = isbn13?.identifier || isbn10?.identifier;

  // Get cover image (prefer thumbnail, fallback to smallThumbnail)
  const coverUrl =
    volumeInfo.imageLinks?.thumbnail ||
    volumeInfo.imageLinks?.smallThumbnail;

  return {
    google_books_id: book.id,
    title: volumeInfo.title,
    author: volumeInfo.authors?.[0] || 'Unknown Author',
    cover_url: coverUrl,
    description: volumeInfo.description,
    page_count: volumeInfo.pageCount,
    genres: volumeInfo.categories || [],
    isbn,
  };
}

/**
 * Get popular books in a specific genre
 */
export async function getPopularBooksByGenre(
  genre: string,
  maxResults: number = 10
): Promise<BookSearchResult[]> {
  // Search for books ordered by relevance in the genre
  return searchBooks(`subject:${genre}`, maxResults);
}

/**
 * Get trending books (general bestsellers)
 */
export async function getTrendingBooks(
  maxResults: number = 10
): Promise<BookSearchResult[]> {
  // Search for popular fiction/non-fiction
  return searchBooks('bestseller', maxResults);
}
