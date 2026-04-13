import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY');
const BREVO_API_URL = 'https://api.brevo.com/v3';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY is not configured in Supabase secrets');
    }

    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    const { user_id, email, first_name, last_name, phone_number } = body;

    if (!email) throw new Error('Email is required');

    console.log('[brevo-create-contact] Creating contact:', { email, user_id });

    // Build contact payload for Brevo
    const contactPayload: Record<string, unknown> = {
      email,
      updateEnabled: true,
      attributes: {
        FIRSTNAME: first_name || '',
        LASTNAME: last_name || '',
        SMS: phone_number || '',
      },
    };

    // Add to default list if configured
    const listId = Deno.env.get('BREVO_DEFAULT_LIST_ID');
    if (listId) {
      contactPayload.listIds = [parseInt(listId, 10)];
    }

    const brevoRes = await fetch(`${BREVO_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(contactPayload),
    });

    const brevoText = await brevoRes.text();

    // 201 = created, 204 = already exists (with updateEnabled it's 201 or 204)
    if (!brevoRes.ok && brevoRes.status !== 204) {
      let brevoError: { message?: string; code?: string } = {};
      try { brevoError = JSON.parse(brevoText); } catch { /* ignore */ }

      // Treat "Contact already exists" as success
      if (brevoError.code === 'duplicate_parameter' || brevoRes.status === 400) {
        console.log('[brevo-create-contact] Contact already exists, updating...');
        
        // Try updating instead
        const updateRes = await fetch(`${BREVO_API_URL}/contacts/${encodeURIComponent(email)}`, {
          method: 'PUT',
          headers: { 'api-key': BREVO_API_KEY!, 'Content-Type': 'application/json' },
          body: JSON.stringify({ attributes: contactPayload.attributes, listIds: contactPayload.listIds }),
        });

        if (!updateRes.ok) {
          const updateText = await updateRes.text();
          console.error('[brevo-create-contact] Update also failed:', updateText);
          // Non-fatal — don't block registration
        }
      } else {
        console.error('[brevo-create-contact] Brevo API error:', brevoRes.status, brevoText.substring(0, 300));
        // Non-fatal — return success so registration isn't blocked
      }
    }

    console.log('[brevo-create-contact] Contact synced to Brevo:', email);

    return new Response(
      JSON.stringify({ success: true, message: 'Contact synced to Brevo' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[brevo-create-contact] Error:', msg);
    // Return success to avoid blocking auth flows
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
