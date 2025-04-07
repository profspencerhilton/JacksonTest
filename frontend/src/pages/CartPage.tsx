import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';
import '../components/CartPage.css';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();

  // Calculate total price as sum(item.price * item.quantity)
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <br />
      <div>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul className="cart-list">
            {cart.map((item: CartItem) => (
              <li key={item.bookId} className="cart-item">
                <span className="cart-item-title">
                  {item.title} (x{item.quantity})
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <button
                  className="btn btn-sm btn-danger rounded remove-btn"
                  onClick={() => removeFromCart(item.bookId)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <h3>Total: ${total.toFixed(2)}</h3>
      <div className="cart-actions">
        <button className="btn btn-sm btn-primary rounded checkout-btn">
          Checkout
        </button>
        <button
          className="btn btn-sm btn-secondary rounded continue-btn"
          onClick={() => navigate('/home')}
        >
          Continue Browsing
        </button>
      </div>
    </div>
  );
}

export default CartPage;
