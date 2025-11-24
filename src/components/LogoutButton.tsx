'use client';

import { signOut } from 'next-auth/react';
import { Button } from './ui/button';

export default function LogoutButton() {
  return <Button onClick={() => signOut({ callbackUrl: 'http://localhost:9002/' })}>Logout</Button>;
}
