import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    // Get token from headers
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify token
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'flamnora_secret_key_change_in_production');
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;
    const data = await request.json();

    const update = {} as any;
    if (data.name !== undefined) update.name = data.name;
    if (data.phone !== undefined) update.phone = data.phone;
    if (data.address !== undefined) update.address = data.address;
    if (data.avatar !== undefined) update.avatar = data.avatar;

    // Update user in database using Mongoose and ensure avatar is included
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...update },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return minimal user info to the client (avoid sending password)
    const result = {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      avatar: updatedUser.avatar,
    };

    return NextResponse.json({ success: true, user: result });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}