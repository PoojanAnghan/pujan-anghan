import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // Handle CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");

    if (!smtpUser || !smtpPass) {
      throw new Error("Missing SMTP_USER or SMTP_PASS environment variables");
    }

    const payload = await req.json();
    const { type, email, subscriberId, siteUrl, post, form } = payload;

    if (!type) {
      throw new Error("Missing request type in payload");
    }

    // Configure Nodemailer transporter for Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const year = new Date().getFullYear();

    if (type === "welcome") {
      // 1. Welcome email flow
      if (!email || !subscriberId || !siteUrl) {
        throw new Error("Missing email, subscriberId, or siteUrl in payload for type 'welcome'");
      }

      const cleanSiteUrl = siteUrl.replace(/\/$/, "");
      const unsubscribeUrl = `${cleanSiteUrl}/#/unsubscribe?id=${subscriberId}`;

      const welcomeHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome! 🎉 You're subscribed</title>
  <style>
    body { margin: 0; padding: 0; background-color: #020617; color: #cbd5e1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .wrapper { width: 100%; background-color: #020617; padding: 40px 20px; box-sizing: border-box; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 40px; box-sizing: border-box; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); }
    .logo-container { text-align: center; margin-bottom: 30px; }
    .logo { display: inline-block; width: 48px; height: 48px; line-height: 48px; background: linear-gradient(135deg, #10b981 0%, #0d9488 100%); color: #ffffff; font-weight: bold; font-size: 20px; border-radius: 12px; text-align: center; }
    h1 { color: #ffffff; font-size: 24px; font-weight: 800; text-align: center; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.025em; }
    p { font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 24px; color: #94a3b8; }
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { display: inline-block; background-color: #10b981; color: #ffffff !important; text-decoration: none; padding: 12px 28px; font-size: 14px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2); }
    .btn-secondary { display: inline-block; background-color: transparent; color: #94a3b8 !important; text-decoration: none; border: 1px solid #334155; padding: 11px 27px; font-size: 14px; font-weight: 600; border-radius: 8px; margin-left: 12px; }
    .divider { height: 1px; background-color: #1e293b; margin: 32px 0 24px 0; }
    .footer { text-align: center; font-size: 12px; color: #64748b; line-height: 1.5; }
    .footer a { color: #10b981; text-decoration: none; }
    .footer a:hover { text-decoration: underline; }
    .unsubscribe-text { margin-top: 16px; font-size: 11px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="logo-container"><div class="logo">PA</div></div>
      <h1>Welcome to the Newsletter! 🎉</h1>
      <p>Hey there,</p>
      <p>Thank you so much for subscribing. You've successfully joined my mailing list!</p>
      <p>From now on, you'll be the first to receive notifications whenever I publish a new blog post, deep dive, guide, or engineering log. I promise to only send high-quality content—no spam, ever.</p>
      <p>In the meantime, feel free to check out my portfolio and explore some of my latest projects and existing articles.</p>
      <div class="btn-container">
        <a href="${cleanSiteUrl}/#/blog" class="btn" target="_blank">Read the Blog</a>
        <a href="${cleanSiteUrl}" class="btn-secondary" target="_blank">Visit Portfolio</a>
      </div>
      <div class="divider"></div>
      <div class="footer">
        <p style="margin-bottom: 8px; color: #64748b;">&copy; ${year} Poojan Anghan. All rights reserved.</p>
        <p style="margin-bottom: 0; color: #64748b;">Built with passion &amp; code.</p>
        <div style="margin: 16px 0; font-size: 13px;">
          <a href="${cleanSiteUrl}" target="_blank" style="color: #10b981; text-decoration: none; margin: 0 10px;">Website</a>
          <span style="color: #334155;">&bull;</span>
          <a href="https://wa.me/917043832747" target="_blank" style="color: #10b981; text-decoration: none; margin: 0 10px;">WhatsApp</a>
          <span style="color: #334155;">&bull;</span>
          <a href="https://www.linkedin.com/in/poojan-a-447073340/" target="_blank" style="color: #10b981; text-decoration: none; margin: 0 10px;">LinkedIn</a>
        </div>
        <div class="unsubscribe-text">
          If you didn't mean to subscribe, you can <a href="${unsubscribeUrl}" target="_blank">unsubscribe here</a>.
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

      const info = await transporter.sendMail({
        from: `"Poojan Anghan" <${smtpUser}>`,
        to: email,
        subject: "Welcome! 🎉 You're now subscribed",
        html: welcomeHtml,
      });

      return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (type === "new-post") {
      // 2. New blog post notification alerts
      if (!post || !siteUrl) {
        throw new Error("Missing post or siteUrl in payload for type 'new-post'");
      }

      // Fetch all active subscribers
      const { data: subscribers, error: dbError } = await supabase
        .from("subscribers")
        .select("id, email")
        .eq("status", "active");

      if (dbError) throw dbError;

      const report = {
        total: subscribers?.length || 0,
        sent: 0,
        failed: 0,
        errors: [] as Array<{ email: string; error: string }>
      };

      if (!subscribers || subscribers.length === 0) {
        return new Response(JSON.stringify(report), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      const cleanSiteUrl = siteUrl.replace(/\/$/, "");

      // Send to all subscribers sequentially to customize unsubscribe URL
      for (const sub of subscribers) {
        const blogUrl = `${cleanSiteUrl}/#/blog/${post.slug}`;
        const unsubscribeUrl = `${cleanSiteUrl}/#/unsubscribe?id=${sub.id}`;

        const postHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Post: ${post.title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #020617; color: #cbd5e1; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
    .wrapper { width: 100%; background-color: #020617; padding: 40px 20px; box-sizing: border-box; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 40px; }
    .logo-container { text-align: center; margin-bottom: 30px; }
    .logo { display: inline-block; width: 48px; height: 48px; line-height: 48px; background: linear-gradient(135deg, #10b981 0%, #0d9488 100%); color: #ffffff; font-weight: bold; font-size: 20px; border-radius: 12px; text-align: center; }
    .tag { display: inline-block; background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #10b981; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 8px; border-radius: 4px; margin-bottom: 12px; }
    h1 { color: #ffffff; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 16px; text-align: center; }
    p { font-size: 15px; line-height: 1.6; color: #94a3b8; }
    .excerpt { background-color: #1e293b; border-left: 4px solid #10b981; padding: 16px; border-radius: 4px; font-style: italic; color: #cbd5e1; margin: 24px 0; }
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { display: inline-block; background-color: #10b981; color: #ffffff !important; text-decoration: none; padding: 12px 28px; font-size: 14px; font-weight: 600; border-radius: 8px; }
    .divider { height: 1px; background-color: #1e293b; margin: 32px 0 24px 0; }
    .footer { text-align: center; font-size: 12px; color: #64748b; }
    .footer a { color: #10b981; text-decoration: none; }
    .unsubscribe-text { margin-top: 16px; font-size: 11px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="logo-container"><div class="logo">PA</div></div>
      <div style="text-align: center;">
        <span class="tag">New Publication</span>
        <h1>${post.title}</h1>
      </div>
      <p>Hello,</p>
      <p>I have just published a new article on my blog/engineering log that you might find interesting:</p>
      <div class="excerpt">${post.excerpt || 'Read my latest thoughts and findings in this newly published article.'}</div>
      <div class="btn-container">
        <a href="${blogUrl}" class="btn" target="_blank">Read Full Article</a>
      </div>
      <div class="divider"></div>
      <div class="footer">
        <p style="margin-bottom: 8px;">&copy; ${year} Poojan Anghan. All rights reserved.</p>
        <div style="margin: 16px 0; font-size: 13px;">
          <a href="${cleanSiteUrl}" target="_blank" style="color: #10b981; text-decoration: none; margin: 0 10px;">Website</a>
          <span style="color: #334155;">&bull;</span>
          <a href="https://wa.me/917043832747" target="_blank" style="color: #10b981; text-decoration: none; margin: 0 10px;">WhatsApp</a>
          <span style="color: #334155;">&bull;</span>
          <a href="https://www.linkedin.com/in/poojan-a-447073340/" target="_blank" style="color: #10b981; text-decoration: none; margin: 0 10px;">LinkedIn</a>
        </div>
        <div class="unsubscribe-text">
          Want to stop receiving these emails? <a href="${unsubscribeUrl}" target="_blank">Unsubscribe here</a>.
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

        try {
          await transporter.sendMail({
            from: `"Poojan Anghan" <${smtpUser}>`,
            to: sub.email,
            subject: `New Blog Post: ${post.title}`,
            html: postHtml,
          });
          report.sent += 1;
        } catch (err) {
          console.error(`Failed to send blog post alert to ${sub.email}:`, err);
          report.failed += 1;
          report.errors.push({ email: sub.email, error: err.message || String(err) });
        }
      }

      return new Response(JSON.stringify(report), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (type === "quote") {
      // 3. Project quote inquiry flow
      if (!form || !siteUrl) {
        throw new Error("Missing form or siteUrl in payload for type 'quote'");
      }

      const cleanSiteUrl = siteUrl.replace(/\/$/, "");

      // Email 1: Notification of details to Admin (SMTP_USER)
      const adminHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Project Quote Request</title>
  <style>
    body { background-color: #020617; color: #cbd5e1; font-family: -apple-system, sans-serif; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 30px; }
    h1 { color: #ffffff; font-size: 20px; border-bottom: 1px solid #1e293b; padding-bottom: 12px; }
    .field { margin-bottom: 16px; }
    .label { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: bold; }
    .value { font-size: 14px; color: #ffffff; margin-top: 4px; }
    .desc { background-color: #1e293b; padding: 12px; border-radius: 6px; font-style: italic; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div class="container">
    <h1>New Project Quote Request 🚀</h1>
    <div class="field"><div class="label">Name</div><div class="value">${form.name}</div></div>
    <div class="field"><div class="label">Email</div><div class="value"><a href="mailto:${form.email}" style="color: #10b981;">${form.email}</a></div></div>
    <div class="field"><div class="label">WhatsApp</div><div class="value">${form.whatsapp || 'Not provided'}</div></div>
    <div class="field"><div class="label">Company</div><div class="value">${form.company || 'Not provided'}</div></div>
    <div class="field"><div class="label">Service Required</div><div class="value" style="color: #10b981; font-weight: bold;">${form.service}</div></div>
    <div class="field"><div class="label">Budget Range</div><div class="value">${form.budget}</div></div>
    <div class="field"><div class="label">Timeline</div><div class="value">${form.timeline}</div></div>
    <div class="field"><div class="label">Design Ready?</div><div class="value">${form.designReady}</div></div>
    <div class="field"><div class="label">Referral Source</div><div class="value">${form.referral || 'Not specified'}</div></div>
    <div class="field"><div class="label">Project Description</div><div class="value desc">${form.description}</div></div>
  </div>
</body>
</html>`;

      // Email 2: Auto-reply confirmation to client
      const clientHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Project Inquiry Received</title>
  <style>
    body { background-color: #020617; color: #cbd5e1; font-family: -apple-system, sans-serif; }
    .wrapper { padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 40px; }
    .logo-container { text-align: center; margin-bottom: 30px; }
    .logo { display: inline-block; width: 48px; height: 48px; line-height: 48px; background: linear-gradient(135deg, #10b981 0%, #0d9488 100%); color: #ffffff; font-weight: bold; font-size: 20px; border-radius: 12px; text-align: center; }
    h1 { color: #ffffff; font-size: 22px; font-weight: 800; text-align: center; margin-top: 0; }
    p { font-size: 15px; line-height: 1.6; color: #94a3b8; }
    .highlight { color: #10b981; font-weight: bold; }
    .divider { height: 1px; background-color: #1e293b; margin: 32px 0 24px 0; }
    .footer { text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="logo-container"><div class="logo">PA</div></div>
      <h1>Project Inquiry Received! 🚀</h1>
      <p>Hi ${form.name},</p>
      <p>Thank you for reaching out and requesting a quote for your project: <span class="highlight">"${form.service}"</span>.</p>
      <p>I have received your details and description. I'm currently reviewing the project requirements, budget, and timeline constraints and will get back to you with my thoughts and availability via email within the next 24-48 hours.</p>
      <p>If you have any supplementary materials or designs (Figma, PDFs, etc.), feel free to reply directly to this email and attach them.</p>
      <p>Looking forward to potentially working together!</p>
      <p>Best regards,<br>Poojan Anghan</p>
      <div class="divider"></div>
      <div class="footer">
        <p style="margin-bottom: 8px;">&copy; ${year} Poojan Anghan. All rights reserved.</p>
        <div style="margin: 16px 0; font-size: 13px;">
          <a href="${cleanSiteUrl}" target="_blank" style="color: #10b981; text-decoration: none; margin: 0 10px;">Website</a>
          <span style="color: #334155;">&bull;</span>
          <a href="https://wa.me/917043832747" target="_blank" style="color: #10b981; text-decoration: none; margin: 0 10px;">WhatsApp</a>
          <span style="color: #334155;">&bull;</span>
          <a href="https://www.linkedin.com/in/poojan-a-447073340/" target="_blank" style="color: #10b981; text-decoration: none; margin: 0 10px;">LinkedIn</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

      // Deliver both emails
      const adminInfo = await transporter.sendMail({
        from: `"Poojan Anghan Console" <${smtpUser}>`,
        to: smtpUser,
        subject: `New Project Quote Request - ${form.service}`,
        html: adminHtml,
        replyTo: form.email,
      });

      let clientInfo = null;
      try {
        clientInfo = await transporter.sendMail({
          from: `"Poojan Anghan" <${smtpUser}>`,
          to: form.email,
          subject: "Thanks for reaching out! I'll get back to you soon.",
          html: clientHtml,
        });
      } catch (clientErr) {
        console.error(`Failed to send auto-reply to client ${form.email}:`, clientErr);
      }

      return new Response(
        JSON.stringify({
          success: true,
          adminMessageId: adminInfo.messageId,
          clientMessageId: clientInfo ? clientInfo.messageId : null,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      throw new Error(`Unsupported type: ${type}`);
    }

  } catch (error) {
    console.error("Email edge function execution failure:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
