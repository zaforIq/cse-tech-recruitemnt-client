import { connectToDatabase } from '@/utils/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const { db } = await connectToDatabase();
    let candidate = null;

    if (ObjectId.isValid(id)) {
      candidate = await db
        .collection('candidates')
        .findOne({ _id: new ObjectId(id) });
    }

    if (!candidate) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(candidate);
  } catch (error) {
    console.error(`Error fetching candidate ${id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}