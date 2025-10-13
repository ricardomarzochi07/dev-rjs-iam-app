'use client';

import Link from 'next/link';

export default function Navbar() {


  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <Link href="/" style={{ marginRight: '10px' }}>Inicio</Link>
      <Link href="/hello" style={{ marginRight: '10px' }}>Iniciar sesión</Link>
      <Link href="/signup" style={{ marginRight: '10px' }}>Registrar</Link>

    </nav>
  );
}
