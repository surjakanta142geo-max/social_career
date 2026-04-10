/**
 * Bunny Storage upload helper
 * Uses the Bunny Storage HTTP API to upload files from server actions.
 */
export async function uploadFile(file: File, path: string): Promise<string> {
    const storageZoneName = process.env.BUNNY_STORAGE_ZONE_NAME;
    const apiKey = process.env.BUNNY_STORAGE_API_KEY;
    const region = process.env.BUNNY_STORAGE_REGION || 'storage'; // e.g., 'ny', 'la', 'sg', 'uk'
    const pullZoneUrl = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE_URL;

    if (!storageZoneName || !apiKey || !pullZoneUrl) {
        throw new Error('Bunny Storage configuration is missing');
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Construct the storage URL
    // If region is 'storage', use storage.bunnycdn.com
    // Otherwise use {region}.storage.bunnycdn.com
    const baseUrl = region === 'storage' ? 'storage.bunnycdn.com' : `${region}.storage.bunnycdn.com`;
    const url = `https://${baseUrl}/${storageZoneName}/${path}/${filename}`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'AccessKey': apiKey,
            'Content-Type': 'application/octet-stream',
        },
        body: buffer,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Bunny Storage upload failed: ${errorText}`);
    }

    // Return the pull zone URL
    // Ensure PULL_ZONE_URL doesn't end with a slash
    const cleanPullZone = pullZoneUrl.endsWith('/') ? pullZoneUrl.slice(0, -1) : pullZoneUrl;
    return `${cleanPullZone}/${path}/${filename}`;
}
