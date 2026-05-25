// Encryption Coordinates & Settings
const ENCRYPTION_KEY = "poojan-dev-secret-key-2026"; // AES-256 secret key

// EmailJS Credentials Configuration (Swap these with your EmailJS dashboard settings)
const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY"; // e.g. "user_xxxxxxxxxxxx"
const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID"; // e.g. "service_default"
const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID"; // e.g. "template_contact"

// Bind Form Actions
export function initContactForm() {
  const form = document.getElementById('contact-form');
  const fileInput = document.getElementById('form-attachment');
  const fileError = document.getElementById('file-error');
  const submitBtn = document.getElementById('submit-btn');
  const responseDiv = document.getElementById('form-response');

  if (!form) return;

  // Initialize EmailJS SDK
  if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_EMAILJS_PUBLIC_KEY") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  // File size validation listener (Max 5MB)
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      fileError.textContent = "File exceeds the maximum 5MB size barrier.";
      fileError.classList.remove('hidden');
      submitBtn.disabled = true;
    } else {
      fileError.classList.add('hidden');
      submitBtn.disabled = false;
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Client-Side Field Extraction
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();
    const file = fileInput.files[0];

    // Reset feedback alerts
    responseDiv.className = "hidden text-center text-xs mt-3 p-3 rounded-lg";
    responseDiv.innerHTML = "Processing encryption & sending logs...";
    responseDiv.classList.remove('hidden');
    responseDiv.classList.add('bg-slate-900', 'text-slate-400');
    submitBtn.disabled = true;

    try {
      let attachmentPayload = null;
      let token = generateUUID();

      // 2. Encryption Workflow (Base64 + AES-256)
      if (file) {
        responseDiv.innerHTML = "Encrypting attachment using AES-256...";
        
        // Read file contents as Base64
        const base64Content = await readFileAsBase64(file);
        
        // Encrypt base64 string using CryptoJS
        const encryptedContent = CryptoJS.AES.encrypt(base64Content, ENCRYPTION_KEY).toString();
        const encryptedFileName = CryptoJS.AES.encrypt(file.name, ENCRYPTION_KEY).toString();

        attachmentPayload = {
          name: encryptedFileName,
          type: file.type, // Send plain MIME type to write accurate headers on download
          content: encryptedContent
        };
      }

      // 3. Compile Submission Payload
      const submission = {
        token: token,
        name: name,
        email: email,
        subject: subject,
        message: message,
        timestamp: new Date().toISOString(),
        file: attachmentPayload
      };

      // 4. Save Submission Payload to submissions/ via API
      responseDiv.innerHTML = "Saving encrypted submission to disk...";
      const apiResponse = await fetch('api/retrieve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submission)
      });

      if (!apiResponse.ok) {
        throw new Error("API failed to register the submission.");
      }

      // 5. Trigger Email Delivery (EmailJS or SMTP mock)
      responseDiv.innerHTML = "Dispatching email logs to owner...";
      
      const downloadLink = `${window.location.origin}/api/retrieve?token=${token}`;
      
      const templateParams = {
        sender_name: name,
        sender_email: email,
        subject: subject,
        message: message,
        timestamp: submission.timestamp,
        download_link: file ? downloadLink : "No attachment uploaded."
      };

      // Send via EmailJS if configured, otherwise display console mock logs
      if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_EMAILJS_PUBLIC_KEY") {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      } else {
        console.log("=== Contact Submission Received ===");
        console.log("Details:", templateParams);
        console.log("Encrypted JSON File:", submission);
        console.log("===================================");
      }

      // 6. Present Success Alert
      responseDiv.className = "text-center text-xs mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold";
      responseDiv.innerHTML = `
        <div class="mb-2">✓ Message Transmitted Successfully!</div>
        <div class="text-[10px] text-slate-400 font-normal">
          Submission ID: <code class="text-white">${token}</code><br/>
          An encrypted backup is available for 7 days.
        </div>
      `;
      form.reset();

    } catch (error) {
      console.error("Transmission Error:", error);
      responseDiv.className = "text-center text-xs mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-semibold";
      responseDiv.innerHTML = `✕ Failed to transmit message: ${error.message}`;
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// -------------------------------------------------------------
// Asynchronous File & String Helpers
// -------------------------------------------------------------

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // FileReader result format: "data:image/png;base64,iVBORw0KGgoAAA..."
      // Split the header metadata out to get the raw base64 string
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function generateUUID() {
  // Leverage native Web Crypto API randomUUID if available, else use math fallback
  if (self.crypto && self.crypto.randomUUID) {
    return self.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
