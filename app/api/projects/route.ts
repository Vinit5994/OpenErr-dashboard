import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ObjectId, Collection } from 'mongodb';
import clientPromise from '../../lib/mongodb';
import { Project, User } from '../../types/index';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, mongodbUri } = body;

    if (!name || !mongodbUri) {
      return NextResponse.json(
        { error: 'Name and MongoDB URI are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('error-logger');
    const users = db.collection('users') as Collection<User>;

    // Get user
    const user = await users.findOne(
      { _id: new ObjectId(token) }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate project API key
    const projectApiKey = crypto.randomBytes(32).toString('hex');

    // Create project with _id
    const projectId = new ObjectId();
    const newProject: Project = {
      _id: projectId,
      name,
      apiKey: projectApiKey,
      mongodbUri,
      createdAt: new Date(),
      errors: []
    };

    const result = await users.updateOne(
      { _id: new ObjectId(token) },
      { $push: { projects: newProject } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error) {
    console.error('Error adding project:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('error-logger');
    const users = db.collection('users') as Collection<User>;

    const user = await users.findOne(
      { _id: new ObjectId(token) },
      { projection: { projects: 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ projects: user.projects || [] });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 