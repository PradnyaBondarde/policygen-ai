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

    // Force immediate evaluation of the date and format it
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Create the policy template without dates (will be added dynamically)
    const policyTemplate = `## PRIVACY POLICY

This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.`;

    const prompt = `Generate a comprehensive, legally-compliant Privacy Policy document following the TermsFeed template structure.

IMPORTANT: Use the following exact text for the beginning of the policy, including the dates:
${policyTemplate}

Continue the policy with the following sections:


CRITICAL FORMATTING REQUIREMENTS:
- Return PLAIN TEXT ONLY (absolutely NO HTML tags like <h1>, <p>, <div>, etc.)
- Use this EXACT heading format: "## HEADING TEXT" for main sections (we'll style these blue in the UI)
- Use "### Subheading Text" for subsections
- Use bullet points with "-" or "•" for lists
- Use proper spacing between sections (double line breaks)
- Make headings UPPERCASE for main sections
- Keep the exact TermsFeed structure and professional legal tone

BUSINESS INFORMATION:
- Company/Owner: ${businessInfo}
- Type: ${formData.ownerType}
- Platform: ${formData.platformType}
${formData.websiteUrl ? `- Website URL: ${formData.websiteUrl}` : ''}
${formData.appName ? `- App Name: ${formData.appName}` : ''}
- Contact Email: ${contactInfo}
- Address: ${formData.businessAddress || 'N/A'}, ${formData.businessCity || ''}, ${formData.businessCountry || ''}
- Languages: ${(formData.languages || ['English']).join(', ')}
- Target Audience: ${formData.targetAgeGroup || 'All ages'}

DATA COLLECTED:
${formData.userDataNone ? '- No user data collected' : (formData.userDataCollected || []).map((item: string) => `- ${item}`).join('\n')}

COLLECTION METHODS:
${formData.collectionMethodsNone ? '- No data collection methods' : (formData.collectionMethods || []).map((item: string) => `- ${item}`).join('\n')}

DEVICE PERMISSIONS:
${formData.devicePermissionsNone ? '- No device permissions required' : (formData.devicePermissions || []).map((item: string) => `- ${item}`).join('\n')}

PURPOSE OF PROCESSING:
${formData.processingNone ? '- No data processing' : Object.entries(formData).filter(([key, val]: [string, any]) => ['analytics', 'emailMarketing', 'advertising', 'payments', 'remarketing'].includes(key) && val?.enabled).map(([key, val]: [string, any]) => `- ${key}: ${(val.tools || []).join(', ')}`).join('\n')}

THIRD PARTY SHARING:
${formData.thirdPartiesSharingNone ? '- No third-party data sharing' : (formData.thirdPartiesSharing?.categories || []).map((cat: string) => `- ${cat}`).join('\n')}

RETENTION & SECURITY:
${formData.retentionSecurityNone ? '- No specific retention/security policies' : `- Retention Period: ${formData.retentionSecurity?.retentionPeriod || 'As required by law'}\n- Security Measures: ${formData.retentionSecurity?.securityMeasures || 'Industry-standard security'}\n- Breach Procedure: ${formData.retentionSecurity?.breachProcedure || 'Notification within 72 hours'}`}

COOKIES:
${formData.cookiesConsentNone ? '- No cookies used' : `- Uses Cookies: ${formData.cookiesConsent?.usesCookies ? 'Yes' : 'No'}\n- Cookie Types: ${(formData.cookiesConsent?.cookieTypes || []).join(', ')}`}

LEGAL FRAMEWORKS:
${formData.legalComplianceNone ? '- General Privacy Policy' : (formData.legalCompliance || ['General Privacy Policy']).map((law: string) => `- ${law}`).join('\n')}

CONTACT INFORMATION:
- Name: ${formData.contactFinalization?.privacyContactName || businessInfo}
- Email: ${formData.contactFinalization?.contactEmail || contactInfo}
${formData.contactFinalization?.contactPage ? `- Contact Page: ${formData.contactFinalization.contactPage}` : ''}
${formData.contactFinalization?.phone ? `- Phone: ${formData.contactFinalization.phone}` : ''}

Generate a professional privacy policy with this EXACT structure and heading format:

## PRIVACY POLICY

Effective Date: ${currentDate}
Last Updated: ${currentDate}

This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.

## INTERPRETATION AND DEFINITIONS

### Interpretation
Words with initial capital letters have specific meanings defined below.

### Definitions
For the purposes of this Privacy Policy:
- Account: A unique account created for You to access our Service
- Company: Refers to ${businessInfo}
- Cookies: Small files placed on Your device
- Device: Any device that can access the Service
- Personal Data: Information relating to an identified or identifiable individual
- Service: Refers to the ${formData.platformType === 'Website' ? 'Website' : formData.platformType === 'Mobile App' ? 'Mobile Application' : 'Service'}
- Usage Data: Data collected automatically from use of the Service

## COLLECTING AND USING YOUR PERSONAL DATA

### Types of Personal Data Collected

### Personal Data
While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. This may include:
${formData.userDataNone ? '- We do not collect personal data' : (formData.userDataCollected || []).map((item: string) => `- ${item}`).join('\n')}

### Usage Data
Usage Data is collected automatically when using the Service.

### Use of Your Personal Data
The Company may use Personal Data for the following purposes:
- To provide and maintain our Service
- To manage Your Account
- For the performance of a contract
- To contact You
- To provide You with news and special offers
- To manage Your requests
- For business transfers
- For other purposes

### Retention of Your Personal Data
${formData.retentionSecurityNone ? 'We retain Your Personal Data only for as long as necessary for the purposes set out in this Privacy Policy.' : `We will retain Your Personal Data for ${formData.retentionSecurity?.retentionPeriod || 'as long as necessary for the purposes set out in this Privacy Policy'}.`}

### Transfer of Your Personal Data
Your information may be transferred to — and maintained on — computers located outside of Your jurisdiction where data protection laws may differ.

### Disclosure of Your Personal Data
${formData.thirdPartiesSharingNone ? 'We do not share Your Personal Data with third parties.' : 'We may share Your Personal Data in certain situations as described below.'}

## SECURITY OF YOUR PERSONAL DATA

${formData.retentionSecurityNone ? 'The security of Your Personal Data is important to Us. We strive to use commercially acceptable means to protect Your Personal Data.' : formData.retentionSecurity?.securityMeasures || 'The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet is 100% secure.'}

## CHILDREN'S PRIVACY

${formData.targetAgeGroup === 'Children (<13)' ? 'Our Service is directed to children under the age of 13. We comply with COPPA (Children\'s Online Privacy Protection Act) and implement parental consent mechanisms before collecting any personal information from children.' : 'Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13.'}

## LINKS TO OTHER WEBSITES

Our Service may contain links to other websites that are not operated by Us. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.

## CHANGES TO THIS PRIVACY POLICY

We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.

You are advised to review this Privacy Policy periodically for any changes.

${!formData.legalComplianceNone && (formData.legalCompliance || []).length > 0 ? `

