import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CardContext';
import ProtectedRoute from './ProtectedRoute';
import ResturantProtectedRoute from './ResturantProtectedRoute';
import RestaurantDashboard from './Pages/ResturantDashboard';
import CustomerDashboard from './Pages/CustomerDashboard';
import Payment from './Components/payment/payment';
import Login from './Components/Auth/login';
import Register from './Components/Auth/Register';
import ListProductAddForm from "./Pages/ListProductAddForm";
import RestaurantLogin from "./Components/Auth/ResturantLogin";

function App() {
    return (
        <Router>
            <CartProvider>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <CustomerDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/resturant" element={
                        <ResturantProtectedRoute>
                            <RestaurantDashboard/>
                        </ResturantProtectedRoute>
                        
                    } />
                    <Route path="/resturant-login" element={<RestaurantLogin/>} />
                    <Route path="/resturant/listproductaddform" element={
                        <ResturantProtectedRoute>
                            <ListProductAddForm/>
                        </ResturantProtectedRoute>
                    } />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </CartProvider>
        </Router>
    );
}



export default App;