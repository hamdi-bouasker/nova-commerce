import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { UserRole } from './types';
import type { Product } from './types';
import ChatBot from './components/ChatBot';

// --- COMPONENTS ---

const Navbar = ({ setPage }: { setPage: (page: string) => void }) => {
   const { user, logout } = useAuth();
   const { cart } = useStore();
   const [menuOpen, setMenuOpen] = useState(false);

   return (
      <nav className="bg-white border-b sticky top-0 z-40">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
               <div className="flex items-center cursor-pointer" onClick={() => setPage('home')}>
                  <span className="text-2xl font-bold text-brand-600">Nova</span>
                  <span className="text-2xl font-light text-gray-800">Commerce</span>
               </div>

               <div className="hidden md:flex items-center space-x-8">
                  <button onClick={() => setPage('home')} className="text-gray-600 hover:text-brand-600 font-medium">Home</button>
                  <button onClick={() => setPage('shop')} className="text-gray-600 hover:text-brand-600 font-medium">Shop</button>
                  <button onClick={() => setPage('about')} className="text-gray-600 hover:text-brand-600 font-medium">About</button>
                  <button onClick={() => setPage('faq')} className="text-gray-600 hover:text-brand-600 font-medium">FAQ</button>
                  {user?.role === UserRole.ADMIN && (
                     <button onClick={() => setPage('admin')} className="text-red-500 hover:text-red-700 font-medium border border-red-200 px-3 py-1 rounded-md bg-red-50">Admin</button>
                  )}
               </div>

               <div className="hidden md:flex items-center space-x-6">
                  <button onClick={() => setPage('cart')} className="relative p-2 text-gray-600 hover:text-brand-600">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                     </svg>
                     {cart.length > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-600 rounded-full">
                           {cart.reduce((a, b) => a + b.quantity, 0)}
                        </span>
                     )}
                  </button>

                  {user ? (
                     <div className="relative group">
                        <button className="flex items-center space-x-2 text-gray-700 hover:text-brand-600 focus:outline-none">
                           <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold transition-transform group-hover:scale-105">
                              {user.name.charAt(0).toUpperCase()}
                           </div>
                        </button>
                        {/* Dropdown with padding bridge to prevent closing on hover gap */}
                        <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
                           <div className="bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1">
                              <button onClick={() => setPage('profile')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Profile</button>
                              <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Sign out</button>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <button onClick={() => setPage('login')} className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition">
                        Sign In
                     </button>
                  )}
               </div>

               <div className="flex md:hidden items-center">
                  <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                     </svg>
                  </button>
               </div>
            </div>
         </div>

         {/* Mobile Menu */}
         {menuOpen && (
            <div className="md:hidden bg-white border-t p-4 space-y-4">
               <button onClick={() => { setPage('home'); setMenuOpen(false); }} className="block w-full text-left font-medium text-gray-700">Home</button>
               <button onClick={() => { setPage('shop'); setMenuOpen(false); }} className="block w-full text-left font-medium text-gray-700">Shop</button>
               <button onClick={() => { setPage('cart'); setMenuOpen(false); }} className="block w-full text-left font-medium text-gray-700">Cart ({cart.length})</button>
               {!user && <button onClick={() => { setPage('login'); setMenuOpen(false); }} className="block w-full text-left font-medium text-brand-600">Sign In</button>}
            </div>
         )}
      </nav>
   );
};

// --- PAGES ---

