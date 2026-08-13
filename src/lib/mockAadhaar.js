// Demo Aadhaar -> e-KYC registry.
// In a real deployment the e-KYC payload is returned by the licensed
// ASA/KUA provider (Setu/Cashfree/Signzy/Zoop) after OTP verification.
// Here we map a few test Aadhaar numbers to profiles so the demo can show a
// coherent name-match (Step 6). An unknown Aadhaar returns a generic name
// that will NOT match the signed-in account, demonstrating the mismatch gate.

const REGISTRY = {
  '999999999999': { name: 'Sunita Verma', dob: '1990-05-12', gender: 'F', lastFour: '4821', photo: 'https://i.pravatar.cc/150?u=sunita' },
  '888888888888': { name: 'Aarav Nair', dob: '1985-11-03', gender: 'M', lastFour: '9034', photo: 'https://i.pravatar.cc/150?u=aarav' },
  '777777777777': { name: 'Rajesh Kumar', dob: '1978-02-20', gender: 'M', lastFour: '1122', photo: 'https://i.pravatar.cc/150?u=rajesh' },
  '666666666666': { name: 'Meena Devi', dob: '1995-08-09', gender: 'F', lastFour: '5577', photo: 'https://i.pravatar.cc/150?u=meena' },
}

export function ekycFor(aadhaar) {
  const key = String(aadhaar || '')
  const known = REGISTRY[key]
  if (known) return { ...known }
  return {
    name: 'Aadhaar Resident',
    dob: '1992-01-01',
    gender: 'M',
    lastFour: key.slice(-4),
    photo: 'https://i.pravatar.cc/150?u=aadhaar',
  }
}

// Quick reference for documentation / demo instructions.
export const DEMO_AADHAAR = {
  sunita: '999999999999',
  aarav: '888888888888',
  rajesh: '777777777777',
  meena: '666666666666',
}
