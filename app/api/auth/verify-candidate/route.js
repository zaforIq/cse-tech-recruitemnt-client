import { connectToDatabase } from '@/utils/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { studentId, email } = await request.json();

    if (!studentId || !email) {
      return NextResponse.json({ message: 'Student ID and Email are required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const cleanId = studentId.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Look for candidate matching BOTH studentId and email
    let candidate = await db.collection('candidates').findOne({ 
      studentId: cleanId,
      $or: [
        { email: cleanEmail },
        { studentEmail: cleanEmail },
      ]
    });

    // Try without dashes if not found
    if (!candidate && cleanId.includes('-')) {
      const idNoDashes = cleanId.replace(/-/g, '');
      candidate = await db.collection('candidates').findOne({ 
        studentId: idNoDashes,
        $or: [
          { email: cleanEmail },
          { studentEmail: cleanEmail },
        ]
      });
    }

    if (!candidate) {
      return NextResponse.json({ 
        success: false, 
        message: 'Could not find a candidate with the provided Student ID and Email.' 
      }, { status: 404 });
    }

    // Check if the candidate already has a password set
    if (candidate.password) {
      return NextResponse.json({ 
        success: false, 
        message: 'Password already set for this candidate. Please log in directly.' 
      }, { status: 400 });
    }

    // Candidate found and hasn't set password yet
    return NextResponse.json({ 
      success: true, 
      message: 'Candidate verified successfully.' 
    });

  } catch (error) {
    console.error('Verify candidate error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

