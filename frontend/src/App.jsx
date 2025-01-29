import { useState } from 'react';
import CustomerDashboard from './Pages/CustomerDashboard';
import './App.css'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <CustomerDashboard/>
        </>
    )
}

export default App
