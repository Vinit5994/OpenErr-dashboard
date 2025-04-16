import { MongoClient } from 'mongodb';

export async function POST(req: Request) {
  try {
    const { uri } = await req.json();

    if (!uri) {
      return new Response(JSON.stringify({ error: 'Missing MongoDB URI' }), { status: 400 });
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('error-log');
    const logs = await db.collection('errors').find({}).toArray();
    await client.close();

    return new Response(JSON.stringify(logs), { status: 200 });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch logs' }), { status: 500 });
  }
}
