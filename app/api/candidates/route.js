import { connectToDatabase } from '../../../utils/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    const candidates = await db
      .collection('candidates')
      .find({})
      .toArray();

    return NextResponse.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}