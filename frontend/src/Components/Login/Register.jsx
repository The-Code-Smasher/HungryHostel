// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Login.css';

// const Register = () => {
//     const [activeTab, setActiveTab] = useState('signup');
//     const navigate = useNavigate();
//     const handleTabSwitch = (tab) => {
//         setActiveTab(tab);
//     };

//     const handleNavigation = (target) => {
//         if (target === 'signup') {
//             navigate('/register');
//         } else if (target === 'login') {
//             navigate('/login');
//         }
//     };

//     return (
//         <div className="auth-container">
//             <div className="tabs">
//                 <div
//                     className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
//                     onClick={() => handleTabSwitch('signup')}
//                 >
//                     Sign Up
//                 </div>
//                 <div
//                     className={`tab ${activeTab === 'login' ? 'active' : ''}`}
//                     onClick={() => handleTabSwitch('login')}
//                 >
//                     Login
//                 </div>
//             </div>

//             {/* Sign Up Form */}
//             {activeTab === 'signup' && (
//                 <div className="form-container active" id="signup">
//                     <form action="/register" method="post">
//                         <label htmlFor="username">User Name</label>
//                         <input
//                             type="text"
//                             name="username"
//                             id="username"
//                             placeholder="Enter your username"
//                             required
//                         />

//                         <label htmlFor="email">Email</label>
//                         <input
//                             type="email"
//                             name="email"
//                             id="email"
//                             placeholder="Enter your email"
//                             required
//                         />

//                         <label htmlFor="password">Password</label>
//                         <input
//                             type="password"
//                             name="password"
//                             id="password"
//                             placeholder="Enter your password"
//                             required
//                         />

//                         <button type="submit">Register</button>
//                     </form>
//                     <div className="alt-option">
//                         Already have an account?{' '}
//                         <button onClick={() => handleTabSwitch('login')}>Login</button>
//                     </div>
//                 </div>
//             )}

//             {/* Login Form */}
//             {activeTab === 'login' && (
//                 <div className="form-container active" id="login">
//                     <form action="/login" method="post">
//                         <label htmlFor="email">Email</label>
//                         <input
//                             type="email"
//                             name="email"
//                             id="email"
//                             placeholder="Enter your email"
//                             required
//                         />

//                         <label htmlFor="password">Password</label>
//                         <input
//                             type="password"
//                             name="password"
//                             id="password"
//                             placeholder="Enter your password"
//                             required
//                         />

//                         <button type="submit">Login</button>
//                     </form>
//                     <div className="alt-option">
//                         Don't have an account?{' '}
//                         <button onClick={() => handleTabSwitch('signup')}>Sign Up</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Register;