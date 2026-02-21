import { connectToDatabase } from '@/utils/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const cleanEmail = email.trim().toLowerCase();

    // Check Users Collection First (For Admin or General Users)
    let user = await db.collection('users').findOne({ email: cleanEmail });

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        return NextResponse.json({ 
          success: true, 
          role: user.role, 
          id: user._id,
          name: user.name || 'Admin',
          message: `${user.role} access granted`
        });
      }
    }

    // Fallback: Check Candidates Collection if 'users' doesn't have it
    // Candidates might use email and studentId as password initially or have a hashed password
    let candidate = await db.collection('candidates').findOne({ 
      $or: [
        { email: cleanEmail },
        { studentEmail: cleanEmail }, // in case their email field is named studentEmail
      ]
    });

    if (candidate) {
      // If candidate has a hashed password, check it
      if (candidate.password) {
        const isValid = await bcrypt.compare(password, candidate.password);
        if (isValid) {
          return NextResponse.json({ 
            success: true, 
            role: 'candidate', 
            id: candidate._id,
            name: candidate.name,
            message: 'Candidate access granted'
          });
        }
      } else {
        // Fallback for transition: if they don't have a password set, use their studentId as temporary password
        if (password === candidate.studentId) {
          return NextResponse.json({ 
            success: true, 
            role: 'candidate', 
            id: candidate._id,
            name: candidate.name,
            message: 'Candidate access granted (temporary password)'
          });
        }
      }
    }

    // Hardcoded Admin Fallback (for testing / setup transition)
    if (email === 'admin@cse-tech.com' && password === 'admin123') {
      return NextResponse.json({ 
        success: true, 
        role: 'admin',
        message: 'Admin access granted'
      });
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Invalid email or password. Access denied.' 
    }, { status: 401 });

  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
