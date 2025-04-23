// import { NextResponse } from 'next/server';
// import { MongoClient } from 'mongodb';
// import Joi from 'joi';
// import clientPromise from '../../lib/mongodb';

// // Validation schema for error logs
// const errorLogSchema = Joi.object({
//   errors: Joi.array().items(
//     Joi.object({
//       type: Joi.string().required(),
//       message: Joi.string().required(),
//       stack: Joi.string(),
//       url: Joi.string(),
//       metadata: Joi.object()
//     })
//   ).required()
// });

// export async function POST(request: Request) {
//   try {
//     console.log("Processing error log request...");
    
//     // Get API key from Authorization header
//     const authHeader = request.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json(
//         { error: 'Unauthorized: No API key provided' },
//         { status: 401 }
//       );
//     }

//     const apiKey = authHeader.split(' ')[1];
//     const body = await request.json();
//     console.log("Request body:", body);

//     // Validate request body
//     const { error } = errorLogSchema.validate(body);
//     if (error) {
//       return NextResponse.json(
//         { error: error.details[0].message },
//         { status: 400 }
//       );
//     }

//     // Connect to our main database to find user
//     const client = await clientPromise;
//     const db = client.db('error-logger');
    
//     // Find user by API key
//     const user = await db.collection('users').findOne({ apiKey });
//     if (!user) {
//       return NextResponse.json(
//         { error: 'Unauthorized: Invalid API key' },
//         { status: 401 }
//       );
//     }

//     console.log("Found user, connecting to their MongoDB:", user.mongodbUri);

//     // Connect to user's MongoDB
//     const userClient = new MongoClient(user.mongodbUri);
//     await userClient.connect();
//     const userDb = userClient.db();

//     // Save errors to user's MongoDB
//     const savedErrors = await Promise.all(body.errors.map(async (error: any) => {
//       const errorLog = {
//         userId: user._id,
//         errorType: error.type,
//         message: error.message,
//         stackTrace: error.stack,
//         url: error.url,
//         metadata: error.metadata,
//         timestamp: new Date()
//       };
//       return await userDb.collection('errors').insertOne(errorLog);
//     }));

//     // Close the user's MongoDB connection
//     await userClient.close();

//     console.log(`Successfully saved ${savedErrors.length} errors to user's database`);

//     return NextResponse.json({
//       message: 'Errors logged successfully',
//       count: savedErrors.length,
//       storedIn: user.mongodbUri
//     });
//   } catch (error: any) {
//     console.error('Error processing error logs:', error);
//     return NextResponse.json(
//       { error: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// } 

import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
// import Joi from 'joi';
import clientPromise from '../../lib/mongodb'; // Your main MongoDB client promise
import { ErrorLog } from '@/app/types/index';
import { ObjectId } from 'mongodb';

// Validation schema for incoming error logs
// const errorLogSchema = Joi.object({
//   errors: Joi.array().items(
//     Joi.object({
//       type: Joi.string().required(),
//       message: Joi.string().required(),
//       stack: Joi.string(),
//       url: Joi.string(),
//       metadata: Joi.object(),
//     })
//   ).required(),
// });


export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}


export async function POST(request: Request) {
  console.log("Processing error log request...");
  try {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: No API key provided' }, { status: 401, headers });
    }
    const apiKey = authHeader.split(' ')[1];
    console.log("API Key:", apiKey);

    const body = await request.json();

    const mainClient = await clientPromise;
    const mainDb = mainClient.db('error-logger');
    
    const user = await mainDb.collection('users').findOne({
      'projects.apiKey': apiKey
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid API key' }, { status: 401, headers });
    }

    const project = user.projects.find(p => p.apiKey === apiKey);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404, headers });
    }

    const userClient = new MongoClient(project.mongodbUri);
    await userClient.connect();
    const userDb = userClient.db('error-log');

    const savedErrors = await Promise.all(
      body.errors.map(async (err) => {
        const errorLog: ErrorLog = {
          _id: new ObjectId(),
          message: err.message,
          stackTrace: err.stack,
          timestamp: new Date(),
          metadata: err.metadata || {}
        };
        return await userDb.collection('errors').insertOne(errorLog);
      })
    );

    await userClient.close();

    return NextResponse.json(
      {
        message: 'Errors logged successfully',
        count: savedErrors.length,
        projectId: project._id
      },
      { status: 200, headers }
    );
  } catch (err) {
    console.error('Error saving error logs:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}
