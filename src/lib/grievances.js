// Seed grievances used as demo data. When a database is configured these are
// merged with the real records returned by /api/grievances.
export const SEED_GRIEVANCES = [
  { trackingId: '#G-8492A', district: 'Pune', category: 'Biometric Failure', status: 'Resolved', name: 'Sunita Verma', date: '02 Aug 2026' },
  { trackingId: '#G-7215B', district: 'Pune', category: 'Wage Delay', status: 'Resolved', name: 'A. Kale', date: '15 Jul 2026' },
  { trackingId: '#G-6103C', district: 'Nashik', category: 'Wrongful Exclusion', status: 'Under Review', name: 'R. Patil', date: '28 Jul 2026' },
  { trackingId: '#G-5521D', district: 'Nashik', category: 'Biometric Failure', status: 'Pending', name: 'M. Devi', date: '20 Jul 2026' },
  { trackingId: '#G-4410E', district: 'Nagpur', category: 'Benefit Not Received', status: 'Resolved', name: 'S. Kumar', date: '11 Jul 2026' },
  { trackingId: '#G-3392F', district: 'Nagpur', category: 'Wage Delay', status: 'Under Review', name: 'K. Rao', date: '30 Jul 2026' },
  { trackingId: '#G-2281G', district: 'Aurangabad', category: 'Wrongful Exclusion', status: 'Resolved', name: 'P. Shinde', date: '05 Jul 2026' },
  { trackingId: '#G-1170H', district: 'Aurangabad', category: 'Biometric Failure', status: 'Rejected', name: 'V. Jadhav', date: '18 Jun 2026' },
  { trackingId: '#G-9059I', district: 'Kolhapur', category: 'Wage Delay', status: 'Pending', name: 'N. Patil', date: '22 Jul 2026' },
  { trackingId: '#G-8048J', district: 'Kolhapur', category: 'Benefit Not Received', status: 'Under Review', name: 'D. More', date: '26 Jul 2026' },
  { trackingId: '#G-7037K', district: 'Solapur', category: 'Wrongful Exclusion', status: 'Resolved', name: 'B. Deshmukh', date: '09 Jul 2026' },
  { trackingId: '#G-6026L', district: 'Solapur', category: 'Biometric Failure', status: 'Pending', name: 'G. Gaikwad', date: '31 Jul 2026' },
  { trackingId: '#G-5015M', district: 'Pune', category: 'Wrongful Exclusion', status: 'Resolved', name: 'T. Nair', date: '12 Jul 2026' },
  { trackingId: '#G-4004N', district: 'Nashik', category: 'Benefit Not Received', status: 'Resolved', name: 'L. Sahu', date: '14 Jul 2026' },
  { trackingId: '#G-3093O', district: 'Nagpur', category: 'Wrongful Exclusion', status: 'Under Review', name: 'H. Meshram', date: '29 Jul 2026' },
]

export const CATEGORIES = ['Biometric Failure', 'Wrongful Exclusion', 'Wage Delay', 'Benefit Not Received']
export const DISTRICTS = ['Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Kolhapur', 'Solapur']
