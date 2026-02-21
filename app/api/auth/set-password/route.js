import { connectToDatabase } from '@/utils/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const { studentId, email, newPassword } = await request.json();

    if (!studentId || !email || !newPassword) {
      return NextResponse.json({ message: 'Student ID, Email, and New Password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const cleanId = studentId.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Verify candidate again before updating
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
        message: 'Invalid Student ID or Email.' 
      }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the candidate record with the new password
    // Explicitly cast to ObjectId to avoid Next.js dev server instance matching bugs
    await db.collection('candidates').updateOne(
      { _id: new ObjectId(candidate._id.toString()) },
      { $set: { password: hashedPassword } }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Password set successfully. You will now be logged in.',
      role: 'candidate',
      id: candidate._id,
      name: candidate.name,
      email: cleanEmail
    });

  } catch (error) {
    console.error('Set password error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

