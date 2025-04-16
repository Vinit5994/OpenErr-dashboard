import { NextResponse } from 'next/server';
import crypto from 'crypto';
// import Joi from 'joi';
import clientPromise from '../../lib/mongodb';

// // Validation schema
// const registrationSchema = Joi.object({
//   name: Joi.string().required(),
//   email: Joi.string().email().required(),
//   mongodbUri: Joi.string().required().pattern(/^mongodb(\+srv)?:\/\//)
// });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Request body:", body);

    // Validate request body
    // const { error } = registrationSchema.validate(body);
    // if (error) {
    //   return NextResponse.json(
    //     { error: error.details[0].message },
    //     { status: 400 }
    //   );
    // }

    // // Test MongoDB connection with provided URI
    // try {
    //   const testClient = new MongoClient(body.mongodbUri);
    //   await testClient.connect();
    //   await testClient.close();
    // } catch (err) {
    //   console.error("MongoDB connection test failed:", err);
    //   return NextResponse.json(
    //     { error: 'Invalid MongoDB URI or connection failed' },
    //     { status: 400 }
    //   );
    // }

    // Connect to our main database
    const client = await clientPromise;
    const db = client.db('error-logger');

    // Check if email already exists
    const existingUser = await db.collection('users').findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Generate API key
    const apiKey = crypto.randomBytes(32).toString('hex');
    console.log("Generated API key:", apiKey);

    // Create new user
    const user = {
      name: body.name,
      email: body.email,
      apiKey,
      mongodbUri: body.mongodbUri,
      createdAt: new Date()
    };

    await db.collection('users').insertOne(user);

    return NextResponse.json({
      message: 'User registered successfully',
      apiKey,
      mongodbUri: body.mongodbUri
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 