const Home = ({ setPage }: { setPage: (p: string) => void }) => {
   return (
      <div>
         <div className="relative bg-brand-900 text-white overflow-hidden">
            <div className="absolute inset-0">
               <img src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=1600&q=80" alt="Hero" className="w-full h-full object-cover opacity-20" />
            </div>
            <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
               <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">
                  Tech for the Modern Professional
               </h1>
               <p className="text-xl md:text-2xl text-brand-100 mb-10 max-w-2xl">
                  Upgrade your workspace with our curated collection of premium electronics and accessories.
               </p>
               <button onClick={() => setPage('shop')} className="bg-brand-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-400 transition transform hover:scale-105 shadow-xl">
                  Shop Now
               </button>
            </div>
         </div>
         <div className="max-w-7xl mx-auto py-16 px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why NovaCommerce?</h2>
            <div className="grid md:grid-cols-3 gap-8">
               {[
                  { title: 'Premium Quality', desc: 'Hand-picked products from top tier brands.', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { title: 'Fast Shipping', desc: 'Free express delivery on orders over $100.', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' },
                  { title: '24/7 Support', desc: 'Our AI agents and team are here to help.', icon: 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.355 0-2.697-.056-4.024-.166-.137-.012-.274-.025-.41-.041-.253-.03-.506-.063-.756-.1C5.78 16.635 2.25 13.923 2.25 9.75c0-4.015 3.242-7.399 7.625-7.796 1.109-.101 2.25-.15 3.407-.127 1.155.023 2.296.107 3.418.251 3.237.414 5.755 3.012 3.55 6.433zM16.094 5.485c.346.069.686.149 1.021.24 3.036.83 5.135 3.514 5.135 6.64v.37c0 .487 0 1.05-.005 1.554-.002.261-.002.483-.003.655a1.18 1.18 0 01-1.18 1.18h-.394l-2.665 2.665v-2.665h-.54c-.161 0-.323-.004-.483-.013-.254-.014-.505-.034-.755-.058A8.83 8.83 0 0116.094 5.485z' }
               ].map((feature, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
                     <div className="bg-brand-100 p-4 rounded-full text-brand-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                           <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                        </svg>
                     </div>
                     <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                     <p className="text-gray-600">{feature.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

const Shop = ({ setPage, setSelectedProduct }: { setPage: any, setSelectedProduct: any }) => {
   const { products, addToCart } = useStore();
   const [filter, setFilter] = useState('All');
   const [search, setSearch] = useState('');
   const [sort, setSort] = useState('featured');

   const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

   const filteredProducts = products
      .filter(p => (filter === 'All' || p.category === filter) && p.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
         if (sort === 'low') return a.price - b.price;
         if (sort === 'high') return b.price - a.price;
         return 0;
      });

   return (
      <div className="max-w-7xl mx-auto px-4 py-8">
         <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-gray-900">Shop All Products</h2>
            <div className="flex gap-4 w-full md:w-auto">
               <input
                  type="text"
                  placeholder="Search products..."
                  className="border rounded-md px-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-brand-500 outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
            </div>
         </div>

         <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
               <h3 className="font-semibold text-lg mb-4">Categories</h3>
               <div className="space-y-2">
                  {categories.map(cat => (
                     <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`block w-full text-left px-3 py-2 rounded-md transition ${filter === cat ? 'bg-brand-100 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                     >
                        {cat}
                     </button>
                  ))}
               </div>

               <h3 className="font-semibold text-lg mt-8 mb-4">Sort By</h3>
               <select className="w-full border p-2 rounded-md" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
               </select>
            </div>

            {/* Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition group">
                     <div className="h-64 bg-gray-100 relative overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                     </div>
                     <div className="p-6">
                        <div className="text-xs text-brand-600 font-semibold mb-1 uppercase tracking-wide">{product.category}</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                        <div className="flex justify-between items-center mt-4">
                           <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                           <div className="flex gap-2">
                              <button onClick={() => { setSelectedProduct(product); setPage('product'); }} className="text-gray-500 hover:text-brand-600 p-2 border rounded-full hover:bg-gray-50">
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                 </svg>
                              </button>
                              <button onClick={() => addToCart(product)} className="bg-brand-600 text-white p-2 rounded-full hover:bg-brand-700 shadow-md">
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                 </svg>
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

const ProductDetail = ({ product, setPage }: { product: Product | null, setPage: any }) => {
   const { addToCart } = useStore();
   if (!product) return <div>Product not found</div>;

   return (
      <div className="max-w-7xl mx-auto px-4 py-12">
         <button onClick={() => setPage('shop')} className="mb-6 text-gray-500 hover:text-brand-600 flex items-center gap-1">
            ← Back to Shop
         </button>
         <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-inner">
               <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
               <span className="text-brand-600 font-bold tracking-wide uppercase mb-2">{product.category}</span>
               <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
               <p className="text-gray-600 text-lg mb-8 leading-relaxed">{product.description}</p>
               <div className="flex items-center gap-6 mb-8">
                  <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                     {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
               </div>
               <button onClick={() => addToCart(product)} className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition shadow-lg">
                  Add to Cart
               </button>
            </div>
         </div>
      </div>
   );
};

const Cart = ({ setPage }: { setPage: any }) => {
   const { cart, removeFromCart, updateCartQuantity, cartTotal } = useStore();

   if (cart.length === 0) {
      return (
         <div className="max-w-7xl mx-auto px-4 py-24 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
            <button onClick={() => setPage('shop')} className="bg-brand-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-brand-700">Continue Shopping</button>
         </div>
      );
   }

   return (
      <div className="max-w-7xl mx-auto px-4 py-12">
         <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
         <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
               <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
                  {cart.map(item => (
                     <div key={item.id} className="p-6 border-b last:border-0 flex items-center gap-6">
                        <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md bg-gray-100" />
                        <div className="flex-1">
                           <h3 className="text-lg font-semibold">{item.name}</h3>
                           <p className="text-gray-500 text-sm mb-2">{item.category}</p>
                           <div className="font-bold text-brand-600">${item.price.toFixed(2)}</div>
                        </div>
                        <div className="flex items-center gap-3">
                           <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50">-</button>
                           <span className="w-8 text-center font-medium">{item.quantity}</span>
                           <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 p-2">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                           </svg>
                        </button>
                     </div>
                  ))}
               </div>
            </div>
            <div className="lg:col-span-4 mt-8 lg:mt-0">
               <div className="bg-gray-50 p-6 rounded-lg border">
                  <h3 className="text-lg font-bold mb-4">Order Summary</h3>
                  <div className="flex justify-between mb-2 text-gray-600">
                     <span>Subtotal</span>
                     <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4 text-gray-600">
                     <span>Shipping</span>
                     <span>Free</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold text-xl mb-6">
                     <span>Total</span>
                     <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button onClick={() => setPage('checkout')} className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition shadow-md">
                     Proceed to Checkout
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

const Checkout = ({ setPage }: { setPage: any }) => {
   const { clearCart, cartTotal } = useStore();
   const { user } = useAuth();
   const [loading, setLoading] = useState(false);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setTimeout(() => {
         clearCart();
         alert("Order placed successfully! Thank you for shopping with NovaCommerce.");
         setPage('home');
      }, 1500);
   }

   return (
      <div className="max-w-3xl mx-auto px-4 py-12">
         <h1 className="text-3xl font-bold mb-8">Checkout</h1>
         <div className="bg-white p-8 rounded-xl shadow-sm border">
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                     <input required type="text" className="w-full border rounded-md p-2" defaultValue={user?.name.split(' ')[0]} />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                     <input required type="text" className="w-full border rounded-md p-2" />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input required type="email" className="w-full border rounded-md p-2" defaultValue={user?.email} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input required type="text" className="w-full border rounded-md p-2" />
               </div>
               <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                     <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                     <input required type="text" placeholder="0000 0000 0000 0000" className="w-full border rounded-md p-2" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                     <input required type="text" placeholder="123" className="w-full border rounded-md p-2" />
                  </div>
               </div>
               <div className="pt-6 border-t">
                  <div className="flex justify-between items-center mb-6">
                     <span className="font-medium text-gray-600">Total to pay:</span>
                     <span className="text-2xl font-bold text-brand-600">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button disabled={loading} className="w-full bg-brand-600 text-white py-4 rounded-lg font-bold hover:bg-brand-700 transition disabled:opacity-50">
                     {loading ? 'Processing...' : 'Place Order'}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

const AuthPage = ({ type, setPage }: { type: 'login' | 'register', setPage: any }) => {
   const { login, register } = useAuth();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [name, setName] = useState('');

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         if (type === 'login') {
            await login(email, password);
         } else {
            await register(name, email, password);
         }
         setPage('home');
      } catch (e) {
         // Error handled in context
      }
   };

   return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
         <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-center mb-8">{type === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               {type === 'register' && (
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                     <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-md p-2" />
                  </div>
               )}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-md p-2" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded-md p-2" />
               </div>
               <button className="w-full bg-brand-600 text-white py-2 rounded-md font-bold hover:bg-brand-700 transition mt-4">
                  {type === 'login' ? 'Sign In' : 'Sign Up'}
               </button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
               {type === 'login' ? (
                  <p>Don't have an account? <button onClick={() => setPage('register')} className="text-brand-600 font-bold hover:underline">Sign up</button></p>
               ) : (
                  <p>Already have an account? <button onClick={() => setPage('login')} className="text-brand-600 font-bold hover:underline">Sign in</button></p>
               )}
               {type === 'login' && <p className="mt-2 text-xs text-gray-400">Tip: Use "admin@nova.com" to test admin features.</p>}
            </div>
         </div>
      </div>
   );
};

const AdminDashboard = () => {
   const { products, addProduct, updateProduct, deleteProduct } = useStore();
   const [editing, setEditing] = useState<Product | null>(null);
   const [isFormOpen, setIsFormOpen] = useState(false);

   // Form State
   const [formData, setFormData] = useState({ name: '', price: '', category: '', stock: '', description: '', image: '' });

   const handleEdit = (p: Product) => {
      setEditing(p);
      setFormData({
         name: p.name,
         price: p.price.toString(),
         category: p.category,
         stock: p.stock.toString(),
         description: p.description,
         image: p.image
      });
      setIsFormOpen(true);
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const payload = {
         id: editing ? editing.id : Date.now().toString(),
         name: formData.name,
         price: parseFloat(formData.price),
         category: formData.category,
         stock: parseInt(formData.stock),
         description: formData.description,
         image: formData.image || 'https://via.placeholder.com/400'
      };

      if (editing) updateProduct(payload);
      else addProduct(payload);

      setIsFormOpen(false);
      setEditing(null);
      setFormData({ name: '', price: '', category: '', stock: '', description: '', image: '' });
   };

   return (
      <div className="max-w-7xl mx-auto px-4 py-8">
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <button onClick={() => { setEditing(null); setFormData({ name: '', price: '', category: '', stock: '', description: '', image: '' }); setIsFormOpen(true); }} className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700">
               + Add New Product
            </button>
         </div>

         {/* Product Form Modal (Inline for simplicity) */}
         {isFormOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Product' : 'Add Product'}</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                     <input required placeholder="Product Name" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                     <div className="grid grid-cols-2 gap-4">
                        <input required type="number" step="0.01" placeholder="Price" className="w-full border p-2 rounded" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                        <input required type="number" placeholder="Stock" className="w-full border p-2 rounded" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                     </div>
                     <input required placeholder="Category" className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                     <input required placeholder="Image URL" className="w-full border p-2 rounded" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                     <textarea required placeholder="Description" className="w-full border p-2 rounded h-24" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />

                     <div className="flex gap-2 justify-end mt-4">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700">Save</button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                  <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                  {products.map(p => (
                     <tr key={p.id}>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center">
                           <img src={p.image} className="h-10 w-10 rounded-full mr-3 object-cover" alt="" />
                           <span className="font-medium text-gray-900">{p.name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">${p.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                           <button onClick={() => handleEdit(p)} className="text-brand-600 hover:text-brand-900 mr-4">Edit</button>
                           <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

const About = () => (
   <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-6">About NovaCommerce</h1>
      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
         NovaCommerce started in 2024 with a simple mission: to provide high-quality modern electronics without the markup.
         We believe in transparent pricing, exceptional customer support, and a seamless shopping experience.
      </p>
      <div className="bg-gray-100 p-8 rounded-xl">
         <h2 className="text-2xl font-bold mb-4">Our Values</h2>
         <div className="grid md:grid-cols-3 gap-6 text-left">
            <div>
               <h3 className="font-bold text-brand-600 mb-2">Customer First</h3>
               <p className="text-sm text-gray-600">We prioritize your experience above all else. Our support team is available 24/7.</p>
            </div>
            <div>
               <h3 className="font-bold text-brand-600 mb-2">Quality Assurance</h3>
               <p className="text-sm text-gray-600">Every product is rigorously tested before it reaches our inventory.</p>
            </div>
            <div>
               <h3 className="font-bold text-brand-600 mb-2">Sustainable Tech</h3>
               <p className="text-sm text-gray-600">We partner with brands that prioritize eco-friendly manufacturing.</p>
            </div>
         </div>
      </div>
   </div>
);

const FAQ = () => (
   <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      <div className="space-y-6">
         {[
            { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express shipping is 1-2 business days." },
            { q: "What is your return policy?", a: "We offer a 30-day money-back guarantee on all items in original condition." },
            { q: "Do you ship internationally?", a: "Currently we ship to US, Canada, and UK. We are expanding soon!" },
            { q: "How can I contact support?", a: "You can use our AI Chatbot for instant answers or email support@novacommerce.com." }
         ].map((faq, i) => (
            <div key={i} className="bg-white border p-6 rounded-lg shadow-sm">
               <h3 className="font-bold text-lg mb-2 text-gray-900">{faq.q}</h3>
               <p className="text-gray-600">{faq.a}</p>
            </div>
         ))}
      </div>
   </div>
);

const UserProfile = () => {
   const { user } = useAuth();
   if (!user) return null;
   return (
      <div className="max-w-4xl mx-auto px-4 py-12">
         <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
               <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
               <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and preferences.</p>
            </div>
            <div className="border-t border-gray-200">
               <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                     <dt className="text-sm font-medium text-gray-500">Full name</dt>
                     <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                     <dt className="text-sm font-medium text-gray-500">Email address</dt>
                     <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                     <dt className="text-sm font-medium text-gray-500">Role</dt>
                     <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.role}</dd>
                  </div>
               </dl>
            </div>
         </div>

         <h3 className="text-xl font-bold mb-4">Order History</h3>
         <div className="bg-white border rounded-lg p-8 text-center text-gray-500">
            No orders found. Start shopping!
         </div>
      </div>
   );
};

// --- MAIN APP ---

const AppContent = () => {
   const [page, setPage] = useState('home');
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
   const { user } = useAuth();

   const renderPage = () => {
      switch (page) {
         case 'home': return <Home setPage={setPage} />;
         case 'shop': return <Shop setPage={setPage} setSelectedProduct={setSelectedProduct} />;
         case 'product': return <ProductDetail product={selectedProduct} setPage={setPage} />;
         case 'cart': return <Cart setPage={setPage} />;
         case 'checkout': return user ? <Checkout setPage={setPage} /> : <AuthPage type="login" setPage={setPage} />;
         case 'login': return <AuthPage type="login" setPage={setPage} />;
         case 'register': return <AuthPage type="register" setPage={setPage} />;
         case 'admin': return user?.role === UserRole.ADMIN ? <AdminDashboard /> : <Home setPage={setPage} />;
         case 'profile': return <UserProfile />;
         case 'about': return <About />;
         case 'faq': return <FAQ />;
         default: return <Home setPage={setPage} />;
      }
   };

   return (
      <div className="min-h-screen bg-white text-gray-900 font-sans">
         <Navbar setPage={setPage} />
         <main className="pb-20">
            {renderPage()}
         </main>
         <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
               <div>
                  <span className="text-2xl font-bold text-white mb-4 block">Nova</span>
                  <p className="text-sm text-gray-400">Modern e-commerce solutions for the future.</p>
               </div>
               <div>
                  <h4 className="text-white font-bold mb-4">Shop</h4>
                  <ul className="space-y-2 text-sm">
                     <li><button onClick={() => setPage('shop')} className="hover:text-white">All Products</button></li>
                     <li><button onClick={() => setPage('shop')} className="hover:text-white">New Arrivals</button></li>
                  </ul>
               </div>
               <div>
                  <h4 className="text-white font-bold mb-4">Company</h4>
                  <ul className="space-y-2 text-sm">
                     <li><button onClick={() => setPage('about')} className="hover:text-white">About Us</button></li>
                     <li><button onClick={() => setPage('faq')} className="hover:text-white">FAQ</button></li>
                  </ul>
               </div>
               <div>
                  <h4 className="text-white font-bold mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm">
                     <li>Privacy Policy</li>
                     <li>Terms of Service</li>
                  </ul>
               </div>
            </div>
         </footer>
         <ChatBot />
      </div>
   );
};

const App = () => {
   return (
      <AuthProvider>
         <StoreProvider>
            <AppContent />
         </StoreProvider>
      </AuthProvider>
   );
};

export default App;