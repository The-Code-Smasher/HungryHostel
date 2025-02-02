import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CardContext';
//import ProtectedRoute from './ProtectedRoute';
import RestaurantDashboard from './Pages/ResturantDashboard';
import CustomerDashboard from './Pages/CustomerDashboard';
import Payment from './Components/payment/payment';
import Login from './Components/Auth/login';
import Register from './Components/Auth/Register';

function App() {
    return (
        <Router>
            <CartProvider>
                <Routes>
                    <Route
                        path="/"
                        element={
    //                        <ProtectedRoute>
                                <CustomerDashboard />
        //                    </ProtectedRoute>
                        }
                    />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/resturant" element={<RestaurantDashboard />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </CartProvider>
        </Router>
    );
}

export default App;
