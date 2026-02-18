#!/usr/bin/env node
/**
 * Seed script: creates sample users (workers + employers), profiles, and published jobs.
 * Run after Docker (Postgres + Redis) and backend services are up.
 * Usage: node scripts/seed/run.mjs
 * Env: AUTH_URL, USER_URL, JOB_URL (defaults: localhost 3001, 3002, 3003)
 */

const AUTH_URL = process.env.AUTH_URL ?? 'http://localhost:3001/graphql';
const USER_URL = process.env.USER_URL ?? 'http://localhost:3002/graphql';
const JOB_URL = process.env.JOB_URL ?? 'http://localhost:3003/graphql';

const PASSWORD = 'Password123!';

async function graphql(url, query, variables = {}, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

async function register(email, password, userType, firstName, lastName) {
  const data = await graphql(
    AUTH_URL,
    `mutation Register($input: RegisterEmailInput!) {
      registerWithEmail(input: $input) {
        user { id email userType }
        accessToken refreshToken
      }
    }`,
    {
      input: {
        email,
        password,
        userType, // passed as string: "WORKER" or "EMPLOYER"
        ...(firstName ? { firstName } : {}),
        ...(lastName ? { lastName } : {}),
      },
    }
  );
  return data.registerWithEmail;
}

async function createWorkerProfile(token, input) {
  await graphql(
    USER_URL,
    `mutation CreateWorkerProfile($input: CreateWorkerProfileInput!) {
      createWorkerProfile(input: $input) { id firstName lastName }
    }`,
    { input },
    token
  );
}

async function createEmployerProfile(token, input) {
  await graphql(
    USER_URL,
    `mutation CreateEmployerProfile($input: CreateEmployerProfileInput!) {
      createEmployerProfile(input: $input) { id companyName }
    }`,
    { input },
    token
  );
}

async function createJob(token, input) {
  const data = await graphql(
    JOB_URL,
    `mutation CreateJob($input: CreateJobInput!) {
      createJob(input: $input) { id }
    }`,
    { input },
    token
  );
  return data.createJob.id;
}

async function publishJob(token, jobId) {
  await graphql(
    JOB_URL,
    `mutation PublishJob($id: String!) {
      publishJob(id: $id) { id status }
    }`,
    { id: jobId },
    token
  );
}

async function applyToJob(token, jobId, coverMessage) {
  await graphql(
    JOB_URL,
    `mutation ApplyToJob($input: CreateApplicationInput!) {
      applyToJob(input: $input) { id status }
    }`,
    { input: { jobId, coverMessage } },
    token
  );
}

const WORKERS = [
  { email: 'worker1@example.com', firstName: 'John', lastName: 'Doe' },
  { email: 'worker2@example.com', firstName: 'Jane', lastName: 'Smith' },
  { email: 'worker3@example.com', firstName: 'Bob', lastName: 'Wilson' },
];

const EMPLOYERS = [
  { email: 'employer1@example.com', companyName: 'CleanCo', industry: 'Cleaning' },
  { email: 'employer2@example.com', companyName: 'SecureGuard Inc', industry: 'Security' },
  { email: 'employer3@example.com', companyName: 'KitchenPro', industry: 'Hospitality' },
];

const JOB_ROLES = ['CLEANER', 'SECURITY_GUARD', 'COOK', 'DRIVER', 'RECEPTIONIST'];
const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT'];

async function main() {
  console.log('Seeding...');
  console.log('AUTH_URL:', AUTH_URL);
  console.log('USER_URL:', USER_URL);
  console.log('JOB_URL:', JOB_URL);

  const workerTokens = [];
  const employerTokens = [];
  const jobIds = [];

  for (const w of WORKERS) {
    try {
      const auth = await register(w.email, PASSWORD, 'WORKER', w.firstName, w.lastName);
      await createWorkerProfile(auth.accessToken, {
        firstName: w.firstName,
        lastName: w.lastName,
        skills: ['CLEANER', 'MAINTENANCE'],
        availability: [
          { role: 'CLEANER', employmentType: 'FULL_TIME' },
        ],
        location: 'New York, NY',
        experienceYears: 3,
        bio: 'Experienced cleaner and maintenance worker.',
      });
      workerTokens.push({ email: w.email, token: auth.accessToken });
      console.log('Created worker:', w.email);
    } catch (e) {
      console.log('Worker', w.email, ':', e.message);
    }
  }

  for (const e of EMPLOYERS) {
    try {
      const auth = await register(e.email, PASSWORD, 'EMPLOYER', '', '');
      await createEmployerProfile(auth.accessToken, {
        companyName: e.companyName,
        contactEmail: e.email,
        industry: e.industry,
        location: 'New York, NY',
        desiredRoles: ['CLEANER', 'SECURITY_GUARD', 'COOK'],
      });
      employerTokens.push({
        email: e.email,
        token: auth.accessToken,
        companyName: e.companyName,
      });
      console.log('Created employer:', e.email);
    } catch (err) {
      console.log('Employer', e.email, ':', err.message);
    }
  }

  const jobTemplates = [
    { title: 'Office Cleaner', description: 'We need a reliable office cleaner for our downtown office. Duties include vacuuming, mopping, restroom cleaning.', role: 'CLEANER', employmentType: 'FULL_TIME', location: 'New York, NY' },
    { title: 'Security Guard', description: 'Full-time security guard for commercial building. Must have valid license.', role: 'SECURITY_GUARD', employmentType: 'FULL_TIME', location: 'Brooklyn, NY' },
    { title: 'Line Cook', description: 'Experienced line cook for busy restaurant. Weekend availability required.', role: 'COOK', employmentType: 'PART_TIME', location: 'Manhattan, NY' },
    { title: 'Receptionist', description: 'Front desk receptionist. Answer phones, greet visitors, basic admin.', role: 'RECEPTIONIST', employmentType: 'FULL_TIME', location: 'Queens, NY' },
    { title: 'Delivery Driver', description: 'Part-time delivery driver. Own vehicle preferred.', role: 'DRIVER', employmentType: 'PART_TIME', location: 'New York, NY' },
  ];

  for (const emp of employerTokens) {
    for (let i = 0; i < 2; i++) {
      const t = jobTemplates[(employerTokens.indexOf(emp) * 2 + i) % jobTemplates.length];
      try {
        const id = await createJob(emp.token, {
          title: t.title + (i > 0 ? ' (2)' : ''),
          description: t.description,
          role: t.role,
          employmentType: t.employmentType,
          location: t.location,
        });
        await publishJob(emp.token, id);
        jobIds.push({ jobId: id, employerToken: emp.token });
        console.log('Created & published job:', t.title);
      } catch (err) {
        console.log('Job', t.title, ':', err.message);
      }
    }
  }

  if (workerTokens.length > 0 && jobIds.length > 0) {
    for (let wi = 0; wi < workerTokens.length; wi++) {
      for (let ji = 0; ji < Math.min(2, jobIds.length); ji++) {
        const job = jobIds[(wi + ji) % jobIds.length];
        try {
          await applyToJob(
            workerTokens[wi].token,
            job.jobId,
            `Interested in this position. - ${WORKERS[wi].firstName}`
          );
          console.log('Application:', workerTokens[wi].email, '-> job', job.jobId.slice(0, 8));
        } catch (err) {
          if (!err.message.includes('Already applied')) console.log('Apply:', err.message);
        }
      }
    }
  }

  console.log('Done. Sample logins (password for all):', PASSWORD);
  console.log('Workers:', WORKERS.map((w) => w.email).join(', '));
  console.log('Employers:', EMPLOYERS.map((e) => e.email).join(', '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
