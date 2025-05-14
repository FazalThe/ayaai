import Link from 'next/link';
import SignupForm from '@/components/auth/signup-form'; // Assuming alias setup

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <SignupForm />
      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
