// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { GlobalAnalysisService } from '@/lib/services/g';

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
    
//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: 'Non authentifié' },
//         { status: 401 }
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     const limit = parseInt(searchParams.get('limit') || '5');

//     const service = new AnalysisService();
//     const result = await service.getRecentAnalyses(session.user.id, limit);

//     return NextResponse.json(result);
//   } catch (error: any) {
//     console.error('API Error GET /api/analyses/recent:', error);
    
//     return NextResponse.json(
//       { 
//         success: false,
//         error: 'Erreur serveur interne',
//         analyses: [],
//         total: 0
//       },
//       { status: 500 }
//     );
//   }
// }