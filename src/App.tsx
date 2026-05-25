import { Component, createSignal, For } from 'solid-js';
import './style.css';

const App: Component = () => {
  const [showServices, setShowServices] = createSignal(true);
  const [showGallery, setShowGallery] = createSignal(true);

  //Base service selection
  const [sets, setSets] = createSignal([
    { name: 'Short Set', price: 100, selected: false },
    { name: 'Medium Set', price: 150, selected: false },
    { name: 'Long Set', price: 200, selected: false }
  ]);

  //Add-ons (Multiple selections possible)
  const [addOns, setAddOns] = createSignal([
    {name: 'Nail Art', price: 30, selected: false},
    {name: 'Nail Repair', price: 20, selected: false},
    {name: 'Soak Off', price: 40, selected: false}
  ]);

  // Calculate Total
  const totalPrice = () => {
    const setTotal = sets().find(s => s.selected)?.price || 0;
    const addOnsTotal = addOns()
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.price, 0);
    return setTotal + addOnsTotal;
  };

  //Toggle set
  const selectSet = (index: number) => {
    setSets(prev => prev.map((set, i) => ({
      ...set,
      selected: i === index
    })));
  };

  //Toggle add-on
  const toggleAddOn = (index: number) => {
    setAddOns(prev => prev.map((item, i) => 
                              i === index ? { ...item, selected: !item.selected } : item
                              ));
  };

  const [formData, setFormData] = createSignal({
    name: '',
    email: '',
    service: '',
    addOns: [] as string[],
    date: ''
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    const selectedSet = sets().find(s => s.selected);
    const addOns = addOns().filter(a => a.selected);

    const message = `*New Booking Request!*%0A%0A
    *Customer:* ${formData().name}%0A
    *Email:* ${formData().email}%0A
    *Date:* ${formData().date}%0A
    *Order:*%0A
    ${selectedSet?.name} - R${selectedSet?.price}%0A
    ${selectedAddOns.map(a => `+ ${a.name} - R${a.price}`).join(`%0A`) || 'No add-ons'}%0A%0A
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
      addOns: selectedAddOnsList.map(a => a.name),
      total: totalPrice()
    });
    //Later: send to email or google forms 
  };

  return (
    <div class="container">
    {/*Hero*/}
      <header class="hero">
        <h1>Nails by Phondi</h1>
        <p>
        Professional nail care at your convenience
        </p>
        <a href="#contact" class="btn">
          Book Now
        </a>
      </header>

      {/* Services */}
      <section class="collapsible-section">
        <div class="section-header" onClick={() => setShowServices(!showServices())}>
          <h2>Services & Prices</h2>
          <span class="toggle-icon">{showServices() ? '-' : '+'}</span>
        </div>
        {showServices() && (
          <div class="section-content">
            {/* Acrylic Sets */}
            <div class="service-group">
              <h3>Acrylic Sets</h3>
              <div class="service-list">
                <div class="service-item">
                  <span>Full Set (Short): </span>
                  <span>R100</span>
                </div>
                <div class="service-item">
                  <span>Full Set (Medium): </span>
                  <span>R150</span>
                </div>
                <div class="service-item">
                  <span>Full Set (Long): </span>
                  <span>R200</span>
                </div>
              </div>
            </div>

            {/* Add Ons */}
            <div class="service-group">
              <h3>Add-Ons</h3>
              <div class="service-list">
                <div class="service-item">
                  <span>Nail Art: </span>
                  <span>R10-R30</span>
                </div>
                <div class="service-item">
                  <span>Nail Repair: </span>
                  <span>R20</span>
                </div>
                <div class="service-item">
                  <span>Soak Off: </span>
                  <span>R40</span>
                </div>
              </div>
            </div>

            {/* Special */}
            <div class="service-group">
              <h3>Specials</h3>
              <div class="service-list">
                <div class="service-item">
                  <span>Bring A Friend: </span>
                  <span>Receive R20 Off</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Gallery Preview */}
      <section class="collapsible-section">
        <div class="section-header" onClick={() => setShowGallery(!showGallery())}>
          <h2>Recent Work</h2>
          <span class="toggle-icon">{showGallery() ? '-' : '+'}</span>
        </div>
        {showGallery() && (
          <div class="section-content">
            <div class="gallery-grid">
              {/* Gallery Images */}
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
          <div class="form-section">
            <fieldset class="radio-fieldset">
              <legend class="form-label">Choose your set:</legend>
              <div class="radio-group">
                <For each={sets()}>
                  {(set, index) => (
                    <label class="radio-option">
                      <input
                        type="radio"
                        name="set"
                        checked={set.selected}
                        onChange={() => selectSet(index())}
                      />
                      <span> {set.name}</span>
                    </label>
                  )}
                </For>
              </div>
            </fieldset>
          </div>
          <div class="form-section">
            <fieldset class="checkbox-fieldset">
              <legend class="form-label">Add-Ons (optional): </legend>
              <div class="checkbox-group">
                <For each={addOns()}>
                  {(addOn, index) => (
                    <label class="checkbox-option">
                      <input
                        type="checkbox"
                        name="addon"
                        checked={addOn.selected}
                        onChange={() => toggleAddOn(index())}
                      />
                      <span> {addOn.name}</span>
                    </label>
                  )}
                </For>
              </div>
            </fieldset>
          </div>
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
        <a href="https://wa.me/27818171278">Whatsapp</a>
        <a href="https://instagram.com/nailsbyphondy">Instagram</a>
        <span>Mon-Sat 9AM - 5PM</span>
      </footer>
    </div>
  );
};

export default App;
