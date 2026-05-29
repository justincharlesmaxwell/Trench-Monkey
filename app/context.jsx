import { createContext } from 'react';

// MagnetContext holds the current generated report data.
// Provided in App after generation; consumed by all four phase components.
export const MagnetContext = createContext(null);
