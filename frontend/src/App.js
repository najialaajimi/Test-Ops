import React, { useState } from 'react';
import Users from './components/Users';
import Categories from './components/Categories';
import Products from './components/Products';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="app">
      <header className="header">
        <h1>MERN Microservices App</h1>
        <nav>
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users</button>
          <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}>Categories</button>
          <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Products</button>
        </nav>
      </header>
      <main className="main">
        {activeTab === 'users' && <Users />}
        {activeTab === 'categories' && <Categories />}
        {activeTab === 'products' && <Products />}
      </main>
    </div>
  );
}

export default App;
