export const Icons = {
  reaper: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 4C10.48 4 6 8.48 6 14c0 4.42 2.87 8.17 6.84 9.49L16 28l3.16-4.51C23.13 22.17 26 18.42 26 14c0-5.52-4.48-10-10-10z" 
        fill="url(#skull-gradient)" stroke="#ff0000" strokeWidth="1"/>
      <circle cx="12" cy="14" r="2" fill="#ff0000"/>
      <circle cx="20" cy="14" r="2" fill="#ff0000"/>
      <path d="M16 20c-2.21 0-4-1.79-4-4" stroke="#ff0000" strokeWidth="1.5"/>
      <defs>
        <linearGradient id="skull-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc143c"/>
          <stop offset="100%" stopColor="#8b0000"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  
  analytics: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="13" width="4" height="8" fill="#ff0000" opacity="0.8"/>
      <rect x="8" y="9" width="4" height="12" fill="#dc143c"/>
      <rect x="13" y="5" width="4" height="16" fill="#ff0000"/>
      <rect x="18" y="10" width="4" height="11" fill="#8b0000" opacity="0.9"/>
      <path d="M3 3L21 21" stroke="#c0c0c0" strokeWidth="1" opacity="0.3"/>
    </svg>
  ),
  
  views: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20s9.27-3.11 11-7.5C21.27 8.11 17 5 12 5z" 
        stroke="#ff0000" strokeWidth="2" fill="rgba(255,0,0,0.1)"/>
      <circle cx="12" cy="12.5" r="3.5" fill="#ff0000"/>
      <circle cx="12" cy="12.5" r="1.5" fill="#ffffff"/>
    </svg>
  ),
  
  revenue: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v20M17 7H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" 
        stroke="#00ff00" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="10" stroke="#00ff00" strokeWidth="1" fill="none" opacity="0.3"/>
    </svg>
  ),
  
  user: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 4L4 9v6c0 4.42 3.3 8.5 8 9.5c4.7-1 8-5.08 8-9.5V9l-8-5z" 
        fill="rgba(255,0,0,0.1)" stroke="#ff0000" strokeWidth="1"/>
      <circle cx="12" cy="10" r="3" fill="#ff0000"/>
      <path d="M12 14c-3.31 0-6 1.79-6 4v2h12v-2c0-2.21-2.69-4-6-4z" fill="#dc143c"/>
    </svg>
  ),
  
  ai: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="#c0c0c0" strokeWidth="1"/>
      <circle cx="9" cy="9" r="1" fill="#ff0000"/>
      <circle cx="15" cy="9" r="1" fill="#ff0000"/>
      <path d="M9 13Q12 16 15 13" stroke="#ff0000" strokeWidth="1" fill="none"/>
      <path d="M5 3L3 5M19 3l2 2M5 21l-2-2M19 21l2-2" stroke="#ff0000" strokeWidth="1" opacity="0.5"/>
    </svg>
  )
};
