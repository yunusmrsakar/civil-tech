import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ user: null }, { status: 401 });
  }
  return Response.json({
    user: {
      id: session.user.id,
      name: session.user.name,
      username: session.user.email,
    },
  });
}
