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

export async function PATCH(request, { params }) {
  const { id } = await params;

  try {
    const { db } = await connectToDatabase();
    const data = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    // Filter allowed fields for security
    const allowedFields = [
      'assessmentQuestionUrl',
      'assessmentGithub',
      'assessmentLiveLink',
      'assessmentDoc1',
      'assessmentDoc2'
    ];
    
    const updateData = {};
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'No valid fields provided' }, { status: 400 });
    }

    updateData.assessmentSubmittedAt = new Date();

    const result = await db.collection('candidates').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Candidate not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Assessment submission updated successfully' });
  } catch (error) {
    console.error(`Error updating candidate ${id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}