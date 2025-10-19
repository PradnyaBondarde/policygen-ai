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

    // Build comprehensive prompt based on collected data
    const businessInfo = formData.ownerType === "Business" 
      ? `${formData.businessName} (${formData.businessType === "Other" ? formData.businessTypeOther : formData.businessType})`
      : formData.individualName || "the service provider";
    
    const contactInfo = formData.ownerType === "Business" 
      ? formData.businessEmail 
      : formData.individualEmail;

    const prompt = `Generate a comprehensive, legally-compliant Privacy Policy document following the TermsFeed template structure.

BUSINESS INFORMATION:
- Company/Owner: ${businessInfo}
- Type: ${formData.ownerType}
- Platform: ${formData.platformType}
${formData.websiteUrl ? `- Website URL: ${formData.websiteUrl}` : ''}
${formData.appName ? `- App Name: ${formData.appName}` : ''}
- Contact Email: ${contactInfo}
- Address: ${formData.businessAddress || 'N/A'}, ${formData.businessCity || ''}, ${formData.businessCountry || ''}
- Languages: ${(formData.languages || ['English']).join(', ')}
- Target Audience: ${(formData.targetAgeGroups || []).join(', ')}

DATA COLLECTED:
${(formData.userDataCollected || []).map((item: string) => `- ${item}`).join('\n')}

COLLECTION METHODS:
${(formData.collectionMethods || []).map((item: string) => `- ${item}`).join('\n')}

LEGAL FRAMEWORKS:
${(formData.legalCompliance || ['General Privacy Policy']).map((law: string) => `- ${law}`).join('\n')}

Generate a professional privacy policy with these sections:
1. Introduction and Effective Date
2. Interpretation and Definitions
3. Collecting and Using Your Personal Data
   - Types of Data Collected
   - Use of Your Personal Data
   - Retention of Your Personal Data
   - Transfer of Your Personal Data
   - Disclosure of Your Personal Data
4. Security of Your Personal Data
5. Children's Privacy (if applicable)
6. Links to Other Websites
7. Changes to this Privacy Policy
8. Contact Us

For each legal framework selected, include specific compliance sections:
- GDPR: Include data controller information, legal basis, data subject rights (access, rectification, erasure, restriction, portability, objection)
- CCPA/CPRA: Include categories of personal information, right to opt-out, do not sell my personal information
- CalOPPA: Include privacy policy accessibility, user notification procedures
- COPPA: Include parental consent procedures, data collection from children
- DPDPA: Include data fiduciary information, consent management, data retention

Use clear, professional legal language. Format as clean HTML with proper headings (h1, h2, h3) and semantic structure.
Replace all placeholder text with actual information provided.`;

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
