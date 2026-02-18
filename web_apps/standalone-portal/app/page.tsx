import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'; // but since auth in localStorage (client), simple redirect to login/dashboard

// For server-side, check cookie if we set one, but since standalone uses localStorage like others, redirect to login
// Actual check in client components or middleware, but for simplicity:

export default function Home() {
  // In practice, use middleware or client redirect; here static redirect to login
  // User will be redirected by dashboard layout if needed
  redirect('/login');
}
