// =============================================================================
// Contexte de Thème (clair / sombre)
// =============================================================================

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

type ThemeMode = 'clair' | 'sombre';

interface ContexteTheme {
  theme: ThemeMode;
  basculerTheme: () => void;
}

const ThemeContexte = createContext<ContexteTheme | undefined>(undefined);

export function ThemeFournisseur({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const stocke = localStorage.getItem('theme');
    return (stocke === 'sombre' ? 'sombre' : 'clair') as ThemeMode;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const basculerTheme = useCallback(() => {
    setTheme((precedent) => (precedent === 'clair' ? 'sombre' : 'clair'));
  }, []);

  return (
    <ThemeContexte.Provider value={{ theme, basculerTheme }}>
      {children}
    </ThemeContexte.Provider>
  );
}

export function utiliserTheme(): ContexteTheme {
  const contexte = useContext(ThemeContexte);
  if (!contexte) {
    throw new Error('utiliserTheme doit être utilisé dans un ThemeFournisseur');
  }
  return contexte;
}
