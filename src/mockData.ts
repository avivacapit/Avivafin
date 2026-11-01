import { ClientApplication } from './types';

// Crisp sample SVG data URIs for default document previews
const sampleAadhaarFront = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="190" viewBox="0 0 300 190"><rect width="300" height="190" rx="8" fill="%23ffffff" stroke="%230284c7" stroke-width="2"/><rect y="0" width="300" height="24" fill="%23f97316"/><rect y="166" width="300" height="24" fill="%2316a34a"/><circle cx="150" cy="95" r="14" fill="none" stroke="%230369a1" stroke-width="2"/><text x="15" y="42" font-family="sans-serif" font-size="11" font-weight="bold" fill="%230f172a">GOVERNMENT OF INDIA</text><rect x="15" y="55" width="55" height="65" rx="4" fill="%23e2e8f0"/><circle cx="42" cy="80" r="14" fill="%2394a3b8"/><path d="M22 110 C22 96, 62 96, 62 110" fill="%2394a3b8"/><text x="80" y="70" font-family="sans-serif" font-size="10" font-weight="bold" fill="%230f172a">Ram Kumar</text><text x="80" y="85" font-family="sans-serif" font-size="8" fill="%2364748b">DOB: 14/08/1990</text><text x="80" y="100" font-family="sans-serif" font-size="8" fill="%2364748b">Gender: Male</text><text x="60" y="145" font-family="monospace" font-size="13" font-weight="bold" fill="%230f172a">XXXX-XXXX-4921</text><text x="210" y="42" font-family="sans-serif" font-size="9" fill="%230284c7">AADHAAR</text></svg>`;

const sampleAadhaarBack = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="190" viewBox="0 0 300 190"><rect width="300" height="190" rx="8" fill="%23ffffff" stroke="%230284c7" stroke-width="2"/><rect y="0" width="300" height="24" fill="%23f97316"/><rect y="166" width="300" height="24" fill="%2316a34a"/><text x="15" y="42" font-family="sans-serif" font-size="10" font-weight="bold" fill="%230f172a">UNIQUE IDENTIFICATION AUTHORITY OF INDIA</text><text x="15" y="65" font-family="sans-serif" font-size="8" font-weight="bold" fill="%23334155">Address:</text><text x="15" y="80" font-family="sans-serif" font-size="8" fill="%23475569">S/O Rajesh Kumar, Plot 42, Green Avenue,</text><text x="15" y="93" font-family="sans-serif" font-size="8" fill="%23475569">Bandra West, Mumbai, MH - 400050</text><rect x="210" y="60" width="65" height="65" fill="%230f172a"/><rect x="215" y="65" width="25" height="25" fill="%23ffffff"/><rect x="245" y="95" width="25" height="25" fill="%23ffffff"/><text x="15" y="145" font-family="sans-serif" font-size="8" fill="%230369a1">Toll Free: 1947 | help@uidai.gov.in</text></svg>`;

const samplePhoto = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23e0f2fe"/><circle cx="100" cy="80" r="42" fill="%230284c7"/><path d="M40 180 C40 135, 160 135, 160 180" fill="%230369a1"/><text x="100" y="192" font-family="sans-serif" font-size="10" text-anchor="middle" font-weight="bold" fill="%23072545">Client Photo: Ram Kumar</text></svg>`;

const sampleNomineeAadhaar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="190" viewBox="0 0 300 190"><rect width="300" height="190" rx="8" fill="%23f8fafc" stroke="%2338bdf8" stroke-width="2"/><text x="15" y="38" font-family="sans-serif" font-size="10" font-weight="bold" fill="%230369a1">NOMINEE AADHAAR CARD</text><rect x="15" y="55" width="55" height="65" rx="4" fill="%23cbd5e1"/><circle cx="42" cy="80" r="13" fill="%2364748b"/><path d="M22 110 C22 96, 62 96, 62 110" fill="%2364748b"/><text x="80" y="70" font-family="sans-serif" font-size="10" font-weight="bold" fill="%230f172a">Priya Kumar</text><text x="80" y="85" font-family="sans-serif" font-size="8" fill="%2364748b">Relation: Spouse</text><text x="60" y="145" font-family="monospace" font-size="13" font-weight="bold" fill="%230f172a">XXXX-XXXX-8832</text></svg>`;

export const DEFAULT_APPLICATIONS: ClientApplication[] = [
  {
    id: 1,
    fullName: 'Ram Kumar',
    email: 'ram@example.com',
    phone: '+91 98765 43210',
    dob: '14/08/1990',
    address: 'Plot 42, Green Avenue, Bandra West, Mumbai, MH - 400050',
    employment: 'Salaried',
    salary: 65000,
    loanAmount: '₹5,00,000',
    bankName: 'HDFC Bank',
    bankHolder: 'Ram Kumar',
    bankAcc: '5010023948576',
    bankIfsc: 'HDFC0001234',
    bankType: 'Savings',
    nomineeName: 'Priya Kumar',
    nomineePhone: '+91 98765 11223',
    password: 'password123',
    status: 'Pending',
    walletBalance: 0,
    withdrawalState: 'none',
    documents: {
      aadharFront: sampleAadhaarFront,
      aadharBack: sampleAadhaarBack,
      photo: samplePhoto,
      nomineeAadhar: sampleNomineeAadhaar,
    },
    createdAt: '2026-10-31T10:00:00Z',
  },
];

const STORAGE_KEY = 'aviva_capital_applications_v1';

export function loadApplications(): ClientApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveApplications(DEFAULT_APPLICATIONS);
      return DEFAULT_APPLICATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_APPLICATIONS;
  } catch (err) {
    console.error('Failed to load applications from localStorage:', err);
    return DEFAULT_APPLICATIONS;
  }
}

export function saveApplications(apps: ClientApplication[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (err) {
    console.error('Failed to save applications to localStorage:', err);
  }
}

export { sampleAadhaarFront, sampleAadhaarBack, samplePhoto, sampleNomineeAadhaar };
