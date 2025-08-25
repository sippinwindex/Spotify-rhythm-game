import { handlers } from '../../../../../auth'; // Correct path: from src/app/api/auth/[...nextauth]/route.ts to root auth.ts

export const { GET, POST } = handlers;
export const runtime = 'edge'; // Optional: For Edge Runtime (v5 compatible)
