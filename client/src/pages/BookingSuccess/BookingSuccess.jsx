import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import styles from './BookingSuccess.module.css';

export default function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const ticketRef = useRef(null);

  // Read data passed from Checkout.jsx
  const cartItems = location.state?.cartItems || [];
  const cartTotal = location.state?.cartTotal || 0;

  useEffect(() => {
    // If user somehow gets here without items, boot them
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems, navigate]);

  if (cartItems.length === 0) return null;

  const handleDownloadPDF = () => {
    const element = ticketRef.current;
    const opt = {
      margin:       10,
      filename:     `WonderTravel_Booking_${Math.floor(Math.random()*10000)}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const bookingId = `WT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

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
                {cartItems.map((item, idx) => (
                  <div key={idx} className={styles.tItem}>
                    <h3>{item.type === 'flight' ? 'Flight Ticket' : 'Itinerary Package'}</h3>
                    <div className={styles.tRow}>
                      <strong>{item.title}</strong>
                      <span>{item.subtitle}</span>
                    </div>
                    {item.type === 'flight' && (
                      <div className={styles.tDetails}>
                        <span>{item.details?.dep} → {item.details?.arr}</span>
                        <span>Date: {item.details?.date || 'Open'}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.ticketTotal}>
                <span>Total Amount Paid</span>
                <strong>₹{Math.round(cartTotal * 1.18).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className={styles.ticketFooter}>
              <div className={styles.qrCode}>
                <div className={styles.qrGrid}>
                  {Array.from({length: 25}).map((_, i) => (
                    <div key={i} className={Math.random() > 0.5 ? styles.qrDark : styles.qrLight} />
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