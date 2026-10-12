import { useEffect, useState, type FormEvent } from 'react'
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  CreditCard,
  Heart,
  Leaf,
  LockKeyhole,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
  X,
} from 'lucide-react'
import { ProductGrid } from './components/ProductGrid'
import { categories, products } from './data/products'
import { useCart } from './hooks/useCart'
import { useProductCatalog } from './hooks/useProductCatalog'
import { useStoredState } from './hooks/useStoredState'
import type { Order, Product, ShopView } from './types/shop'
import { money } from './utils/money'
import './App.css'

function App() {
  const [wishlist, setWishlist, wishlistError] = useStoredState<number[]>('aakaar-objects-inr-wishlist', [])
  const [orders, setOrders, ordersError] = useStoredState<Order[]>('aakaar-objects-inr-orders', [])
  const [customer, setCustomer, customerError] = useStoredState<{ name: string; email: string } | null>(
    'aakaar-objects-inr-customer',
    null,
  )
  const [view, setView] = useState<ShopView>('shop')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('Featured')
  const [searchText, setSearchText] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [priceLimit, setPriceLimit] = useState(4000)
  const [ratingOnly, setRatingOnly] = useState(false)
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)
  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [checkoutName, setCheckoutName] = useState('')
  const [checkoutEmail, setCheckoutEmail] = useState('')
  const [checkoutAddress, setCheckoutAddress] = useState('')
  const [checkoutPhone, setCheckoutPhone] = useState('')
  const [checkoutError, setCheckoutError] = useState('')

  const {
    cart,
    count: cartCount,
    subtotal,
    items: cartProducts,
    error: cartError,
    add: addToCart,
    changeQuantity,
    clear: clearCart,
  } = useCart(setToast)
  const storageError = [cartError, wishlistError, ordersError, customerError].find(Boolean)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 550)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const pageSize = 6
  const { filteredProducts, shownProducts, pageCount } = useProductCatalog({
    appliedSearch,
    category,
    page,
    pageSize,
    priceLimit,
    ratingOnly,
    sort,
    view,
    wishlist,
  })

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.includes(product.id)
    setWishlist((current) =>
      exists ? current.filter((id) => id !== product.id) : [...current, product.id],
    )
    setToast(exists ? 'Removed from your saved list' : 'Saved for later')
  }

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAppliedSearch(searchText)
    setPage(1)
    setView('shop')
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  const selectCategory = (nextCategory: string) => {
    setCategory(nextCategory)
    setPage(1)
    setView('shop')
    setMobileMenuOpen(false)
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  const signIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = authName.trim() || authEmail.split('@')[0] || 'Friend'
    setCustomer({ name, email: authEmail })
    setAuthOpen(false)
    setToast(`Welcome in, ${name}`)
  }

  const placeOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!cart.length) {
      setCheckoutError('Your bag is empty. Add something lovely before checkout.')
      return
    }
    if (
      !checkoutName.trim() ||
      !checkoutEmail.trim() ||
      !checkoutAddress.trim() ||
      !/^[6-9]\d{9}$/.test(checkoutPhone.replace(/\s/g, ''))
    ) {
      setCheckoutError('Please complete each field to continue.')
      return
    }
    const shipping = subtotal >= 1499 ? 0 : 99
    const order: Order = {
      id: `AO-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      total: subtotal + shipping,
      items: cart,
      status: 'Order placed',
    }
    setOrders((current) => [order, ...current])
    clearCart()
    setCheckoutError('')
    setView('orders')
    setToast('Your order is in. Thank you!')
  }

  const openCheckout = () => {
    setCartOpen(false)
    setView('checkout')
    setCheckoutError('')
    if (customer) {
      setCheckoutName(customer.name)
      setCheckoutEmail(customer.email)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const chooseView = (nextView: Exclude<ShopView, 'checkout'>) => {
    setView(nextView)
    setCategory('All')
    setAppliedSearch('')
    setSearchText('')
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBackToShop = () => {
    setView('shop')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderShop = () => (
    <>
      {view === 'shop' && (
        <>
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow"><Sparkles size={14} /> Made in India, made to keep</span>
              <h1>Rooted in craft.<br /><em>Made for now.</em></h1>
              <p>CNC-carved wood and thoughtfully 3D-printed forms. Designed here, made in small batches by Indian makers.</p>
              <button className="button button-dark" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>
                Shop the collection <ArrowRight size={16} />
              </button>
              <div className="hero-proof"><div className="avatar-stack"><span>J</span><span>M</span><span>A</span></div><span>Made with independent Indian workshops</span></div>
            </div>
            <div className="hero-photo" role="img" aria-label="Handcrafted Indian woodwork and modern home decor">
              <div className="hero-note"><Leaf size={15} /><span>Precision made. Hand-finished.</span></div>
            </div>
            <div className="hero-index"><span>01</span><i /> 03</div>
          </section>

          <section className="category-section">
            <div className="section-heading">
              <div><span className="eyebrow">Made here, for your home</span><h2>Explore the collection</h2></div>
              <button className="text-link" onClick={() => selectCategory('All')}>View everything <ArrowRight size={15} /></button>
            </div>
            <div className="category-grid">
              {categories.map((item, index) => (
                <button className="category-card" key={item.name} onClick={() => selectCategory(item.name)}>
                  <img src={item.image} alt="" loading="lazy" />
                  <span className="category-number">0{index + 1}</span>
                  <span className="category-title">{item.name}</span>
                  <span className="category-count">{item.count}</span>
                  <span className="category-arrow"><ArrowRight size={16} /></span>
                </button>
              ))}
            </div>
          </section>

          <section className="craft-story">
            <div className="craft-story-image" role="img" aria-label="Wood and handcrafted objects made in a local workshop" />
            <div className="craft-story-copy">
              <span className="eyebrow"><Sparkles size={14} /> The Aakaar way</span>
              <h2>Precision from the machine.<br /><em>Character from the maker.</em></h2>
              <p>We pair CNC accuracy and 3D-printing with the eye, patience, and finishing touch of independent Indian workshops. Every piece is made in small batches, right here.</p>
              <div className="craft-story-points"><span><Check size={15} /> Made in India</span><span><Check size={15} /> Small-batch production</span><span><Check size={15} /> Thoughtful materials</span></div>
              <button className="text-link" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>Meet the collection <ArrowRight size={15} /></button>
            </div>
          </section>
        </>
      )}

      {view !== 'shop' && (
        <section className="page-heading">
          <button className="back-link" onClick={goBackToShop}><ArrowLeft size={15} /> Continue shopping</button>
          <span className="eyebrow">{view === 'wishlist' ? 'Your considered collection' : 'A little paper trail'}</span>
          <h1>{view === 'wishlist' ? 'Saved for later.' : 'Your orders.'}</h1>
          <p>{view === 'wishlist' ? 'Good things you have your eye on.' : 'Everything you have ordered, all in one place.'}</p>
        </section>
      )}

      {view === 'orders' ? (
        <section className="orders-section">
          {orders.length === 0 ? (
            <div className="empty-state"><PackageCheck size={34} /><h2>No orders just yet</h2><p>Your next favorite thing is waiting to be found.</p><button className="button button-dark" onClick={goBackToShop}>Explore the collection <ArrowRight size={16} /></button></div>
          ) : (
            <div className="order-list">
              {orders.map((order) => (
                <article className="order-card" key={order.id}>
                  <div className="order-card-top"><div><span className="eyebrow">Order {order.id}</span><h3>{order.date}</h3></div><span className="order-status"><Check size={13} /> {order.status}</span></div>
                  <div className="order-items">{order.items.map((line) => {
                    const product = products.find((item) => item.id === line.productId)
                    return product ? <div className="order-item" key={product.id}><img src={product.image} alt="" /><span>{product.name} <small>× {line.quantity}</small></span><strong>{money(product.price * line.quantity)}</strong></div> : null
                  })}</div>
                  <div className="order-total"><span>Order total</span><strong>{money(order.total)}</strong></div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="catalog-section" id="catalog">
          {view === 'shop' && (
            <>
              <div className="catalog-topline"><span className="eyebrow">Designed and made across India</span><span className="catalog-note"><Truck size={15} /> Free delivery over ₹1,499</span></div>
              <div className="catalog-title-row"><div><h2>Modern form, Indian craft.</h2><p>Small-batch CNC woodwork and 3D-printed objects with a story to tell.</p></div>
                <form className="search-form" onSubmit={search}><Search size={17} /><input aria-label="Search products" placeholder="Try lamp, nameplate, planter..." value={searchText} onChange={(event) => setSearchText(event.target.value)} /><button aria-label="Submit search"><ArrowRight size={16} /></button></form>
              </div>
            </>
          )}
          <div className="catalog-toolbar">
            <div className="catalog-tabs">
              {(view === 'wishlist' ? ['Saved for later'] : ['All', 'CNC Wood Art', '3D Printed', 'Home & Lighting', 'Personalised Gifts']).map((item) => {
                const value = item === 'Saved for later' ? item : item
                return <button key={item} className={category === value || (view === 'wishlist' && item === 'Saved for later') ? 'active' : ''} onClick={() => view === 'wishlist' ? undefined : selectCategory(value)}>{item}</button>
              })}
              <span className="result-count">{filteredProducts.length} pieces</span>
            </div>
            <div className="toolbar-actions">
              <button className={`filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={16} /> Filters</button>
              <label className="sort-select"><ArrowDownUp size={15} /><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option><option>Top rated</option></select><ChevronDown size={14} /></label>
            </div>
          </div>
          {showFilters && <div className="filter-panel"><label>Price up to <strong>{money(priceLimit)}</strong><input type="range" min="500" max="4000" step="100" value={priceLimit} onChange={(event) => { setPriceLimit(Number(event.target.value)); setPage(1) }} /></label><label className="check-filter"><input type="checkbox" checked={ratingOnly} onChange={(event) => { setRatingOnly(event.target.checked); setPage(1) }} /> Top rated (4.8+)</label><button className="text-link" onClick={() => { setPriceLimit(4000); setRatingOnly(false); setCategory('All'); setPage(1) }}>Clear filters</button></div>}
          {appliedSearch && <div className="search-result-line">Showing results for <strong>“{appliedSearch}”</strong><button onClick={() => { setAppliedSearch(''); setSearchText('') }}>Clear search <X size={13} /></button></div>}
          <ProductGrid
            products={shownProducts}
            loading={loading}
            wishlist={wishlist}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            onViewDetails={setActiveProduct}
            onClearFilters={() => {
              setAppliedSearch('')
              setSearchText('')
              setCategory('All')
              setPriceLimit(4000)
              setRatingOnly(false)
            }}
          />
          {!loading && pageCount > 1 && <div className="pagination"><span>Showing {Math.min((page - 1) * pageSize + 1, filteredProducts.length)}–{Math.min(page * pageSize, filteredProducts.length)} of {filteredProducts.length}</span><div><button aria-label="Previous page" disabled={page === 1} onClick={() => { setPage(page - 1); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }) }}><ChevronLeft size={17} /></button><span>{page} / {pageCount}</span><button aria-label="Next page" disabled={page === pageCount} onClick={() => { setPage(page + 1); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }) }}><ChevronRight size={17} /></button></div></div>}
        </section>
      )}
    </>
  )

  return (
    <div className="app-shell">
      <div className="announcement"><span>Small-batch design, made with Indian makers</span><span className="announcement-right"><Truck size={13} /> Free delivery on orders over ₹1,499</span></div>
      <header className="site-header">
        <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation">{mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        <button className="wordmark" onClick={goBackToShop} aria-label="Aakaar Objects home"><span className="wordmark-icon"><Leaf size={19} /></span><span>aakaar<span className="wordmark-market">objects</span></span></button>
        <nav className={`main-nav ${mobileMenuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <button className={view === 'shop' ? 'nav-active' : ''} onClick={() => chooseView('shop')}>Shop all</button>
          <button onClick={() => selectCategory('CNC Wood Art')}>CNC wood art</button>
          <button onClick={() => selectCategory('3D Printed')}>3D printed</button>
          <button onClick={() => selectCategory('Home & Lighting')}>Home & lighting</button>
          <button onClick={() => selectCategory('Personalised Gifts')}>Personalised gifts</button>
          <button className="nav-account" onClick={() => { setMobileMenuOpen(false); if (customer) chooseView('orders'); else setAuthOpen(true) }}>{customer ? 'My account' : 'Sign in'}</button>
        </nav>
        <div className="header-actions">
          <button className="header-icon account-button" onClick={() => customer ? chooseView('orders') : setAuthOpen(true)} aria-label={customer ? 'View account and orders' : 'Sign in'}><CircleUserRound size={20} /><span className="account-label">{customer ? customer.name : 'Account'}</span></button>
          <button className="header-icon wishlist-header" onClick={() => chooseView('wishlist')} aria-label="Open wishlist"><Heart size={20} />{wishlist.length > 0 && <span className="count-badge">{wishlist.length}</span>}</button>
          <button className="header-icon bag-button" onClick={() => setCartOpen(true)} aria-label={`Open shopping bag with ${cartCount} items`}><ShoppingBag size={20} /><span className="bag-label">Bag</span>{cartCount > 0 && <span className="count-badge">{cartCount}</span>}</button>
        </div>
      </header>

      {storageError && <div className="storage-alert" role="status"><span>{storageError}</span><button onClick={() => window.location.reload()} aria-label="Reload page"><X size={15} /></button></div>}

      {view === 'checkout' ? (
        <main className="checkout-page">
          <button className="back-link" onClick={() => setCartOpen(true)}><ArrowLeft size={15} /> Back to your bag</button>
          <div className="checkout-title"><span className="eyebrow">Just a few little details</span><h1>Make it yours.</h1><p>Easy checkout, delivered anywhere in India.</p></div>
          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={placeOrder}>
              <section className="checkout-step"><div className="step-heading"><span>01</span><div><h2>Your details</h2><p>Where should we send your order updates?</p></div></div><div className="form-grid"><label>Full name<input required value={checkoutName} onChange={(event) => setCheckoutName(event.target.value)} placeholder="Ananya Sharma" /></label><label>Email address<input type="email" required value={checkoutEmail} onChange={(event) => setCheckoutEmail(event.target.value)} placeholder="you@example.com" /></label></div><label className="phone-field">Mobile number<input type="tel" required pattern="[6-9][0-9]{4} ?[0-9]{5}" value={checkoutPhone} onChange={(event) => setCheckoutPhone(event.target.value)} placeholder="98765 43210" title="Enter a 10-digit Indian mobile number" /></label></section>
              <section className="checkout-step"><div className="step-heading"><span>02</span><div><h2>Delivery address</h2><p>We’ll take good care of it from here.</p></div></div><label>House, street and area<input required value={checkoutAddress} onChange={(event) => setCheckoutAddress(event.target.value)} placeholder="24, Linking Road, Bandra West" /></label><div className="form-grid"><label>City<input required placeholder="Mumbai" /></label><label>State<input required placeholder="Maharashtra" /></label></div><label className="phone-field">PIN code<input required inputMode="numeric" pattern="[1-9][0-9]{5}" maxLength={6} placeholder="400050" title="Enter a valid 6-digit Indian PIN code" /></label></section>
              <section className="checkout-step payment-placeholder"><div className="step-heading"><span>03</span><div><h2>Payment</h2><p>This demo checkout won’t charge you.</p></div></div><div className="demo-payment"><CreditCard size={20} /><span>Payment UI preview</span><LockKeyhole size={15} /><small>Secure checkout</small></div></section>
              {checkoutError && <p className="form-error" role="alert">{checkoutError}</p>}
              <button className="button button-dark place-order" type="submit">Place demo order <ArrowRight size={16} /></button>
              <p className="checkout-legal"><ShieldCheck size={14} /> Your information stays private and secure.</p>
            </form>
            <aside className="order-summary"><h2>Your bag <span>({cartCount})</span></h2>{cartProducts.map((line) => <div className="summary-product" key={line.product.id}><img src={line.product.image} alt="" /><div><strong>{line.product.name}</strong><small>Qty {line.quantity}</small></div><span>{money(line.product.price * line.quantity)}</span></div>)}<div className="summary-lines"><div><span>Subtotal</span><span>{money(subtotal)}</span></div><div><span>Delivery</span><span>{subtotal >= 1499 || subtotal === 0 ? 'Free' : money(99)}</span></div><div className="summary-total"><strong>Total</strong><strong>{money(subtotal + (subtotal >= 1499 || subtotal === 0 ? 0 : 99))}</strong></div></div><p className="summary-note"><Leaf size={14} /> GST included in listed prices.</p></aside>
          </div>
        </main>
      ) : (
        <main>{renderShop()}</main>
      )}

      <section className="promise-strip"><div><Leaf size={19} /><span><strong>Designed in India</strong><small>Made in small batches with local makers.</small></span></div><div><Truck size={19} /><span><strong>Thoughtful delivery</strong><small>Free across India over ₹1,499.</small></span></div><div><BadgeCheck size={19} /><span><strong>Made to order</strong><small>Personalised with care in our workshop.</small></span></div></section>
      <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><button className="wordmark" onClick={goBackToShop}><span className="wordmark-icon"><Leaf size={19} /></span><span>aakaar<span className="wordmark-market">objects</span></span></button><p>Modern objects, made with the skill and spirit of Indian craft.</p><span className="footer-note">A little more considered. A little more you.</span></div><div className="footer-column"><strong>Explore</strong><button onClick={() => chooseView('shop')}>Shop all</button><button onClick={() => selectCategory('CNC Wood Art')}>CNC wood art</button><button onClick={() => selectCategory('3D Printed')}>3D printed</button><button onClick={() => selectCategory('Home & Lighting')}>Home & lighting</button></div><div className="footer-column"><strong>Your account</strong><button onClick={() => customer ? chooseView('orders') : setAuthOpen(true)}>Sign in</button><button onClick={() => chooseView('orders')}>Order history</button><button onClick={() => chooseView('wishlist')}>Saved things</button><button onClick={() => setCartOpen(true)}>Your bag</button></div><div className="footer-newsletter"><strong>A note from our workshop.</strong><p>New designs, maker stories, and a little inspiration for your space.</p><form onSubmit={(event) => { event.preventDefault(); setToast('You’re on the list. Look out for a little note from our workshop.') }}><input type="email" required placeholder="Your email address" aria-label="Email for newsletter" /><button aria-label="Join newsletter"><ArrowRight size={17} /></button></form><small>No noise, just the good stuff.</small></div></div><div className="footer-bottom"><span>© 2026 Aakaar Objects</span><span>Designed and made in India.</span><span>Privacy&nbsp;&nbsp; · &nbsp;&nbsp;Terms</span></div></footer>

      {activeProduct && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveProduct(null) }}><section className="product-modal" role="dialog" aria-modal="true" aria-label={`${activeProduct.name} details`}><button className="modal-close" onClick={() => setActiveProduct(null)} aria-label="Close details"><X size={20} /></button><div className="modal-image"><img src={activeProduct.image} alt={activeProduct.name} /></div><div className="modal-content"><span className="eyebrow">{activeProduct.category} · Made in India</span><h2>{activeProduct.name}</h2><div className="modal-rating"><span className="rating"><Star size={14} fill="currentColor" /> {activeProduct.rating}</span><span>{activeProduct.reviews} lovely reviews</span></div><p className="modal-price">{money(activeProduct.price)} {activeProduct.compareAt && <del>{money(activeProduct.compareAt)}</del>}</p><p className="modal-description">{activeProduct.description}</p><p className="modal-color">Details <span>{activeProduct.color}</span></p><div className="modal-review"><div className="review-stars">★★★★★</div><p>“A beautiful mix of clever design and careful making. Even lovelier in person.”</p><small>— A happy Aakaar customer</small></div><div className="modal-buttons"><button className="button button-dark" onClick={() => { addToCart(activeProduct); setActiveProduct(null); setCartOpen(true) }}>Add to bag · {money(activeProduct.price)} <ArrowRight size={16} /></button><button className={`modal-heart ${wishlist.includes(activeProduct.id) ? 'is-saved' : ''}`} onClick={() => toggleWishlist(activeProduct)} aria-label="Save item"><Heart size={19} fill={wishlist.includes(activeProduct.id) ? 'currentColor' : 'none'} /></button></div><p className="shipping-note"><Truck size={15} /> Free delivery when your bag is over ₹1,499</p></div></section></div>}

      {cartOpen && <div className="drawer-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping bag"><div className="drawer-header"><div><span className="eyebrow">Your considered finds</span><h2>Your bag <span>({cartCount})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X size={20} /></button></div>{cartCount > 0 && <div className="free-shipping-meter"><span>{subtotal >= 1499 ? 'You’ve unlocked free delivery!' : `You’re ${money(1499 - subtotal)} away from free delivery`}</span><div><i style={{ width: `${Math.min((subtotal / 1499) * 100, 100)}%` }} /></div></div>}{cartProducts.length ? <><div className="cart-lines">{cartProducts.map((line) => <article className="cart-line" key={line.product.id}><img src={line.product.image} alt={line.product.name} /><div className="cart-line-info"><span className="cart-category">{line.product.category}</span><strong>{line.product.name}</strong><small>{line.product.color}</small><div className="quantity-control"><button onClick={() => changeQuantity(line.product.id, -1)} aria-label={`Remove one ${line.product.name}`}><Minus size={13} /></button><span>{line.quantity}</span><button onClick={() => changeQuantity(line.product.id, 1)} aria-label={`Add one ${line.product.name}`}><Plus size={13} /></button></div></div><strong className="cart-line-price">{money(line.product.price * line.quantity)}</strong></article>)}</div><div className="drawer-footer"><div className="subtotal-line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Delivery calculated at checkout. GST included in listed prices.</p><button className="button button-dark checkout-button" onClick={openCheckout}>Continue to checkout <ArrowRight size={16} /></button><button className="continue-link" onClick={() => setCartOpen(false)}>Keep browsing</button><span className="safe-note"><LockKeyhole size={13} /> Secure checkout · Easy returns</span></div></> : <div className="empty-state drawer-empty"><ShoppingBag size={34} /><h2>Your bag is taking a breath.</h2><p>It’s empty for now. There are good things waiting when you’re ready.</p><button className="button button-dark" onClick={() => setCartOpen(false)}>Find your something <ArrowRight size={16} /></button></div>}</aside></div>}

      {authOpen && <div className="overlay auth-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setAuthOpen(false) }}><section className="auth-modal" role="dialog" aria-modal="true" aria-label="Sign in"><button className="modal-close" onClick={() => setAuthOpen(false)} aria-label="Close sign in"><X size={20} /></button><div className="auth-icon"><Leaf size={21} /></div><span className="eyebrow">A familiar place</span><h2>Come on in.</h2><p>Sign in to find your saved things and order updates, all in one place.</p><form onSubmit={signIn}><label>Your name<input value={authName} onChange={(event) => setAuthName(event.target.value)} placeholder="Ananya Sharma" /></label><label>Email address<input type="email" required value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} placeholder="you@example.in" /></label><button className="button button-dark" type="submit">Continue with email <ArrowRight size={16} /></button></form><small className="auth-footnote"><LockKeyhole size={12} /> This is a friendly demo sign-in, no password needed.</small></section></div>}

      {toast && <div className="toast" role="status"><span className="toast-check"><Check size={15} /></span>{toast}<button onClick={() => setToast('')} aria-label="Dismiss message"><X size={15} /></button></div>}
      <div className="mobile-bottom-bar"><button onClick={() => chooseView('shop')}><Search size={19} /><span>Explore</span></button><button onClick={() => chooseView('wishlist')}><Heart size={19} /><span>Saved</span></button><button onClick={() => setCartOpen(true)}><ShoppingBag size={19} /><span>Bag {cartCount > 0 && `(${cartCount})`}</span></button></div>
    </div>
  )
}

export default App
