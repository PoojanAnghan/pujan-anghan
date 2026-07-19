import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const payload = await req.json();
    
    // Get visitor IP address from headers, cleaning up proxy chains
    let clientIp = "127.0.0.1";
    const xForwardedFor = req.headers.get("x-forwarded-for");
    if (xForwardedFor) {
      clientIp = xForwardedFor.split(",")[0].trim();
    } else {
      const cfConnectingIp = req.headers.get("cf-connecting-ip");
      if (cfConnectingIp) {
        clientIp = cfConnectingIp.split(",")[0].trim();
      } else {
        const xRealIp = req.headers.get("x-real-ip");
        if (xRealIp) {
          clientIp = xRealIp.split(",")[0].trim();
        }
      }
    }
    
    // Resolve Geolocation via freeipapi.com (fails silently to unknown)
    let country = "Unknown";
    let region = "Unknown";
    let city = "Unknown";
    
    const isLocal = clientIp === "127.0.53.53" || clientIp === "127.0.0.1" || clientIp === "localhost" || clientIp.startsWith("10.") || clientIp.startsWith("192.168.") || clientIp.startsWith("172.16.");
    if (!isLocal) {
      try {
        const geoRes = await fetch(`https://freeipapi.com/api/json/${clientIp}`);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          country = geoData.countryName || "Unknown";
          region = geoData.regionName || "Unknown";
          city = geoData.cityName || "Unknown";
        }
      } catch (err) {
        console.error("Geo IP lookup failed:", err);
      }
    }

    const { session_id, type, path, referrer, utm_source, utm_medium, utm_campaign, device_type, browser, event_name, metadata } = payload;

    if (!session_id) {
      throw new Error("Missing session_id in payload");
    }

    if (type === "pageview") {
      // Check if session exists in DB
      const { data: existingSession } = await supabase
        .from("sessions")
        .select("id")
        .eq("id", session_id)
        .maybeSingle();

      if (!existingSession) {
        // Insert new session row
        await supabase.from("sessions").insert({
          id: session_id,
          country,
          region,
          city,
          referrer: referrer || "Direct",
          utm_source,
          utm_medium,
          utm_campaign,
          device_type,
          browser
        });
      } else {
        // Update last seen timestamp
        await supabase
          .from("sessions")
          .update({ last_seen: new Date().toISOString() })
          .eq("id", session_id);
      }

      // Insert Page view event
      await supabase.from("page_events").insert({
        session_id,
        path
      });

    } else if (type === "conversion") {
      // Insert conversion event
      await supabase.from("conversion_events").insert({
        session_id,
        event_name,
        metadata
      });

      // Update session last seen
      await supabase
        .from("sessions")
        .update({ last_seen: new Date().toISOString() })
        .eq("id", session_id);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
