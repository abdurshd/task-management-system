export function PanesIcon({ className }: { className?: string }) {
  return (
    <div className="rounded-lg overflow-hidden">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={className}
      >
        <rect x="4" y="4" width="16" height="16" rx="2.4" ry="2.4" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path fill="none" stroke="#FFFFFF" strokeWidth="2" d="M4 4h16v16H4z"/>
        <path fill="none" stroke="#FFFFFF" strokeWidth="2" d="M15 4v11"/>
        <path fill="none" stroke="#FFFFFF" strokeWidth="2" d="M4 15h16"/>
        <path fill="none" stroke="#FFFFFF" strokeWidth="2" d="M9 15v5"/>
      </svg>
    </div>
  );
} 