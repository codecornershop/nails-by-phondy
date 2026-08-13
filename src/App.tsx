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
      <footer class="info-bar">
        <a href="https://instagram.com/nailsbyphondy">Instagram</a>
      </footer>
    </div>
  );
};

export default App;
