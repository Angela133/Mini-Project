"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState<'default' | 'success' | 'failure'>('default');

  const router = useRouter(); // for navigation

  useEffect(() => {
    localStorage.removeItem("loggedIn");
  }, [])


  useEffect(() => {
    if (loginStatus == "success") {
      router.push('/manage');
    }
  }, [loginStatus])

  const handleLogin = () => {
    let url = 'http://localhost:3002/login';

    let options = {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    };

    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        console.log(json);
        localStorage.setItem("loggedIn", "true"); //setting localstorage parameter 
        setLoginStatus('success');
      })
      .catch(err => {
        console.error('error:' + err);
        setLoginStatus('failure');
      });
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <code> User accounts are currently created upon request only. Please contact our team to enquire about new user account.</code>
        <br/><br/>
        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-semibold mb-2">Username</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-semibold mb-2">Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