## LEGAL COMPLIANCE

${(formData.legalCompliance || []).includes('GDPR') ? `
### GDPR Compliance (European Union)

If You are from the European Economic Area (EEA), Our legal basis for collecting and using Your personal information depends on the Personal Data We collect and the specific context.

#### Your Rights Under GDPR:
- Right to access Your Personal Data
- Right to rectification of inaccurate data
- Right to erasure ("right to be forgotten")
- Right to restrict processing
- Right to data portability
- Right to object to processing
- Right to withdraw consent

To exercise these rights, please contact Us using the information provided below.
` : ''}

${(formData.legalCompliance || []).includes('CCPA/CPRA') ? `
### CCPA/CPRA Compliance (California)

If You are a California resident, You have specific rights regarding Your personal information:

#### Your Rights:
- Right to know what personal information is collected
- Right to know whether personal information is sold or disclosed
- Right to say no to the sale of personal information
- Right to access Your personal information
- Right to equal service and price
- Right to deletion

#### Do Not Sell My Personal Information
We do not sell Your personal information to third parties.
` : ''}

${(formData.legalCompliance || []).includes('COPPA') ? `
### COPPA Compliance (Children's Privacy)

We comply with the Children's Online Privacy Protection Act (COPPA). We implement verifiable parental consent mechanisms before collecting personal information from children under 13.
` : ''}
` : ''}

## CONTACT US

If you have any questions about this Privacy Policy, You can contact us:

- By email: ${formData.contactFinalization?.contactEmail || contactInfo}
- By visiting this page on our website: ${formData.contactFinalization?.contactPage || formData.websiteUrl || 'N/A'}
${formData.contactFinalization?.phone ? `- By phone: ${formData.contactFinalization.phone}` : ''}

Contact Person: ${formData.contactFinalization?.privacyContactName || businessInfo}

---

This Privacy Policy was generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.

FORMATTING RULES APPLIED:
- Plain text only (NO HTML tags whatsoever)
- Main section headings use "## HEADING" format (will be styled blue in UI)
- Subsections use "### Subheading" format
- Bullet points use "-" for lists
- Proper spacing between sections
- Professional legal language throughout
- All placeholder text replaced with actual information`;

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
            content: `You are a legal policy generator. CRITICAL: Generate ONLY plain text - absolutely NO HTML tags (no <html>, <head>, <body>, <h1>, <h2>, <p>, <div>, <ul>, <li>, <strong>, <a>, etc.). NO Markdown syntax (no ##, ###, **, etc.). 

Format rules:
- Use plain text headings in UPPERCASE on their own lines (e.g., "PRIVACY POLICY")
- Use section numbers (e.g., "1. Introduction", "2. Data Collection")
- Use simple bullet points with hyphens (-) for lists
- Use blank lines to separate sections
- The output must be pure readable text that can be copy-pasted directly into any document

If you include ANY HTML tags or Markdown syntax, the output will be rejected.`
          },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let policyContent = data.choices[0].message.content;
    
    // Insert current date at the top if not already present
    if (!policyContent.includes('Effective Date:')) {
      policyContent = `Effective Date: ${formattedDate}\nLast Updated: ${formattedDate}\n\n` + policyContent;
    }

    // Get current date in the required format
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Comprehensive date replacement patterns
    const datePatterns = [
      // Match 'Effective Date: ' or 'Effective Date : ' or 'Effective Date - ' etc.
      /Effective\s*Date\s*[:\-]?\s*[A-Za-z]+\s*\d{1,2},\s*20\d{2}/gi,
      // Match 'Last Updated: ' or similar variations
      /Last\s*Updated\s*[:\-]?\s*[A-Za-z]+\s*\d{1,2},\s*20\d{2}/gi,
      // Match any full month name date pattern (e.g., October 19, 2025)
      /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s*20\d{2}\b/gi,
      // Match numeric date formats (MM/DD/YYYY, DD-MM-YYYY, etc.)
      /\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/g,
      // Match 'generated on' dates
      /generated\s+on\s+[A-Za-z]+\s+\d{1,2},\s*20\d{2}/gi
    ];

    // Apply all replacement patterns
    datePatterns.forEach(pattern => {
      policyContent = policyContent.replace(pattern, match => {
        // For date patterns we want to replace with full date
        if (pattern.source.includes('Effective')) return `Effective Date: ${formattedDate}`;
        if (pattern.source.includes('Last Updated')) return `Last Updated: ${formattedDate}`;
        if (pattern.source.includes('generated on')) return `generated on ${formattedDate}`;
        return formattedDate; // Default replacement for other date patterns
      });
    });

    // Final pass to ensure no dates were missed
    policyContent = policyContent
      .replace(/Effective\s*Date\s*[:\-]?\s*.*?(\n|$)/i, `Effective Date: ${formattedDate}$1`)
      .replace(/Last\s*Updated\s*[:\-]?\s*.*?(\n|$)/i, `Last Updated: ${formattedDate}$1`);

    // Replace any year (20XX) with the current year
    policyContent = policyContent.replace(/\b(20\d{2})\b/g, new Date().getFullYear().toString());

    // Strip any HTML tags as a safety measure
    let generatedPolicy = policyContent
      .replace(/<[^>]*>/g, '') // Remove all HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .trim();

    console.log('Policy generated successfully, length:', generatedPolicy.length);

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
