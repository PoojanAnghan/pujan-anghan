import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import CryptoJS from 'crypto-js';

// Decryption Key (Must match ENCRYPTION_KEY in js/email.js)
const ENCRYPTION_KEY = "poojan-dev-secret-key-2026";

// Resolve Dynamic Directories
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const submissionsDir = path.resolve(__dirname, '../data/submissions');

// Vercel Serverless Function Handler
export default async function handler(req, res) {
  // Ensure the submissions storage directory exists on boot
  if (!fs.existsSync(submissionsDir)) {
    fs.mkdirSync(submissionsDir, { recursive: true });
  }

  const { method } = req;

  // -------------------------------------------------------------
  // POST Handler: Save encrypted form submission
  // -------------------------------------------------------------
  if (method === 'POST') {
    try {
      const payload = req.body;
      const { token, name, email, subject, message, timestamp, file } = payload;

      // Basic field checks
      if (!token || !name || !email) {
        return res.status(400).json({ success: false, error: "Missing required coordinates." });
      }

      // Initial state metrics
      const submissionData = {
        token,
        name,
        email,
        subject,
        message,
        timestamp: timestamp || new Date().toISOString(),
        file,
        retrievalCount: 0
      };

      // Write submission as JSON file to disk
      const filePath = path.join(submissionsDir, `${token}.json`);
      fs.writeFileSync(filePath, JSON.stringify(submissionData, null, 2), 'utf-8');

      return res.status(200).json({ success: true, message: "Secure submission stored successfully." });

    } catch (error) {
      console.error("Critical POST failure:", error);
      return res.status(500).json({ success: false, error: "Internal server registry error." });
    }
  }

  // -------------------------------------------------------------
  // GET Handler: Retrieve, decrypt, and download attachment
  // -------------------------------------------------------------
  else if (method === 'GET') {
    // Read token parameter from request
    const token = req.query.token || req.url.split('?token=')[1];

    if (!token) {
      return res.status(400).send("Bad Request: Token coordinate is missing.");
    }

    const filePath = path.join(submissionsDir, `${token}.json`);

    // Verify file existence
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Error: Submission coordinates not found or already purged.");
    }

    try {
      // Read and parse JSON submission
      const rawData = fs.readFileSync(filePath, 'utf-8');
      const submission = JSON.parse(rawData);

      // 1. Expiration validation (7 days threshold = 604,800,000 ms)
      const submissionTime = new Date(submission.timestamp).getTime();
      const timeElapsed = Date.now() - submissionTime;
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

      if (timeElapsed > sevenDaysMs) {
        // Purge expired files from disk to clean up space
        fs.unlinkSync(filePath);
        return res.status(410).send("Error: Link has expired. All data was securely purged after 7 days.");
      }

      // 2. Rate limit check (Max 3 downloads)
      if (submission.retrievalCount >= 3) {
        return res.status(429).send("Rate Limit Exceeded: This link has been accessed more than 3 times.");
      }

      // Increment count and write updates back to disk immediately
      submission.retrievalCount += 1;
      fs.writeFileSync(filePath, JSON.stringify(submission, null, 2), 'utf-8');

      // 3. Process Decryption if file attached
      if (submission.file && submission.file.content) {
        // Decrypt base64 data using CryptoJS AES
        const decryptedBytes = CryptoJS.AES.decrypt(submission.file.content, ENCRYPTION_KEY);
        const decryptedBase64 = decryptedBytes.toString(CryptoJS.enc.Utf8);

        // Decrypt filename
        const decryptedNameBytes = CryptoJS.AES.decrypt(submission.file.name, ENCRYPTION_KEY);
        const decryptedFileName = decryptedNameBytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedBase64 || !decryptedFileName) {
          throw new Error("Decryption returned empty buffers. Decryption key mismatch.");
        }

        // Convert Base64 back into native Node.js binary Buffer
        const fileBuffer = Buffer.from(decryptedBase64, 'base64');

        // Set response download headers
        res.setHeader('Content-Type', submission.file.type || 'application/octet-stream');
        res.setHeader('Content-Length', fileBuffer.length);
        res.setHeader('Content-Disposition', `attachment; filename="${decryptedFileName}"`);
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

        // Send binary buffer stream
        return res.status(200).send(fileBuffer);
      } else {
        // No attachment -> return text overview as HTML log page
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(`
          <html>
            <head>
              <title>Contact Submission ID: ${token}</title>
              <style>
                body { background-color: #080c14; color: #cbd5e1; font-family: sans-serif; padding: 40px; text-align: center; }
                .card { max-width: 600px; margin: 0 auto; background: #0e1420; border: 1px solid #2e384d; border-radius: 12px; padding: 32px; text-align: left; }
                h2 { color: #00ff88; margin-top: 0; }
                hr { border: 0; border-top: 1px solid #2e384d; margin: 20px 0; }
                pre { background: #05070a; padding: 16px; border-radius: 6px; overflow-x: auto; color: #fff; }
              </style>
            </head>
            <body>
              <div class="card">
                <h2>Submission Details</h2>
                <p><strong>From:</strong> ${submission.name} &bull; ${submission.email}</p>
                <p><strong>Subject:</strong> ${submission.subject}</p>
                <p><strong>Date:</strong> ${submission.timestamp}</p>
                <hr/>
                <p><strong>Message:</strong></p>
                <pre>${submission.message}</pre>
                <hr/>
                <p style="color: #64748b; font-size: 11px; text-align: center;">Accessed: ${submission.retrievalCount}/3 times. Expires in 7 days.</p>
              </div>
            </body>
          </html>
        `);
      }

    } catch (error) {
      console.error("Critical GET decryption failure:", error);
      return res.status(500).send("Error: Internal server processing error or decryption key mismatch.");
    }
  }

  // -------------------------------------------------------------
  // Unsupported Method Fallback
  // -------------------------------------------------------------
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
  }
}
