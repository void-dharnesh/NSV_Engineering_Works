import express from 'express';
import cors from 'cors';
import { existsSync, promises as fs, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const enquiriesFile = path.join(__dirname, 'enquiries.json');

function loadLocalEnv() {
  const envFile = path.join(__dirname, '.env');
  if (!existsSync(envFile)) return;

  const lines = readFileSync(envFile, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadLocalEnv();

const app = express();
const PORT = process.env.PORT || 5000;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseEnquiriesTable = process.env.SUPABASE_ENQUIRIES_TABLE || 'enquiries';
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseServiceRoleKey);

const allowedRequirementTypes = new Set([
  'CNC Machining',
  'Cast Component Finishing',
  'Precision Polishing',
  'Industrial Job Work',
  'General Enquiry',
]);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
    methods: ['GET', 'POST'],
  }),
);
app.use(express.json({ limit: '20kb' }));

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

async function readEnquiries() {
  try {
    const raw = await fs.readFile(enquiriesFile, 'utf8');
    const data = JSON.parse(raw || '[]');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(enquiriesFile, '[]\n');
      return [];
    }
    throw error;
  }
}

async function saveEnquiry(enquiry) {
  const savedEnquiry = {
    id: `enq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    submittedAt: new Date().toISOString(),
    ...enquiry,
  };

  if (hasSupabaseConfig) {
    await saveEnquiryToSupabase(savedEnquiry);
    return savedEnquiry;
  }

  const enquiries = await readEnquiries();
  enquiries.unshift(savedEnquiry);
  await fs.writeFile(enquiriesFile, `${JSON.stringify(enquiries, null, 2)}\n`);
  return savedEnquiry;
}

async function saveEnquiryToSupabase(enquiry) {
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

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'NSV Engineering Works enquiry API',
    storage: hasSupabaseConfig ? 'supabase' : 'local-json',
  });
});

app.post('/api/enquiry', async (req, res) => {
  try {
    const { enquiry, error } = validateEnquiry(req.body || {});

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const savedEnquiry = await saveEnquiry(enquiry);

    return res.status(201).json({
      success: true,
      message: 'Enquiry received successfully.',
      enquiryId: savedEnquiry.id,
    });
  } catch (error) {
    console.error('Failed to save enquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to save enquiry right now. Please try again later.',
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found.',
  });
});

app.listen(PORT, () => {
  console.log(`NSV Engineering Works enquiry API running on http://localhost:${PORT}`);
});
