import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.json();
    console.log('Generating policy for:', formData.appName);

    const prompt = `Generate a comprehensive, legally-compliant privacy policy for the following application:

App Name: ${formData.appName}
Website URL: ${formData.websiteUrl}
Entity Type: ${formData.entityType}
Country: ${formData.country}
State: ${formData.state}

Data Collected:
${formData.userDataCollected.join(', ')}

Device Permissions:
${formData.devicePermissions.join(', ')}

Analytics Tools: ${formData.analytics.tools.join(', ')}
Email Marketing: ${formData.emailMarketing.tools.join(', ')}
Advertising: ${formData.advertising.tools.join(', ')}
Payment Processing: ${formData.payments.tools.join(', ')}
Remarketing: ${formData.remarketing.tools.join(', ')}

Legal Compliance Required:
${formData.legalCompliance.join(', ')}

Contact Email: ${formData.contactEmail}
Contact Page: ${formData.contactPage}

Generate a professional, comprehensive privacy policy that:
1. Covers all data collection practices
2. Explains user rights under ${formData.legalCompliance.join(', ')}
3. Details third-party integrations
4. Includes clear contact information
5. Uses professional legal language
6. Is formatted in markdown

Structure the policy with proper headings and sections.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'You are a legal expert specializing in privacy policies and data protection law. Generate clear, comprehensive, legally-compliant privacy policies.'
          },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate policy', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedPolicy = data.choices[0].message.content;

    console.log('Policy generated successfully');

    return new Response(
      JSON.stringify({ policy: generatedPolicy }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-policy function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
