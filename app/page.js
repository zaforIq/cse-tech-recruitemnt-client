'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyAccess, verifyCandidateIdentity, setCandidatePassword } from '../services/api';
import Link from 'next/link';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Modal State
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupStep, setSetupStep] = useState(1); // 1: Verify, 2: Set Password
  const [setupStudentId, setSetupStudentId] = useState('');
  const [setupEmail, setSetupEmail] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirm, setSetupConfirm] = useState('');
  const [setupError, setSetupError] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('auth') || 'null');
    if (auth) {
      if (auth.role === 'admin') {
        router.push('/candidates');
      } else if (auth.role === 'candidate' && auth.id) {
        router.push(`/candidates/${auth.id}`);
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await verifyAccess(email, password);

    if (result.success) {
      localStorage.setItem('auth', JSON.stringify({
        role: result.role,
        id: result.id,
        name: result.name,
        email: email
      }));
      
      if (result.role === 'admin') {
        router.push('/candidates');
      } else {
        router.push(`/candidates/${result.id}`);
      }
    } else {
      setError(result.message || 'Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  const handleSetupVerify = async (e) => {
    e.preventDefault();
    setSetupLoading(true);
    setSetupError('');

    const result = await verifyCandidateIdentity(setupStudentId, setupEmail);
    if (result.success) {
      setSetupStep(2);
    } else {
      setSetupError(result.message || 'Could not verify details.');
    }
    setSetupLoading(false);
  };

  const handleSetupPassword = async (e) => {
    e.preventDefault();
    if (setupPassword !== setupConfirm) {
      setSetupError('Passwords do not match');
      return;
    }
    if (setupPassword.length < 6) {
      setSetupError('Password must be at least 6 characters');
      return;
    }

    setSetupLoading(true);
    setSetupError('');

    const result = await setCandidatePassword(setupStudentId, setupEmail, setupPassword);
    
    if (result.success) {
      // Log them in immediately
      localStorage.setItem('auth', JSON.stringify({
        role: result.role,
        id: result.id,
        name: result.name,
        email: result.email
      }));
      setShowSetupModal(false);
      router.push(`/candidates/${result.id}`);
    } else {
      setSetupError(result.message || 'Failed to set password.');
    }
    setSetupLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 relative">
      <div className="max-w-md w-full z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Skill Hunt Portal</h1>
          <p className="text-slate-400">Log in to access the recruitment drive</p>
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-2 text-red-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <p className="text-slate-400 text-sm mb-3">First time logging in as a candidate?</p>
            <button 
              onClick={() => { setShowSetupModal(true); setSetupStep(1); setSetupError(''); }}
              className="text-indigo-400 hover:text-white font-medium transition-colors border border-indigo-500/30 hover:border-indigo-400 hover:bg-indigo-500/10 rounded-lg px-4 py-2 w-full"
            >
              Set up your password
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Protected Recruitment Portal &bull; CSE-TECH 2026
        </p>
      </div>

      {/* Setup Password Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowSetupModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              {setupStep === 1 ? 'Verify Identity' : 'Set Password'}
            </h2>
            <p className="text-slate-400 mb-6 text-sm">
              {setupStep === 1 
                ? 'Enter your Student ID and Email to verify your candidate profile.' 
                : 'Create a secure password for your account moving forward.'}
            </p>

            {setupStep === 1 ? (
              <form onSubmit={handleSetupVerify} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Student ID</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 text-white"
                    value={setupStudentId}
                    onChange={(e) => setSetupStudentId(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 text-white"
                    value={setupEmail}
                    onChange={(e) => setSetupEmail(e.target.value)}
                  />
                </div>
                {setupError && <p className="text-red-400 text-sm mt-2">{setupError}</p>}
                <button
                  type="submit"
                  disabled={setupLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl mt-4"
                >
                  {setupLoading ? 'Verifying...' : 'Verify'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSetupPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 text-white"
                    value={setupPassword}
                    onChange={(e) => setSetupPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 text-white"
                    value={setupConfirm}
                    onChange={(e) => setSetupConfirm(e.target.value)}
                  />
                </div>
                {setupError && <p className="text-red-400 text-sm mt-2">{setupError}</p>}
                <button
                  type="submit"
                  disabled={setupLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl mt-4"
                >
                  {setupLoading ? 'Saving...' : 'Save & Login'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}