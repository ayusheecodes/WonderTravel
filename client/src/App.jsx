import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Home      from './pages/home/home'
import Flights   from './pages/flights/Flights'
import Trains    from './pages/trains/Trains'
import Hotels    from './pages/hotels/Hotels'
import Cabs      from './pages/cabs/Cabs'
import Login     from './pages/login/Login'
import Signup    from './pages/signup/Signup'
import Dashboard from './pages/dashboard/Dashboard'
import Itinerary from './pages/Itinerary/Itinerary'
import Explore from './pages/Explore/Explore'
import Offers from './pages/offers/Offers'
import Checkout from './pages/Checkout/Checkout'
import BookingSuccess from './pages/BookingSuccess/BookingSuccess'
import InfoPage from './pages/info/InfoPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes without Layout (e.g. Auth) */}
          <Route path="/login"     element={<Login />}     />
          <Route path="/signup"    element={<Signup />}    />
          
          {/* Routes with Navbar and Footer */}
          <Route element={<Layout />}>
            <Route path="/"          element={<Home />}      />
            <Route path="/flights"   element={<Flights />}   />
            <Route path="/trains"    element={<Trains />}    />
            <Route path="/hotels"    element={<Hotels />}    />
            <Route path="/cabs"      element={<Cabs />}      />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/explore"   element={<Explore />} />
            <Route path="/offers"    element={<Offers />} />
            <Route path="/checkout"  element={<Checkout />} />
            <Route path="/success"   element={<BookingSuccess />} />
            <Route path="/info/:slug" element={<InfoPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
