import { Book } from '../types/Book';

interface FetchBooksResponse {
  books: Book[];
  totalNumBooks: number;
}

const API_URL = `https://backend-jackson-grfsgnesgnaqcrcm.eastus-01.azurewebsites.net/Book`;

export const fetchBooks = async (
  pageSize: number,
  pageNum: number,
  selectedCategories: string[]
): Promise<FetchBooksResponse> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `projectTypes=${encodeURIComponent(cat)}`)
      .join('&');

    const response = await fetch(
      `${API_URL}/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching books: ', error);
    throw error;
  }
};

export const addBook = async (newBook: Book): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/AddBook`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      throw new Error('Failed to add book');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding book: ', error);
    // Rethrow the error to be handled by the caller
    throw error;
  }
};

export const updateBook = async (
  bookID: number,
  updatedBook: Book
): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/UpdateBook/${bookID}`, {
      method: 'PUT', // Use PUT for updating a resource
      credentials: 'include', // Include credentials for session management
      headers: {
        'Content-Type': 'application/json', // Specify the content type
      },
      body: JSON.stringify(updatedBook), // Convert the updated project to JSON
    });

    return await response.json(); // Parse the JSON response
  } catch (error) {
    console.error('Error updating book: ', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

export const deleteBook = async (bookID: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteBook/${bookID}`, {
      method: 'DELETE', // Use DELETE for removing a resource
      credentials: 'include', // Include credentials for session management
    });

    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
  } catch (error) {
    // Handle the error appropriately
    console.error('Error deleting book: ', error);

    throw error;
  }
};
