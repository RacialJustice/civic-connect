import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { alert } = await req.json()
    
    // Send SMS to authorities (implement with your SMS provider)
    // await sendSMS(...)

    // Send email notifications (implement with your email provider)
    // await sendEmail(...)

    // Update alert status
    const { data, error } = await supabaseAdmin
      .from('emergency_alerts')
      .update({ status: 'acknowledged' })
      .eq('id', alert.id)
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ message: 'Alert processed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
