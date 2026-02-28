export default function AssessmentClosedBanner() {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-lg shadow-sm">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-amber-800">Assessment Submissions Closed</h3>
          <div className="mt-2 text-sm text-amber-700">
            <p>
              We are no longer accepting submissions for this assessment. If you have any questions, please contact the recruitment team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
