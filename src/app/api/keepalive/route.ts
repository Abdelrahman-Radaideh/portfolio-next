import { NextRequest, NextResponse } from "next/server";
import { getUsersCount } from '@/lib/services/user-service';
export async function GET(req: NextRequest) {
    const usersCount = await getUsersCount();
    console.log("Users count: " + usersCount);
    return NextResponse.json({ message: "ok", usersCount }, { status: 200 });
}