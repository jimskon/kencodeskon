import { NextResponse, NextRequest } from 'next/server'
import { getDrizzle } from '@/db/drizzle'
import { usersTable } from '@/db/schema';
// define and export the GET handler function


const db = getDrizzle();

export async function POST(request: Request) {
  // this is going to be my JSON response
  const body = await request.json()
  console.log(body)
  

  try{
  // create a new user
  const user: typeof usersTable.$inferInsert = {
    name: "Fake Name",
    email: body.email,
    password: body.password,
  };
  console.log("before insert")
  await db.insert(usersTable).values(user);
  console.log('New user created!')
  
  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users)
  // response with the JSON object
  return NextResponse.json({ message: 'User created successfully' })
  }
  
  catch(err:any){
    return NextResponse.json({ message: 'Error creating user', error: err.message })
  }
}

export async function GET(request: Request) {
  try {
    // fetch all users from the database
    const users = await db.select().from(usersTable);
    console.log('Retrieved users:', users);
    return NextResponse.json({ users });
  }
  catch(err: any) {
    return NextResponse.json({ message: 'Error fetching users', error: err.message });
  }
}
