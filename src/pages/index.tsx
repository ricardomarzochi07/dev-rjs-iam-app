import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';

const Navbar = dynamic(() => import('@/components/navbar'), {
  ssr: false, // 👈 obligatorio para que se cargue solo en cliente
  loading: () => <div>Cargando navbar...</div>,
});

export default function Home() {
  return <Navbar />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {}, // puedes pasar props si quieres
  };
};