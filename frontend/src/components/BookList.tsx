import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import { fetchBooks } from '../api/BooksAPI'; // Adjust the import path as necessary

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [defaultBooks, setDefaultBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  // const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortMode, setSortMode] = useState<'default' | 'asc' | 'desc'>(
    'default'
  );
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(pageSize, pageNum, selectedCategories);

        setBooks(data.books);
        setDefaultBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
        setSortMode('default');
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    loadBooks();
  }, [pageSize, pageNum, selectedCategories]);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  const handleSortByTitle = () => {
    let newSortMode: 'default' | 'asc' | 'desc';
    if (sortMode === 'default') {
      newSortMode = 'asc';
    } else if (sortMode === 'asc') {
      newSortMode = 'desc';
    } else {
      newSortMode = 'default';
    }
    setSortMode(newSortMode);

    if (newSortMode === 'default') {
      setBooks(defaultBooks);
    } else if (newSortMode === 'asc') {
      const sorted = [...defaultBooks].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      setBooks(sorted);
    } else if (newSortMode === 'desc') {
      const sorted = [...defaultBooks].sort((a, b) =>
        b.title.localeCompare(a.title)
      );
      setBooks(sorted);
    }
  };

  return (
    <>
      <br />
      <button onClick={handleSortByTitle} className="btn btn-outline-secondary">
        Sort by Title{' '}
        {sortMode === 'default'
          ? '(Default)'
          : sortMode === 'asc'
            ? '(Ascending)'
            : '(Descending)'}
      </button>
      <br />
      <br />

      {books.map((b) => (
        <div key={b.bookID}>
          <div id="bookCard" className="card border-secondary mb-3">
            <h3 className="card-title">{b.title}</h3>
            <div className="card-body">
              <ul className="list-unstyled">
                <li>
                  <strong>Author: </strong>
                  {b.author}
                </li>
                <li>
                  <strong>Publisher: </strong>
                  {b.publisher}
                </li>
                <li>
                  <strong>ISBN: </strong>
                  {b.isbn}
                </li>
                <li>
                  <strong>Classification: </strong>
                  {b.classification}
                </li>
                <li>
                  <strong>Category: </strong>
                  {b.category}
                </li>
                <li>
                  <strong>Page Count: </strong>
                  {b.pageCount}
                </li>
                <li>
                  <strong>Price: </strong>${b.price.toFixed(2)}
                </li>
              </ul>
              <button
                className="btn btn-success"
                onClick={() =>
                  navigate(`/book/${encodeURIComponent(b.title)}/${b.bookID}`)
                }
              >
                View Book
              </button>
            </div>
          </div>
          <br />
        </div>
      ))}
      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </>
  );
}

export default BookList;
