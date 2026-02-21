import { connectToDatabase } from '@/utils/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, token, newPassword } = await request.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const cleanEmail = email.trim().toLowerCase();

    const user = await db.collection('users').findOne({ 
      email: cleanEmail,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired reset token' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.collection('users').updateOne(
      { _id: user._id },
      { 
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" }
      }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Password has been reset successfully.' 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
