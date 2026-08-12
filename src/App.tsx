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

  //Base service selection
  const [sets, setSets] = createSignal([
    // Acryclic sets
    { name: 'Acrylic (Short)', price: 100, category: "manicure", selected: false },
    { name: 'Acrylic (Medium)', price: 150, category: "manicure", selected: false },
    { name: 'Acrylic (Long)', price: 200, category: "manicure", selected: false },
    // Gel Sets
    {name: "Rubber Base", price: 220, category: "manicure", selected: false},
    {name: "Polygel", price: 260, category: "manicure", selected: false},
    // Manicure
    {name: "Buff and Shine", price: 70, category: "manicure", selected: false},
    {name: "Massage/Treatment - 5 Minutes", price: 100, category: "manicure", selected: false},
    {name: "Gel Overlay, Massage, Hand Scrub - 10 Minutes", price: 200, category: "manicure", selected: false},
    {name: "Soak Off", price: 70, category: "manicure", selected: false},
    // Pedicure
    {name: "Gel Overlay, Foot Scrub, Massage", price: 250, category: "pedicure", selected: false},
    {name: "Foot Scrub, Massage, Nail Strengthening", price: 200, category: "pedicure", selected: false}
  ]);

  const categories = () => {
    const all = sets().map(p => p.category);
    return [...new Set(all)];
  };

  // Add-ons (Multiple selections possible)
  const [addOns, setAddOns] = createSignal([
    {name: 'Rhinestones (each)', price: 10, quantity: 0},
    {name: 'Chrome /Cateye (each)', price: 15, quantity: 0},
    {name: 'Ombre (each)', price: 12, quantity: 0}
  ]);

  // Calculate Total
  const totalPrice = () => {
    const setTotal = sets()
      .filter(s => s.selected)
      .reduce((sum, item) => sum + item.price, 0);
    const addOnsTotal = addOns()
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return setTotal + addOnsTotal;
  };

  // Toggle set
  const toggleSet = (index: number) => {
    setSets(prev => prev.map((item, i) => 
      i === index ? {...item, selected: !item.selected } : item,
    ));
  };

  // Toggle add-on
  const [formData, setFormData] = createSignal({
    name: '',
    email: '',
    service: '',
    addOns: [] as string[],
    date: ''
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    const selectedSets = sets().filter(s => s.selected);
    const setList = selectedSets.map(s => `${s.name} - R${s.price}`).join('%0A');
    const addOnsList = addOns().filter(a => a.quantity > 0).map(a => `${a.name} x ${a.quantity} - R${a.price * a.quantity}`).join(', ');

    const message = `*New Booking Request!*%0A%0A
    *Customer:* ${formData().name}%0A
    *Email:* ${formData().email}%0A
    *Date:* ${formData().date}%0A
    *Order:*%0A
    ${setList || 'None Selected'}%0A
    ${addOnsList || 'No add-ons'}%0A%0A
    *Total:* R${totalPrice()}%0A%0A
    _Reply to this message to confirm booking_`;

    const phoneNumber = '27818171278'; 
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    //For now, log to console
    console.log('Booking request:', {
      customer: formData().name,
      email: formData().email,
      date: formData().date,
      selectedSet: selectedSet?.name,
      addOns: addOnsList,
      total: totalPrice()
    });
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
                {/* Acrylic Sets */}
                <For each={categories()}>
                {(category) => (
                  <div class="service-group">
                    <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                    <div class="service-grid">
                      <For each={sets().filter(p => p.category === category)}>
                        {(item) => {
                          const fullIndex = sets().indexOf(item);
                          return (
                            <div
                              classList={{
                                'service-item': true,
                                'service-card': true,
                                'selected': item.selected
                              }}
                              onClick={() => toggleSet(fullIndex)}
                            >
                              <span class="service-name">{item.name}</span>
                              <span class="service-price">R{item.price}</span>
                            </div>
                          );
                        }}
                      </For>
                    </div>
                  </div>
                )}
                </For>

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
                              const newQty = Math.min(10, item.quantity + 1);
                              setAddOns(prev => prev.map((a, i) =>
                                                        i === index() ? { ...a, quantity: newQty } : a
                                                        ));
                            }}
                          >
                            +
                          </button>
                          <span class="qty-badge">{item.quantity}</span>
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
          <div class="price-indicator">
            <h4>Total: R{totalPrice()}</h4>
          </div>

          <label for="booking-date">Booking Date</label>
          <input
            type="date"
            id="booking-date"
            value={formData().date}
            onInput={(e) => setFormData({...formData(), date: e.currentTarget.value })}
            required
          />
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
