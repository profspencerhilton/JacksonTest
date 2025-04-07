import CategoryFilter from '../components/CategoryFilter';
import WelcomeBand from '../components/WelcomeBand';
import { useState } from 'react';
import CartSummary from '../components/CartSummary';
import BookList from '../components/BookList';
import '../components/HomePage.css';

function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <div className="cart-page home-page">
      <CartSummary />
      <WelcomeBand />
      <div className="row">
        <div className="col-md-3">
          <CategoryFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>
        <div className="col-md-9">
          <BookList selectedCategories={selectedCategories} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
