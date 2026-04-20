---
title: "Handling Large File Uploads in Laravel with Chunked Uploads"
date: 2026-04-04T16:03:31
draft: false
---



## The Memory Exhaustion Nightmare

When your web application requires users to upload massive files (e.g., raw 4K video footage or gigabyte-sized CSVs), attempting to handle it via a standard `<input type="file">` form submission is a terrible idea.

If a user uploads a 5GB file, PHP attempts to load that massive payload into temporary storage, parse it, and hand it to Laravel. Inevitably, your server hits `upload_max_filesize` or `memory_limit` limits, returning a fatal `502 Bad Gateway` to the user.

Worse, if their internet drops at 99%, they have to restart the 5GB upload from scratch.

To solve this at a senior architectural level, you must implement **Chunked Streaming**.

---

## 1. The Strategy: Client-Side Chunking

Instead of throwing a single 5GB request at the server, we use modern JavaScript (or libraries like Resumable.js / Uppy) to slice the file into 5MB chunks.

The frontend loops through these chunks and sends them sequentially via AJAX. This bypasses server payload limits and allows the upload to pause and resume if the user loses connection.

However, the real engineering challenge happens on the backend: How do you stitch 1,000 separate chunks back into a 5GB file without loading it all into memory?

## 2. The Danger of Array Stitching

A common, dangerous mistake developers make when implementing chunked uploads is storing all the chunks temporarily, loading them into an array, and combining them using a string method. 

```php
// ❌ Fatal Error: Exhausted Memory (Cannot allocate 5GB RAM)
$fileData = '';
for ($i = 0; $i < $totalChunks; $i++) {
    $fileData .= Storage::disk('local')->get("chunk_{$i}");
}
Storage::put('final.mp4', $fileData);
```

If you do this, PHP will literally try to hold 5GB of data inside active RAM, immediately crashing your FPM worker.

## 3. The 10x Solution: Stream Appending

To assemble a massive file safely, you must use **PHP Streams**. We open the final destination file in "Append Mode", and slowly stream each individual chunk into it. 

PHP's memory footprint stays nearly at 0 MB, because the data flows directly from the chunk on disk into the final file without ever sitting in a variable.

```php
public function assembleChunks(Request $request)
{
    $identifier = $request->input('upload_id');
    $totalChunks = $request->input('total_chunks');
    
    // Create the final destination path
    $finalFilePath = storage_path("app/uploads/final_{$identifier}.mp4");
    
    // Open the final file in Append mode ('a')
    $finalFile = fopen($finalFilePath, 'a');

    for ($i = 1; $i <= $totalChunks; $i++) {
        $chunkPath = storage_path("app/tmp/{$identifier}_chunk_{$i}");
        
        // Open the raw chunk in Read mode
        $chunkFile = fopen($chunkPath, 'r');
        
        // Stream the chunk directly into the final file buffer
        stream_copy_to_stream($chunkFile, $finalFile);
        
        fclose($chunkFile);
        
        // Delete the chunk from disk to reclaim space
        unlink($chunkPath);
    }

    fclose($finalFile);

    return response()->json(['status' => 'Assembly complete!']);
}
```

By utilizing `stream_copy_to_stream()`, PHP reads and writes in tiny buffers natively via C. You can use this exact approach to compile a 50GB file on a $5/month VPS with 512MB of RAM, and the server won't even blink.

## Conclusion

When building applications that process colossal amounts of data, you cannot treat data like variables. You must treat them like pipes. 

By splitting files on the frontend, and expertly stitching them using raw PHP streams on the backend, you effectively make file size limitations totally irrelevant.