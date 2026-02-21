import { connectToDatabase } from '@/utils/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    // Admin Check
    if (id === '123456') {
      return NextResponse.json({ 
        success: true, 
        role: 'admin',
        message: 'Admin access granted'
      });
    }

    // Student Check
    const { db } = await connectToDatabase();
    const cleanId = id.trim();
    let candidate = await db.collection('candidates').findOne({ studentId: cleanId });

    // Try without dashes if not found
    if (!candidate && cleanId.includes('-')) {
      const idNoDashes = cleanId.replace(/-/g, '');
      candidate = await db.collection('candidates').findOne({ studentId: idNoDashes });
    }

    if (candidate) {
      return NextResponse.json({ 
        success: true, 
        role: 'candidate', 
        id: candidate._id,
        name: candidate.name,
        message: 'Candidate access granted'
      });
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Invalid ID. Access denied.' 
    }, { status: 401 });

  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
