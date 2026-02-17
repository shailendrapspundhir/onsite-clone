'use client';

import './globals.css';
import { AuthProvider } from '@onsite360/web-ui-shared';

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_GRAPHQL_URL ?? 'http://localhost:3001/graphql';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider authGraphqlUrl={AUTH_URL}>{children}</AuthProvider>
      </body>
    </html>
  );
}
