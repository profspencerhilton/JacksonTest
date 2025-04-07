import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage';
import CartPage from './pages/CartPage';
import AdminBooksPage from './pages/AdminBooksPage';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/book/:bookName/:bookId" element={<BookPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/adminbooks" element={<AdminBooksPage />}></Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
