'use client';

import { useState, useEffect } from 'react';
import { getCandidates } from '../../services/api';
import Link from 'next/link';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('');
  const [filterAppliesFor, setFilterAppliesFor] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]); // Array of selected skills
  const [availableSkills, setAvailableSkills] = useState([]); // All unique skills
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false); // Toggle for skills dropdown

  useEffect(() => {
    async function fetchData() {
      const data = await getCandidates();
      setCandidates(data);
      setLoading(false);

      // Extract unique skills
      const skillsSet = new Set();
      data.forEach(candidate => {
        if (candidate.technicalSkills) {
          candidate.technicalSkills.split(',').forEach(skill => {
            skillsSet.add(skill.trim());
          });
        }
      });
      setAvailableSkills([...skillsSet].sort());
    }
    fetchData();
  }, []);

  const uniqueAppliesFor = [...new Set(candidates.map(c => c.appliesFor).filter(Boolean))].sort();

  const handleSkillChange = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesName = filterName
      ? (candidate.name || '').toString().toLowerCase().includes(filterName.toLowerCase())
      : true;
    const matchesAppliesFor = filterAppliesFor
      ? (candidate.appliesFor || '') === filterAppliesFor
      : true;
    
    // Skill Filter Logic: Match Any
    // If no skills selected, match all.
    // If skills selected, candidate must have AT LEAST ONE of the selected skills.
    const candidateSkills = (candidate.technicalSkills || '').split(',').map(s => s.trim().toLowerCase());
    const matchesSkill = selectedSkills.length === 0
      ? true
      : selectedSkills.some(selected => candidateSkills.includes(selected.toLowerCase()));

    return matchesName && matchesAppliesFor && matchesSkill;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            CSE-TECH Skill Hunt Spring 2026
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the top talent from our latest recruitment drive.
            </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 z-10 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Search by Name</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 border text-gray-900"
                            placeholder="e.g. Rahim"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Role</label>
                    <select
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg p-2.5 border bg-white text-gray-900"
                        value={filterAppliesFor}
                        onChange={(e) => setFilterAppliesFor(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        {uniqueAppliesFor.map((role) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>

                <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Skills</label>
                    <button
                        type="button"
                        className="relative w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-3 pr-10 py-2.5 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                    >
                        <span className="block truncate text-gray-900">
                            {selectedSkills.length === 0 ? 'Select Skills' : `${selectedSkills.length} selected`}
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </button>

                    {showSkillsDropdown && (
                        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                            {availableSkills.map((skill) => (
                                <div key={skill} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSkillChange(skill)}>
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        checked={selectedSkills.includes(skill)}
                                        readOnly
                                    />
                                    <label className="ml-3 block text-gray-900 cursor-pointer">
                                        {skill}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-xl font-bold text-gray-800">
                Candidates <span className="text-gray-400 font-normal">({filteredCandidates.length})</span>
            </h2>
            {candidates.length !== filteredCandidates.length && (
                <button
                    onClick={() => { setFilterName(''); setFilterAppliesFor(''); setSelectedSkills([]); }}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                >
                    Clear all filters
                </button>
            )}
        </div>

        {loading ? (
             <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
             </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
             <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">No candidates found</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col overflow-hidden group">
                <Link href={`/candidates/${candidate._id}`} className="block flex-1 cursor-pointer">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                {/* Avatar Placeholder */}
                                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl uppercase">
                                    {candidate.name ? candidate.name.charAt(0) : '?'}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                        {candidate.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium">ID: {candidate.studentId}</p>
                                </div>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                {candidate.section ? `Sec: ${candidate.section}` : 'N/A'}
                            </span>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="truncate" title={candidate.email}>{candidate.email}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <span>{candidate.currentSemester} Semester</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="font-semibold text-gray-800">{candidate.appliesFor}</span>
                            </div>
                        </div>

                        {candidate.technicalSkills && (
                            <div className="mt-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {candidate.technicalSkills.split(',').slice(0, 4).map((skill, i) => (
                                        <span key={i} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                    {candidate.technicalSkills.split(',').length > 4 && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-400">
                                            +{candidate.technicalSkills.split(',').length - 4} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </Link>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-2 text-center text-xs font-medium">
                     {candidate.resumeUrl ? (
                        <a href={candidate.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center py-2 rounded border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors">
                            Resume
                        </a>
                     ) : <span className="text-gray-400 flex items-center justify-center py-2 border border-transparent">No Resume</span>}
                     
                     <div className="flex space-x-2 justify-center">
                         {candidate.githubProfile && (
                            <a href={candidate.githubProfile} target="_blank" rel="noreferrer" className="p-2 text-gray-500 hover:text-gray-900 transition-colors" title="GitHub">
                                 <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                     <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                 </svg>
                            </a>
                         )}
                          {candidate.portfolioUrl && (
                             <a href={candidate.portfolioUrl} target="_blank" rel="noreferrer" className="p-2 text-gray-500 hover:text-blue-600 transition-colors" title="LinkedIn/Portfolio">
                                 <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                     <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                 </svg>
                             </a>
                         )}
                     </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
