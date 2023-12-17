// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const hf = new HfInference('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')

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  const { id } = await req.json()

  console.log(id)

  const { data, error } = await supabase.from('profiles').select().eq('user_id', id).single()
  if (error) throw error

  console.log(data)

  const race = await hf.imageClassification({
    data: await (await fetch(data.image)).blob(),
    model: 'skyau/dog-breed-classifier-vit'
  })

  console.log(race)

  if (race.length == 0) {
    return new Response(
      "Not identified",
      { status: 500 }
    )
  }

  race.sort((a, b) => b - a)

  return new Response(
    JSON.stringify({race: race[0].label}),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/race-verif' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
