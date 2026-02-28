'use client';

import { useState, useEffect } from 'react';
import { getCandidateById, updateCandidateAssessment } from '../../../services/api';
import { use } from 'react';
import Link from 'next/link';
import AssessmentClosedBanner from '../../../components/AssessmentClosedBanner';
import { useRouter } from 'next/navigation';

export default function CandidateDetailsPage({ params }) {
  // Unwrap params using React.use()
  const { id } = use(params);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [auth, setAuth] = useState(null);
  const [assessmentQuestionUrl, setAssessmentQuestionUrl] = useState('');
  const [assessmentData, setAssessmentData] = useState({
    assessmentGithub: '',
    assessmentLiveLink: '',
    assessmentDoc1: '',
    assessmentDoc2: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('auth') || 'null');
    setAuth(authData);
    
    if (!authData) {
      router.push('/');
      return;
    }

    if (authData.role === 'candidate' && authData.id !== id) {
      router.push('/');
      return;
    }

    async function fetchData() {
      if (id) {
        const data = await getCandidateById(id);
        setCandidate(data);
        if (data) {
          setAssessmentQuestionUrl(data.assessmentQuestionUrl || '');
          setAssessmentData({
            assessmentGithub: data.assessmentGithub || '',
            assessmentLiveLink: data.assessmentLiveLink || '',
            assessmentDoc1: data.assessmentDoc1 || '',
            assessmentDoc2: data.assessmentDoc2 || ''
          });
        }
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Candidate Not Found</h2>
        <p className="text-gray-600 mb-8">The candidate you are looking for does not exist or has been removed.</p>
        <Link href="/candidates" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          Back to Candidates
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/candidates" className="text-gray-500 hover:text-gray-900 flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Candidates
          </Link>
          <button 
            onClick={() => { localStorage.removeItem('auth'); router.push('/'); }}
            className="inline-flex items-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-lg text-slate-600 bg-white hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-indigo-50">
            <div className="flex items-center space-x-4">
               <div className="h-16 w-16 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-3xl uppercase">
                  {candidate.name ? candidate.name.charAt(0) : '?'}
               </div>
               <div>
                  <h3 className="text-2xl leading-6 font-bold text-gray-900">
                    {candidate.name}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-indigo-600 font-medium">
                    {candidate.appliesFor}
                  </p>
               </div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {candidate.studentId}
            </span>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <a href={`mailto:${candidate.email}`} className="text-indigo-600 hover:underline">
                        {candidate.email}
                    </a>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Current Semester</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{candidate.currentSemester}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Section</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{candidate.section}</dd>
              </div>
              
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Technical Skills</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                     <div className="flex flex-wrap gap-2">
                        {candidate.technicalSkills && candidate.technicalSkills.split(',').map((skill, i) => (
                            <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {skill.trim()}
                            </span>
                        ))}
                    </div>
                </dd>
              </div>

              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                 <dt className="text-sm font-medium text-gray-500">Links</dt>
                 <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex flex-col space-y-2">
                    {candidate.resumeUrl && (
                         <a href={candidate.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center text-indigo-600 hover:text-indigo-900">
                             <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                             Resume / CV
                         </a>
                    )}
                    {candidate.githubProfile && (
                         <a href={candidate.githubProfile} target="_blank" rel="noreferrer" className="flex items-center text-gray-700 hover:text-black">
                             <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                             GitHub Profile
                         </a>
                    )}
                    {candidate.portfolioUrl && (
                         <a href={candidate.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:text-blue-800">
                            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                             Portfolio / LinkedIn
                         </a>
                    )}
                 </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Recruitment Assessment Section */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg border-2 border-indigo-100">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-indigo-100">
            <h3 className="text-lg leading-6 font-bold text-gray-900">Recruitment Assessment</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {auth?.role === 'admin' ? "Manage this candidate's assessment." : "Submit your technical assessment solution."}
            </p>
          </div>
          
          <div className="px-4 py-6 sm:px-6 space-y-8">
            {/* Admin Section: Question Assignment */}
            {auth?.role === 'admin' && (
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Assessment Question Setup</h4>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Assessment Link (Drive/Doc)</label>
                    <input 
                      type="url"
                      placeholder="https://drive.google.com/..."
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      value={assessmentQuestionUrl}
                      onChange={(e) => setAssessmentQuestionUrl(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      onClick={async () => {
                        setSubmitting(true);
                        setMessage({ type: '', text: '' });
                        try {
                          await updateCandidateAssessment(id, { assessmentQuestionUrl });
                          setMessage({ type: 'success', text: 'Assessment question assigned successfully!' });
                        } catch (err) {
                          setMessage({ type: 'error', text: err.message });
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                      disabled={submitting}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : 'Assign URL'}
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-400 italic">This link will be visible to the candidate when they log in.</p>
              </div>
            )}

            {/* Candidate Section: Download Question */}
            {auth?.role === 'candidate' && (
              <div className="text-center p-8 bg-indigo-50/50 rounded-2xl border border-dashed border-indigo-200">
                {candidate.assessmentQuestionUrl ? (
                  <>
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
                      <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Technical Assessment Question</h4>
                    <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">Please download the questions using the button below and follow the instructions carefully.</p>
                    <a 
                      href={candidate.assessmentQuestionUrl}
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:scale-105"
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Get Assessment Questions
                    </a>
                  </>
                ) : (
                  <div className="py-4">
                    <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-4">
                      <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Awaiting Assessment</h4>
                    <p className="text-sm text-gray-600">The recruitment team has not assigned your assessment question yet. Please check back later.</p>
                  </div>
                )}
              </div>
            )}

            {(auth?.role === 'admin' || candidate.assessmentQuestionUrl) && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-white text-sm font-semibold text-gray-500 uppercase tracking-widest">
                      {auth?.role === 'admin' ? 'Received Solutions' : 'Submit Solution'}
                    </span>
                  </div>
                </div>

            {auth?.role === 'admin' ? (
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Submitted Links (Read-only)</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">GitHub Repository</span>
                    {candidate.assessmentGithub ? (
                      <a href={candidate.assessmentGithub} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline break-all">
                        {candidate.assessmentGithub}
                      </a>
                    ) : <span className="text-gray-400">Not submitted</span>}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">Live Preview Link</span>
                    {candidate.assessmentLiveLink ? (
                      <a href={candidate.assessmentLiveLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline break-all">
                        {candidate.assessmentLiveLink}
                      </a>
                    ) : <span className="text-gray-400">Not submitted</span>}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">Assessment Document 1</span>
                    {candidate.assessmentDoc1 ? (
                      <a href={candidate.assessmentDoc1} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline break-all">
                        {candidate.assessmentDoc1}
                      </a>
                    ) : <span className="text-gray-400">Not submitted</span>}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">Assessment Document 2</span>
                    {candidate.assessmentDoc2 ? (
                      <a href={candidate.assessmentDoc2} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline break-all">
                        {candidate.assessmentDoc2}
                      </a>
                    ) : <span className="text-gray-400">Not submitted</span>}
                  </div>
                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">Submission Time</span>
                    {candidate.assessmentSubmittedAt ? (
                      <span className="text-gray-700">
                        {new Date(candidate.assessmentSubmittedAt).toLocaleString()}
                      </span>
                    ) : <span className="text-gray-400">N/A</span>}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <AssessmentClosedBanner />
                {/*
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setSubmitting(true);
                  setMessage({ type: '', text: '' });
                  try {
                    await updateCandidateAssessment(id, assessmentData);
                    setMessage({ type: 'success', text: 'Assessment documents submitted successfully!' });
                  } catch (err) {
                    setMessage({ type: 'error', text: err.message });
                  } finally {
                    setSubmitting(false);
                  }
                }} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Link</label>
                      <input 
                        type="url"
                        placeholder="https://github.com/username/repo"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        value={assessmentData.assessmentGithub}
                        onChange={(e) => setAssessmentData({...assessmentData, assessmentGithub: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Live Preview Link</label>
                      <input 
                        type="url"
                        placeholder="https://your-live-site.com"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        value={assessmentData.assessmentLiveLink}
                        onChange={(e) => setAssessmentData({...assessmentData, assessmentLiveLink: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Document Link 1 (Drive/PDF)</label>
                      <input 
                        type="url"
                        placeholder="https://drive.google.com/..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        value={assessmentData.assessmentDoc1}
                        onChange={(e) => setAssessmentData({...assessmentData, assessmentDoc1: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Document Link 2 (Drive/PDF)</label>
                      <input 
                        type="url"
                        placeholder="https://drive.google.com/..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        value={assessmentData.assessmentDoc2}
                        onChange={(e) => setAssessmentData({...assessmentData, assessmentDoc2: e.target.value})}
                      />
                    </div>
                  </div>

                  {message.text && (
                    <div className={`p-4 rounded-lg flex items-center space-x-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {message.type === 'success' ? (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      ) : (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      )}
                      <span className="text-sm font-medium">{message.text}</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                          Submitting...
                        </>
                      ) : 'Submit Assessment'}
                    </button>
                  </div>
                </form>
                */}
              </>
            )}
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
