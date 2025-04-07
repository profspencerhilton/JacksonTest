import { useNavigate, useParams } from 'react-router-dom';
import WelcomeBand from '../components/WelcomeBand';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';
import { useState, useEffect } from 'react';
import { Book } from '../types/Book';
import '../components/BookPage.css';

function BookPage() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const { addToCart } = useCart();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    if (bookId) {
      fetch(
        `https://backend-jackson-grfsgnesgnaqcrcm.eastus-01.azurewebsites.net/Book/GetBookByID?bookID=${bookId}`
      )
        .then((response) => response.json())
        .then((data: Book) => setBook(data))
        .catch((err) => console.error('Error fetching book:', err));
    }
  }, [bookId]);

  const handleAddToCart = () => {
    if (!book) return;
    const newItem: CartItem = {
      bookId: book.bookID,
      title: book.title,
      price: Number(book.price), // parse it if your API returns a string
      quantity: 0,
    };
    addToCart(newItem);
    navigate('/cart');
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cart-page book-page">
      <WelcomeBand />
      <div id="bookCard" className="card border-secondary mb-3">
        <h3 className="card-title">{book.title}</h3>
        <div className="card-body">
          <ul className="list-unstyled">
            <li>
              <strong>Author: </strong>
              {book.author}
            </li>
            <li>
              <strong>Publisher: </strong>
              {book.publisher}
            </li>
            <li>
              <strong>ISBN: </strong>
              {book.isbn}
            </li>
            <li>
              <strong>Classification: </strong>
              {book.classification}
            </li>
            <li>
              <strong>Category: </strong>
              {book.category}
            </li>
            <li>
              <strong>Page Count: </strong>
              {book.pageCount}
            </li>
            <li>
              <strong>Price: </strong>${book.price.toFixed(2)}
            </li>
          </ul>
          <button
            className="btn btn-success btn-sm rounded"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
      <button
        className="btn btn-secondary btn-sm rounded"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
}

export default BookPage;
