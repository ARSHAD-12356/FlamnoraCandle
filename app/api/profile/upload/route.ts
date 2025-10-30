import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Validate file type using MIME type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, GIF, or WEBP images are allowed." },
        { status: 400 }
      );
    }

    // Get the file extension from MIME type
    const extension = file.type.split('/')[1];

    // Generate unique filename
    const fileName = `${uuidv4()}.${extension}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to public/uploads directory
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Create uploads directory if it doesn't exist
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating uploads directory:', error);
    }
    
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Return the URL for the uploaded file
    const fileUrl = `/uploads/${fileName}`;

    // Always return the absolute URL path
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const absoluteUrl = `${baseUrl}${fileUrl}`;

    return NextResponse.json({ 
      success: true, 
      url: absoluteUrl 
    });

  } catch (error) {
    console.error('Profile picture upload error:', error);
    return NextResponse.json(
      { error: "Failed to upload profile picture" },
      { status: 500 }
    );
  }
}