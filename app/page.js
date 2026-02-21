'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyAccess } from '../services/api';

export default function Page() {
  const [accessId, setAccessId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Basic check if already logged in
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

    const result = await verifyAccess(accessId);

    if (result.success) {
      localStorage.setItem('auth', JSON.stringify({
        role: result.role,
        id: result.id,
        name: result.name,
        accessId: accessId
      }));
      
      if (result.role === 'admin') {
        router.push('/candidates');
      } else {
        router.push(`/candidates/${result.id}`);
      }
    } else {
      setError(result.message || 'Invalid ID. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Skill Hunt Portal</h1>
          <p className="text-slate-400">Enter your ID to access the recruitment drive</p>
        </div>

        <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-700 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="accessId" className="block text-sm font-medium text-slate-300 mb-2">
                Access ID
              </label>
              <input
                id="accessId"
                type="text"
                placeholder="e.g. 221-15-0092"
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={accessId}
                onChange={(e) => setAccessId(e.target.value)}
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
                  <span>Verify Identity</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Protected Recruitment Portal &bull; CSE-TECH 2026
        </p>
      </div>
    </div>
  );
}