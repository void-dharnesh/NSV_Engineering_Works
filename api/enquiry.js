const allowedRequirementTypes = new Set([
  'CNC Machining',
  'Cast Component Finishing',
  'Precision Polishing',
  'Industrial Job Work',
  'General Enquiry',
]);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseEnquiriesTable = process.env.SUPABASE_ENQUIRIES_TABLE || 'enquiries';

function sanitize(value, maxLength = 1000) {
  if (typeof value !== 'string') return '';
  return value
    .trim()
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, maxLength);
}

function validateEnquiry(payload) {
  const enquiry = {
    fullName: sanitize(payload.fullName, 100),
    phone: sanitize(payload.phone, 24),
    email: sanitize(payload.email, 140).toLowerCase(),
    requirementType: sanitize(payload.requirementType, 80),
    message: sanitize(payload.message, 2000),
  };

  if (!enquiry.fullName) return { error: 'Full name is required.' };
  if (!/^[0-9+\-\s()]{8,18}$/.test(enquiry.phone)) return { error: 'A valid phone number is required.' };
  if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    return { error: 'A valid email address is required.' };
  }
  if (!allowedRequirementTypes.has(enquiry.requirementType)) return { error: 'Please select a valid requirement type.' };
  if (enquiry.message.length < 10) return { error: 'Requirement details must be at least 10 characters.' };

  return { enquiry };
}

async function saveEnquiryToSupabase(enquiry) {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase environment variables are not configured.');
  }

  const endpoint = new URL(`/rest/v1/${supabaseEnquiriesTable}`, supabaseUrl);
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      id: enquiry.id,
      submitted_at: enquiry.submittedAt,
      full_name: enquiry.fullName,
      phone: enquiry.phone,
      email: enquiry.email || null,
      requirement_type: enquiry.requirementType,
      message: enquiry.message,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase enquiry insert failed: ${response.status} ${details}`);
  }
}

async function handler(request, response) {
  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  if (request.method !== 'POST') {
    response.status(405).json({
      success: false,
      message: 'Method not allowed.',
    });
    return;
  }

  try {
    const { enquiry, error } = validateEnquiry(request.body || {});

    if (error) {
      response.status(400).json({
        success: false,
        message: error,
      });
      return;
    }

    const savedEnquiry = {
      id: `enq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      submittedAt: new Date().toISOString(),
      ...enquiry,
    };

    await saveEnquiryToSupabase(savedEnquiry);

    response.status(201).json({
      success: true,
      message: 'Enquiry received successfully.',
      enquiryId: savedEnquiry.id,
    });
  } catch (error) {
    console.error('Failed to save enquiry:', error);
    response.status(500).json({
      success: false,
      message: 'Unable to save enquiry right now. Please try again later.',
    });
  }
}

module.exports = handler;
