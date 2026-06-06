import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import styles from './BookingSuccess.module.css';

const buildBookingId = (items, total) => {
  const source = `${items.map((item) => `${item.type}-${item.title}-${item.price}`).join('|')}-${total}`;
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = ((hash << 5) - hash + source.charCodeAt(index)) >>> 0;
  }
  return `WT-${hash.toString(36).toUpperCase().padStart(8, '0').slice(0, 8)}`;
};

export default function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const ticketRef = useRef(null);

  // Read data passed from Checkout.jsx
  const cartItems = useMemo(() => location.state?.cartItems || [], [location.state?.cartItems]);
  const cartTotal = location.state?.cartTotal || 0;
  const bookingId = useMemo(() => buildBookingId(cartItems, cartTotal), [cartItems, cartTotal]);
  const qrCells = useMemo(
    () => Array.from({ length: 25 }, (_, index) => ((index * 7 + bookingId.charCodeAt(index % bookingId.length)) % 3) !== 0),
    [bookingId]
  );

  useEffect(() => {
    // If user somehow gets here without items, boot them
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems, navigate]);

  // BUG-03 fix: don't render null synchronously — that caused a flash of blank
  // content before the useEffect redirect fires. Show a neutral loading state instead.
  if (cartItems.length === 0) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Redirecting…
      </div>
    )
  }

  const handleDownloadPDF = () => {
    const element = ticketRef.current;
    const opt = {
      margin:       10,
      // Bug #6 fix: use the stable, deterministic bookingId instead of Math.random()
      filename:     `WonderTravel_Booking_${bookingId}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className={styles.page}>
      <div className={styles.successContainer}>
        <div className={styles.checkCircle}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1>Payment Successful!</h1>
        <p>Your booking <strong>#{bookingId}</strong> has been confirmed.</p>

        <div className={styles.actions}>
          <button className={styles.downloadBtn} onClick={handleDownloadPDF}>
            <span>📄</span> Download E-Ticket
          </button>
          <button className={styles.homeBtn} onClick={() => navigate('/')}>
            Return Home
          </button>
        </div>

        {/* HIDDEN TICKET FOR PDF GENERATION */}
        <div className={styles.pdfWrapper}>
          <div className={styles.ticket} ref={ticketRef}>
            <div className={styles.ticketHeader}>
              <div className={styles.brand}>
                <span className={styles.brandLogo}>🌎</span>
                <span>WonderTravel</span>
              </div>
              <div className={styles.ticketMeta}>
                <div>Booking ID: {bookingId}</div>
                <div>Date: {new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div className={styles.ticketBody}>
              <h2>E-Ticket Confirmation</h2>
              <div className={styles.ticketItems}>
                {cartItems.map((item, idx) => {
                  // Bug #17 fix: render type-specific heading and details for every
                  // booking type, not just flights. Previously all non-flight items
                  // showed 'Itinerary Package' with no details at all.
                  const typeLabel = {
                    flight:    'Flight Ticket',
                    hotel:     'Hotel Booking',
                    train:     'Train Ticket',
                    cab:       'Cab Booking',
                    itinerary: 'Itinerary Package',
                  }[item.type] || 'Booking'

                  return (
                    <div key={idx} className={styles.tItem}>
                      <h3>{typeLabel}</h3>
                      <div className={styles.tRow}>
                        <strong>{item.title}</strong>
                        <span>{item.subtitle}</span>
                      </div>

                      {item.type === 'flight' && item.details && (
                        <div className={styles.tDetails}>
                          <span>{item.details.dep} → {item.details.arr}</span>
                          <span>Date: {item.details.date || 'Open'}</span>
                          <span>Class: {item.details.class || 'Economy'}</span>
                          <span>Passengers: {item.details.passengers || 1}</span>
                        </div>
                      )}

                      {item.type === 'hotel' && item.details && (
                        <div className={styles.tDetails}>
                          <span>Check-in: {item.details.checkIn || '–'}</span>
                          <span>Check-out: {item.details.checkOut || '–'}</span>
                          {item.details.roomType && <span>Room: {item.details.roomType}</span>}
                        </div>
                      )}

                      {item.type === 'train' && item.details && (
                        <div className={styles.tDetails}>
                          <span>{item.details.from || '–'} → {item.details.to || '–'}</span>
                          <span>Date: {item.details.date || 'Open'}</span>
                          {item.details.class && <span>Class: {item.details.class}</span>}
                        </div>
                      )}

                      {item.type === 'cab' && item.details && (
                        <div className={styles.tDetails}>
                          <span>Pickup: {item.details.pickup || '–'}</span>
                          <span>Drop: {item.details.drop || '–'}</span>
                          {item.details.date && <span>Date: {item.details.date}</span>}
                        </div>
                      )}

                      {item.type === 'itinerary' && (
                        <div className={styles.tDetails}>
                          <span>{item.subtitle}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className={styles.ticketTotal}>
                <span>Total Amount Paid</span>
                <strong>₹{Math.round(cartTotal * 1.18).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className={styles.ticketFooter}>
              <div className={styles.qrCode}>
                <div className={styles.qrGrid}>
                  {qrCells.map((isDark, i) => (
                    <div key={i} className={isDark ? styles.qrDark : styles.qrLight} />
                  ))}
                </div>
              </div>
              <div className={styles.terms}>
                <p>This is a computer generated document. No signature required.</p>
                <p>Please arrive at least 2 hours before departure.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
