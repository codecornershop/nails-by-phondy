import { Component, createSignal, For } from 'solid-js';
import './style.css';

const App: Component = () => {
  const [showServices, setShowServices] = createSignal(false);
  const [showGallery, setShowGallery] = createSignal(false);

  const galleryImages = [
    'img1.webp',
    'img2.webp',
    'img3.webp',
    'img4.webp',
    'img5.webp',
    'img6.webp',
    'img9.webp',
    'img10.webp'
  ];

  //Manicure (Nail sets) 
  const [sets, setSets] = createSignal([
    { name: 'Acrylic (Short)', price: 100, category: "manicure", selected: false },
    { name: 'Acrylic (Medium)', price: 150, category: "manicure", selected: false },
    { name: 'Acrylic (Long)', price: 200, category: "manicure", selected: false },
    { name: "Rubber Base", price: 220, category: "manicure", selected: false },
    { name: "Polygel", price: 260, category: "manicure", selected: false },
  ]);

  // Pedicure
  const [pedicure, setPedicure] = createSignal([
    { name: 'Gel Overlay, Foot Scrub, Massage', price: 250, category:'pedicure', selected: false },
    { name: 'Foot Scrub, Massage, Nail Strengthening', price: 200, category: 'pedicure', selected: false },
  ]);

  // Manicure
  const [manicure, setManicure] = createSignal([
    { name: "Buff and Shine", price: 70, category: "manicure", selected: false },
    { name: "Massage/Treatment - 5 Minutes", price: 100, category: "manicure", selected: false },
    { name: "Gel Overlay, Massage, Hand Scrub - 10 Minutes", price: 200, category: "manicure", selected: false },
    { name: "Soak Off", price: 70, category: "manicure", selected: false },
  ]);

  // Add-ons (Multiple selections possible)
  const [addOns, setAddOns] = createSignal([
    {name: 'Rhinestones (each)', price: 10, quantity: 0},
    {name: 'Chrome /Cateye (each)', price: 15, quantity: 0},
    {name: 'Ombre (each)', price: 12, quantity: 0}
  ]);

  // Calculate Total
  const totalPrice = () => {
    const setTotal = sets().find(s => s.selected)?.price || 0;
    const pediTotal = pedicure().find(p => p.selected)?.price || 0;
    const manicureTotal = manicure()
      .filter(m => m.selected)
      .reduce((sum, m) => sum + m.price, 0);
    const addOnsTotal = addOns()
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return setTotal + pediTotal + manicureTotal + addOnsTotal;
  };

  // Toggle add-on
  const [formData, setFormData] = createSignal({
    name: '',
    email: '',
    service: '',
    addOns: [] as string[],
    date: ''
  });

  const hasSelection = () => {
    const setSelected = sets().some(s => s.selected);
    const manicureSelected = manicure().some(m => m.selected);
    const pediSelected = pedicure().some(p => p.selected);
    const hasAddOns = addOns().some(a => a.quantity > 0);
    return setSelected || manicureSelected || pediSelected || hasAddOns;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    const selectedSets = sets().filter(s => s.selected);
    const selectedPedi = pedicure().filter(p => p.selected);
    const selectedManicure = manicure().filter(m => m.selected);

    const orderLines = [
      ...selectedSets.map(s => `${s.name} - R${s.price}`),
      ...selectedManicure.map(m => `${m.name} -R${m.price}`),
      ...selectedPedi.map(p => `${p.name} - R${p.price}`),
      ...addOns().filter(a => a.quantity > 0).map(a => `${a.name} x${a.quantity} (R${a.price * a.quantity})`)
    ].join('%0A');

    const message = `*New Booking Request!*%0A%0A
    *Customer:* ${formData().name}%0A
    *Email:* ${formData().email}%0A
    *Date:* ${formData().date}%0A
    *Order:*%0A
    ${orderLines}%0A
    *Total:* R${totalPrice()}%0A%0A
    _Reply to this message to confirm booking_`;

    const phoneNumber = '27818171278'; 
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    //For now, log to console
    //console.log('Booking request:', {
    //  customer: formData().name,
    //  email: formData().email,
    //  date: formData().date,
    //  selectedSet: selectedSet?.name,
    //  addOns: addOnsList,
    //  total: totalPrice()
    //});
     //Later: send to email or google forms 
   };

  return (
    <div class="container">
    {/*Hero*/}
      <header class="hero">
        <h1>Nails by Phondy</h1>
        <p>
        Professional nail care at your convenience
        </p>
        <a href="#contact" class="btn hero-btn">
          Book Now
        </a>
      </header>

      {/* Gallery Preview */}
      <section class="collapsible-section">
        <div class="section-header" onClick={() => setShowGallery(!showGallery())}>
          <h2>Recent Work</h2>
          <span class="toggle-icon" style={{ transform: showGallery() ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
            ▾
          </span>
        </div>
        {showGallery() && (
          <div class="section-content">
            <div class="gallery-grid">
              {/* Gallery Images */}
              <For each={galleryImages}>
                {(img) => (
                  <img
                    src={`${import.meta.env.BASE_URL}images/gallery/${img}`}
                    alt="Nail design"
                    loading="lazy"
                    onClick={() => window.open(`${import.meta.env.BASE_URL}images/gallery/${img}`, '_blank')}
                  />
                )}
              </For>
            </div>
          </div>
        )}
      </section>

      {/* Contact Form */}
      <section id="contact" class="contact">
        <h2>Book Your Appointment</h2>
        <form onSubmit={handleSubmit}>
          <label for="customer-name">Your name</label>
          <input
            type="text"
            id="customer-name"
            placeholder="Your name"
            value={formData().name}
            onInput={(e) => setFormData({...formData(), name: e.currentTarget.value })}
            required
          />
          <label for="customer-email">Email address</label>
          <input
            type="email"
            id="customer-email"
            placeholder="name@email.com"
            value={formData().email}
            onInput={(e) => setFormData({...formData(), email: e.currentTarget.value })}
          />
          {/* Services */}
          <section class="collapsible-section">
            <div class="section-header" onClick={() => setShowServices(!showServices())}>
              <h2>Services & Prices</h2>
              <span class="toggle-icon" style={{ transform: showServices() ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                ▾
              </span>
            </div>
            {showServices() && (
              <div class="section-content">
                {/* Manicures */}
                <div class="service-group">
                  <h3>Manicure</h3>
                  <For each={sets()}>
                    {(item, index) => (
                      <div
                        classList={{ 'service-card': true, 'service-item': true, 'selected': item.selected }}
                        onClick={() => {
                          setSets(prev => prev.map((s, i) => ({
                            ...s,
                            selected: i === index()
                          })));
                        }}
                      >
                        <span>{item.name}</span>
                        <span>R{item.price}</span>
                      </div>
                    )}
                  </For>
                  <For each={manicure()}>
                    {(item, index) => (
                      <div
                        classList={{ 'service-card': true, 'service-item': true, 'selected': item.selected }}
                        onClick={() => {
                          setManicure(prev => prev.map((m, i) => ({
                            ...m,
                            selected: i ===  index() ? !m.selected : m.selected
                          })));
                        }}
                      >
                        <span>{item.name}</span>
                        <span>R{item.price}</span>
                      </div>
                    )}
                  </For>
                </div>

                {/* Pedicure (Radio Group)*/}
                <div class="service-group">
                  <h3>Pedicure</h3>
                  <For each={pedicure()}>
                    {(item, index) => (
                      <div
                        classList={{ 'service-card': true, 'service-item': true, 'selected': item.selected }}
                        onClick={() => {
                          setPedicure(prev => prev.map((p, i) => ({
                            ...p,
                            selected: i === index()
                          })));
                        }}
                      >
                        <span>{item.name}</span>
                        <span>R{item.price}</span>
                      </div>
                    )}
                  </For>
                </div>

                {/* Add Ons */}
                <div class="service-group">
                  <h3>Add-Ons</h3>
                  <div class="addon-grid">
                    <For each={addOns()}>
                      {(item, index) => (
                        <div class="addon-card">
                          <span class="addon-name">{item.name}</span>
                          <span class="addon-price">+R{item.price}</span>
                        <div class="quantity-control">
                          <button
                            type="button"
                            class="qty-button"
                            onClick={() => {
                              const newQty = Math.max(0, item.quantity - 1);
                              setAddOns(prev => prev.map((a, i) => 
                                                        i === index() ? {...a, quantity: newQty } : a
                                                        ));
                            }}
                          >
                            -
                          </button>
                          <span class="qty-badge">{item.quantity}</span>
                          <button
                            type="button"
                            class="qty-button"
                            onClick={() => {
                              const newQty = Math.min(10, item.quantity + 1);
                              setAddOns(prev => prev.map((a, i) =>
                                                        i === index() ? { ...a, quantity: newQty } : a
                                                        ));
                            }}
                          >
                            +
                          </button>
                            {item.quantity > 0 && (
                              <button
                                type="button"
                                class="clear-btn"
                                onClick={() => {
                                  setAddOns(prev => prev.map((a, i) =>
                                                            i === index() ? {...a, quantity: 0 } : a
                                                            ));
                                }}
                              >
                              {'\u2715'}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>

                {/* Special */}
                <div class="service-group">
                  <h3>Specials</h3>
                  <div class="service-grid">
                    <div class="service-item">
                      <span>Bring A Friend: </span>
                      <span>Receive R20 Off</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
          {hasSelection() && (
            <div class="price-sticky">
              <div class="price-indicator">
                <h4>Total: R{totalPrice()}</h4>
              </div>
            </div>
          )}

          <label for="booking-date">Booking Date</label>
          <input
            type="date"
            id="booking-date"
            value={formData().date}
            onInput={(e) => setFormData({...formData(), date: e.currentTarget.value })}
            required
          />
          <button
            type='button'
            class="clear-selection-btn"
            onClick={() => {
              setSets(prev => prev.map(s => ({ ...s, selected: false })));
              setManicure(prev => prev.map(m => ({ ...m, selected: false })));
              setPedicure(prev => prev.map(p => ({ ...p, selected: false })));
              setAddOns(prev => prev.map(a => ({ ...a, quantity: 0 })));
            }}
          >
            Clear All
          </button>
          <button type="submit">Request Booking</button>
        </form>
      </section>


      {/* Contact Info Bar */}
      <footer class="footer-mini">
        <a href="https://instagram.com/nailsbyphondy" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <span class="footer-divider"> | </span>
        <a href="https://github.com/cornercodeshop" target="_blank" rel="noopener noreferrer" aria-label="Corner Code Shop on GitHub">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
      </footer>
    </div>
  );
};

export default App;
