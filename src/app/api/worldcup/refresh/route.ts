import { autoFinishMatches, recalculateAllPoints } from '@/lib/worldcup-scores';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await autoFinishMatches(true);
    await recalculateAllPoints();
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
