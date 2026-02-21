'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatus('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('If the email exists in our system, a password reset link has been generated. (Check server terminal for link)');
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-slate-400">Enter your email to receive a reset link</p>
        </div>

        <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-700 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="e.g. admin@cse-tech.com"
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-2 text-red-400 text-sm">
                <span>{error}</span>
              </div>
            )}

            {status && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center space-x-2 text-green-400 text-sm">
                <span>{status}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
            >
              {loading ? 'Processing...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              &larr; Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
