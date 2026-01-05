import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface FireNotificationRequest {
  wizkidName: string;
  wizkidEmail: string;
  fired: boolean;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { wizkidName, wizkidEmail, fired }: FireNotificationRequest = await req.json();

    if (!wizkidEmail) {
      return new Response(
        JSON.stringify({ error: "Wizkid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subject = fired
      ? `Important Notice - Employment Status Update`
      : `Welcome Back to OWOW!`;

    const htmlContent = fired
      ? `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #1f2937; margin-bottom: 20px;">Dear ${wizkidName},</h1>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            We regret to inform you that your employment with OWOW has been terminated, effective immediately.
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            We appreciate your contributions during your time with us and wish you all the best in your future endeavors.
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-top: 30px;">
            Best regards,<br/>
            <strong>The OWOW Management Team</strong>
          </p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px;">
              This is an automated message from Wizkid Manager 2000.
            </p>
          </div>
        </div>
      `
      : `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #1f2937; margin-bottom: 20px;">Welcome Back, ${wizkidName}! 🎉</h1>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Great news! We're pleased to inform you that you have been reinstated as an active member of the OWOW team.
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            We look forward to working with you again!
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-top: 30px;">
            Best regards,<br/>
            <strong>The OWOW Management Team</strong>
          </p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px;">
              This is an automated message from Wizkid Manager 2000.
            </p>
          </div>
        </div>
      `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "OWOW HR <hr@owow.flowspace.site>",
        to: [wizkidEmail],
        subject,
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend error:", data);
      return new Response(
        JSON.stringify({ error: data.message || "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, messageId: data.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
