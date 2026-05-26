import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CardContext';
import ProtectedRoute from './ProtectedRoute';
import ResturantProtectedRoute from './ResturantProtectedRoute';
import RestaurantDashboard from './Pages/ResturantDashboard';
import CustomerDashboard from './Pages/CustomerDashboard';
import Payment from './Components/payment/payment';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import ListProductAddForm from "./Pages/ListProductAddForm";
import RestaurantLogin from "./Components/Auth/ResturantLogin";
import Address from "./Pages/Address";

function App() {
    return (
        <Router>
            <CartProvider>
                <Routes>

                    // Customer Homepage
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <CustomerDashboard />
                            </ProtectedRoute>
                        }
                    />

                    // Payment Gateway for Customer
                    <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />

                    // Delivery Address Form
                    <Route path="/address" element={<ProtectedRoute><Address /></ProtectedRoute>} />

                    // Login and Register for Customer
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    // Login for Resturant
                    <Route path="/resturant-login" element={<RestaurantLogin/>} />

                    // Resturant Dashboard
                    <Route path="/resturant" element={
                        <ResturantProtectedRoute>
                            <RestaurantDashboard/>
                        </ResturantProtectedRoute>

                    } />

                    // Resturant Add Product
                    <Route path="/resturant/listproductaddform" element={
                        <ResturantProtectedRoute>
                            <ListProductAddForm/>
                        </ResturantProtectedRoute>
                    } />

                </Routes>
            </CartProvider>
        </Router>
    );
}



export default App;