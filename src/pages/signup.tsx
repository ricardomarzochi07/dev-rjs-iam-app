// pages/signup.tsx
import dynamic from 'next/dynamic';

const SignupPageImpl = dynamic(
  () => import('@/components/signup/signup_page'),
  { ssr: false }
);

export default function SignupPage() {
  return <SignupPageImpl />;
}
