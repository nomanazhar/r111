import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = (formData.get('folder') as string) || '';

    if (!file || !(file instanceof Blob) || typeof (file as any).arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'Missing or invalid file' }, { status: 400 });
    }
    const uploadedFile = file as File;

    const timestamp = Date.now();
    const originalName = (uploadedFile.name || 'upload').replace(/[^a-zA-Z0-9_.-]/g, '_');
    const path = `${folder}/${timestamp}-${originalName}`.replace(/\/+/, '/');

    const bytes = await uploadedFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const bucket = 'PUBLIC';
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, { contentType: uploadedFile.type || 'application/octet-stream', upsert: false });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, path });
  } catch (e: any) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 500 });
  }
}


