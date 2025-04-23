import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ObjectId, Collection } from 'mongodb';
import clientPromise from '../../lib/mongodb';
import { User } from '../../types/index';
// import { encrypt } from '../../utils/crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, mongodbUri } = body;

    if (!name || !email || !password || !mongodbUri) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('error-logger');
    const users = db.collection('users') as Collection<User>;

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Generate API key
    const apiKey = crypto.randomBytes(32).toString('hex');
    
    // Encrypt MongoDB URI with API key
    // const encryptedMongodbUri = encrypt(mongodbUri, apiKey);

    // Create new user
    const newUser: Omit<User, '_id'> = {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      apiKey,
      projects: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await users.insertOne(newUser as User);

    // Create JWT token
    const token = jwt.sign(
      { userId: result.insertedId.toString() },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Set cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: result.insertedId,
        name,
        email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}