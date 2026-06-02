import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';
import API from '../../api/axios';
import styles from './Checkout.module.css';

export default function Checkout() {
  const navigate = useNavigate();
  
  // ✅ Subscribe individually to avoid infinite loop
  const cartItems = useCartStore((state) => state.cartItems);
  const cartTotal = useCartStore((state) => state.cartTotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', cardNumber: '', expiry: '', cvc: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      const userStr = localStorage.getItem('wondertravel_user');
      const userObj = userStr ? JSON.parse(userStr) : null;
      const token = userObj?.token;

      if (!token) {
        throw new Error('Please log in to complete your booking.');
      }

      // Bug #8 fix: use Promise.allSettled so a single item failure doesn't
      // silently leave the user in a half-booked state. We report exactly how
      // many items failed and keep the cart intact so they can retry.
      const results = await Promise.allSettled(
        cartItems.map((item) => API.post('/bookings', buildBookingPayload(item)))
      );

      const failures = results.filter((result) => result.status === 'rejected');

      if (failures.length > 0) {
        const firstError = failures[0].reason?.response?.data?.message
          || failures[0].reason?.message
          || 'Unknown error';
        setError(
          failures.length === cartItems.length
            ? `Booking failed: ${firstError}`
            : `${failures.length} of ${cartItems.length} bookings failed. Please try again. (${firstError})`
        );
        setProcessing(false);
        return;
      }

      // All bookings saved — clear cart and navigate to success page
      clearCart();
      navigate('/success', { state: { cartItems, cartTotal } });

    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || err.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  // Maps cart item to booking schema
  const buildBookingPayload = (item) => {
    // Parse valid date or fallback to now
    let safeDate = new Date();
    if (item.details?.date && item.details.date !== 'Select Date') {
      const parsed = new Date(item.details.date);
      if (!isNaN(parsed)) safeDate = parsed;
    }

    const base = {
      bookingType: item.type,   // 'flight' | 'hotel' | 'train' | 'cab'
      totalAmount: item.price,
      status: 'confirmed',
    };

    if (item.type === 'flight') {
      return {
        ...base,
        travelDate: safeDate,
        passengers: item.details?.passengers || 1,
        flightDetails: {
          airline: item.title,
          code:    item.details?.code    || '',
          from:    item.details?.from    || '',
          to:      item.details?.to      || '',
          dep:     item.details?.dep     || '',
          arr:     item.details?.arr     || '',
          class:   item.details?.class   || 'Economy',
          fare:    String(item.price),
        },
      };
    }

    if (item.type === 'hotel') {
      return {
        ...base,
        hotelDetails: {
          hotelName: item.title,
          location:  item.subtitle      || '',
          roomType:  item.details?.roomType || 'Standard',
          checkIn:   item.details?.checkIn  || new Date(),
          checkOut:  item.details?.checkOut || new Date(),
          nights:    item.details?.nights   || 1,
          guests:    String(item.details?.guests || 1),
        },
      };
    }

    if (item.type === 'train') {
      return {
        ...base,
        travelDate: safeDate,
        trainDetails: {
          trainName:   item.title,
          trainNumber: item.details?.trainNumber || '',
          from:        item.details?.from  || '',
          to:          item.details?.to    || '',
          class:       item.details?.class || 'Sleeper',
          dep:         item.details?.dep   || '',
          arr:         item.details?.arr   || '',
        },
      };
    }

    if (item.type === 'cab') {
      return {
        ...base,
        cabDetails: {
          driverName: item.details?.driverName || 'Assigned',
          vehicle:    item.details?.vehicle    || '',
          pickup:     item.details?.pickup     || '',
          drop:       item.details?.drop       || '',
        },
      };
    }

    // fallback for itinerary/package type
    return {
      ...base,
      bookingType: 'hotel',
      hotelDetails: {
        hotelName: item.title,
        location: item.subtitle || 'Itinerary package',
        roomType: 'Curated package',
        checkIn: safeDate,
        checkOut: safeDate,
        nights: item.details?.nights || 1,
        guests: String(item.details?.guests || 1),
      },
    };
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyPage}>
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some flights or itineraries to checkout.</p>
          <button className={styles.backBtn} onClick={() => navigate('/flights')}>Browse Flights</button>
        </div>
      </div>
    );
  }

  const tax = Math.round(cartTotal * 0.18);
  const finalTotal = cartTotal + tax;

  return (
    <div className={styles.page}>
      <div className={styles.checkoutContainer}>

        {/* LEFT: Payment Form */}
        <div className={styles.paymentSection}>
          <div className={styles.header}>
            <h1>Complete Payment</h1>
            <p>Secure checkout powered by WonderTravel</p>
          </div>

          <form className={styles.form} onSubmit={handlePay}>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input required type="text" name="name" placeholder="John Doe" onChange={handleInputChange} />
              </div>
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input required type="email" name="email" placeholder="john@example.com" onChange={handleInputChange} />
              </div>
            </div>

            <div className={styles.cardBox}>
              <div className={styles.cardHeader}>
                <div className={styles.cardLogos}>
                  <div className={styles.visa} />
                  <div className={styles.mastercard} />
                </div>
                <span>Credit / Debit Card</span>
              </div>

              <div className={styles.inputGroup}>
                <label>Card Number</label>
                <input required type="text" maxLength="19" name="cardNumber" placeholder="0000 0000 0000 0000" onChange={handleInputChange} />
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Expiry Date</label>
                  <input required type="text" maxLength="5" name="expiry" placeholder="MM/YY" onChange={handleInputChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label>CVC</label>
                  <input required type="password" maxLength="4" name="cvc" placeholder="123" onChange={handleInputChange} />
                </div>
              </div>
            </div>

            {/* ✅ Show error if API call fails */}
            {error && (
              <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={processing} className={styles.payBtn}>
              {processing ? <div className={styles.spinner} /> : `Pay ₹${finalTotal.toLocaleString('en-IN')}`}
            </button>
          </form>
        </div>

        {/* RIGHT: Order Summary */}
        <div className={styles.summarySection}>
          <h2>Order Summary</h2>
          <div className={styles.itemsList}>
            {cartItems.map((item, idx) => (
              <div key={idx} className={styles.cartItem}>
                <div className={styles.itemIcon}>{item.type === 'flight' ? '✈️' : '🗺️'}</div>
                <div className={styles.itemDetails}>
                  <h4>{item.title}</h4>
                  <p>{item.subtitle}</p>
                </div>
                <div className={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>

          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Taxes & Fees (GST 18%)</span>
              <span>₹{tax.toLocaleString('en-IN')}</span>
            </div>
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total Due</span>
              <span>₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className={styles.secureBadge}>
            <span className={styles.lockIcon}>🔒</span>
            Payments are secure and encrypted.
          </div>
        </div>

      </div>
    </div>
  );
}
