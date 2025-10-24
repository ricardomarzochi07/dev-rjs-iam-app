//'use client';

import Link from 'next/link';
import { useLanguage } from 'buddybets-i18n-lib';

export default function Navbar() {
  const { t, currentLanguage, changeLanguage } = useLanguage();

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

      {/* Links principales */}
      <div>
          <Link href="/" style={{ marginRight: '10px' }}>Inicio</Link>
          <Link href="/hello" style={{ marginRight: '10px' }}>Iniciar sesión</Link>
          <Link href="/signup" style={{ marginRight: '10px' }}>Registrar</Link>
      </div>

      {/* Selector de idioma */
      <select
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value as any)}
        style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
      >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="pt">Português</option>
          <option value="fr">Français</option>
      </select>}
    </nav>
  );
}
