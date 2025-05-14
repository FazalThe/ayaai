import Link from 'next/link';
import LoginForm from '@/components/auth/login-form'; // Assuming alias setup

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <LoginForm />
      {/* Link to signup page */}
      <div className="mt-4 text-center text-sm">
        Don&#39;t have an account?{' '}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
