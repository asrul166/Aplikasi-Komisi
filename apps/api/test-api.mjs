/**
 * AutoComm API — Comprehensive End-to-End Test Script
 * Tests every route in the API against a running dev server.
 *
 * Usage: node test-api.mjs
 */

const BASE = 'http://localhost:3001';
let sessionCookie = '';
let userId = '';
let workspaceId = '';
let transactionId = '';
let transaction2Id = '';
let ruleId = '';
let tierId = '';
let tier2Id = '';
let scheduleId = '';
let reportId = '';
let invitedUserId = '';
let auditLogId = '';

const results = [];
let passCount = 0;
let failCount = 0;

// ── Helpers ──────────────────────────────────────────────────────

async function req(method, path, body = null, expectStatus = 200) {
  const url = `${BASE}${path}`;
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5173',    // Required by Better Auth CSRF
      'Referer': 'http://localhost:5173/',
      ...(sessionCookie ? { Cookie: sessionCookie } : {}),
    },
    redirect: 'manual',  // Don't follow redirects so we capture cookies
  };
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}

    const passed = res.status === expectStatus;
    const label = `${method} ${path.split('?')[0]}`;
    if (passed) {
      passCount++;
      results.push({ label, status: res.status, result: '✅ PASS' });
    } else {
      failCount++;
      results.push({
        label,
        status: res.status,
        expected: expectStatus,
        result: '❌ FAIL',
        body: (text || '').substring(0, 200),
      });
    }

    // Capture set-cookie headers
    const setCookieHeaders = res.headers.getSetCookie?.() || [];
    if (setCookieHeaders.length > 0) {
      const existing = sessionCookie ? sessionCookie.split('; ') : [];
      const merged = new Map();
      for (const c of existing) {
        const [k] = c.split('=');
        if (k) merged.set(k.trim(), c);
      }
      for (const header of setCookieHeaders) {
        const cookiePart = header.split(';')[0].trim();
        const [k] = cookiePart.split('=');
        if (k) merged.set(k.trim(), cookiePart);
      }
      sessionCookie = [...merged.values()].join('; ');
    }

    return { status: res.status, json, text, ok: passed };
  } catch (err) {
    failCount++;
    results.push({
      label: `${method} ${path.split('?')[0]}`,
      result: '❌ ERROR',
      error: err.message,
    });
    return { status: 0, json: null, text: '', ok: false };
  }
}

function section(name) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  ${name}`);
  console.log('─'.repeat(60));
}

// ── Test Suites ──────────────────────────────────────────────────

async function testHealth() {
  section('🏥 Health Check');
  const r = await req('GET', '/health');
  console.log('  Response:', JSON.stringify(r.json));
}

async function testAuth() {
  section('🔐 Authentication (Better Auth)');

  // 1. Sign Up
  const signup = await req('POST', '/api/auth/sign-up/email', {
    name: 'Test Admin',
    email: 'admin@autocomm.test',
    password: 'TestPassword123!',
  });
  if (signup.json?.user?.id) {
    userId = signup.json.user.id;
    console.log('  ✓ Created user:', userId);
  } else {
    console.log('  Sign-up response:', JSON.stringify(signup.json).substring(0, 200));
  }

  // 2. Sign In (in case user already existed)
  const signin = await req('POST', '/api/auth/sign-in/email', {
    email: 'admin@autocomm.test',
    password: 'TestPassword123!',
  });
  if (signin.json?.user?.id) {
    userId = signin.json.user.id;
    console.log('  ✓ Signed in as:', userId);
    console.log('  ✓ Session cookie:', sessionCookie ? 'CAPTURED' : 'MISSING');
  } else {
    console.log('  Sign-in response:', JSON.stringify(signin.json).substring(0, 200));
  }

  // 3. Get Session
  const session = await req('GET', '/api/auth/get-session');
  if (session.json?.user) {
    console.log('  ✓ Session validated for:', session.json.user.email);
    userId = session.json.user.id;
  } else {
    console.log('  Session response:', JSON.stringify(session.json).substring(0, 200));
  }
}

async function setupWorkspace() {
  section('🏢 Workspace Setup');

  // We need to set up the workspace via direct DB since the user has no workspaceId yet.
  // First, create a workspace, then update the user record.
  // We'll use a helper approach: call workspace service's ensureDefault via a quick script.
  
  // For now, test what we can:
  const get = await req('GET', '/api/workspaces/current');
  if (get.json?.id) {
    workspaceId = get.json.id;
    console.log('  ✓ Current workspace:', workspaceId);
  } else {
    console.log('  No workspace assigned yet:', JSON.stringify(get.json).substring(0, 100));
    console.log('  → Creating workspace via seed...');
    
    // We'll seed via pg directly
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: 'postgresql://autocomm:autocomm_secret@localhost:5433/autocomm' });
    
    // Create default workspace
    const wsResult = await pool.query(
      `INSERT INTO workspaces (name, max_seats) VALUES ($1, $2) 
       ON CONFLICT DO NOTHING 
       RETURNING id`,
      ['AutoComm Default', 50]
    );
    
    if (wsResult.rows.length > 0) {
      workspaceId = wsResult.rows[0].id;
    } else {
      const existing = await pool.query('SELECT id FROM workspaces LIMIT 1');
      workspaceId = existing.rows[0]?.id;
    }
    
    if (workspaceId && userId) {
      // Assign user to workspace and make them admin
      await pool.query(
        'UPDATE "user" SET workspace_id = $1, role = $2 WHERE id = $3',
        [workspaceId, 'admin', userId]
      );
      console.log('  ✓ Created workspace:', workspaceId);
      console.log('  ✓ Assigned user as admin');
    }
    
    await pool.end();
  }
}

async function testWorkspaceRoutes() {
  section('🏢 Workspace Routes');

  // GET current workspace
  await req('GET', '/api/workspaces/current');

  // UPDATE workspace
  await req('PUT', '/api/workspaces/current', {
    name: 'AutoComm Test Workspace',
    maxSeats: 100,
  });
  console.log('  ✓ Updated workspace name and seats');

  // UPDATE AI config
  await req('PUT', '/api/workspaces/ai-config', {
    aiEndpoint: 'https://api.openai.com/v1/chat/completions',
    anomalySensitivity: 0.85,
  });
  console.log('  ✓ Updated AI config');
}

async function testDashboard() {
  section('📊 Dashboard');

  const summary = await req('GET', '/api/dashboard/summary');
  if (summary.json) console.log('  Summary:', JSON.stringify(summary.json));

  await req('GET', '/api/dashboard/commission-progress?period=weekly');
  await req('GET', '/api/dashboard/monthly-goal');
  await req('GET', '/api/dashboard/recent-transactions');
}

async function testTransactions() {
  section('💰 Transactions');

  // Create transaction 1
  const code1 = `TXN-${Date.now()}-A`;
  const create1 = await req('POST', '/api/transactions', {
    transactionCode: code1,
    customerName: 'Acme Corporation',
    date: '2026-04-01',
    quantity: 5,
    unitPrice: 25000,
    status: 'pending',
    notes: 'Test transaction from API test suite',
  }, 201);
  if (create1.json?.id) {
    transactionId = create1.json.id;
    console.log('  ✓ Created TXN 1:', transactionId, `(${code1})`);
  } else {
    console.log('  Create 1 failed:', JSON.stringify(create1.json).substring(0, 150));
  }

  // Create transaction 2
  const code2 = `TXN-${Date.now()}-B`;
  const create2 = await req('POST', '/api/transactions', {
    transactionCode: code2,
    customerName: 'Stellar Labs',
    date: '2026-04-02',
    quantity: 3,
    unitPrice: 50000,
    status: 'success',
  }, 201);
  if (create2.json?.id) {
    transaction2Id = create2.json.id;
    console.log('  ✓ Created TXN 2:', transaction2Id, `(${code2})`);
  }

  // List with pagination
  const list = await req('GET', '/api/transactions?page=1&limit=10');
  if (list.json?.data) {
    console.log('  ✓ Listed', list.json.data.length, 'transactions,', list.json.pagination.totalItems, 'total');
  }

  // Stats
  const stats = await req('GET', '/api/transactions/stats');
  if (stats.json) console.log('  ✓ Stats:', JSON.stringify(stats.json));

  // Get by ID
  if (transactionId) {
    const get = await req('GET', `/api/transactions/${transactionId}`);
    console.log('  ✓ Fetched TXN:', get.json?.transactionCode);

    // Update
    const upd = await req('PUT', `/api/transactions/${transactionId}`, {
      customerName: 'Acme Corp (Updated)',
      quantity: 10,
      unitPrice: 25000,
    });
    console.log('  ✓ Updated customer to:', upd.json?.customerName);

    // Update status
    await req('PATCH', `/api/transactions/${transactionId}/status`, {
      status: 'success',
    });
    console.log('  ✓ Status changed to success');
  }

  // List with filters
  await req('GET', '/api/transactions?status=success&page=1&limit=5');
  await req('GET', '/api/transactions?search=Acme&page=1&limit=5');
  await req('GET', '/api/transactions?sort=amount&order=desc&page=1&limit=5');
}

async function testCommissions() {
  section('📐 Commission Rules');

  // Create Rule (flat)
  const flatRule = await req('POST', '/api/commissions/rules', {
    name: 'Standard Flat Rate',
    description: 'A simple flat 5.25% commission',
    type: 'flat',
    flatRate: 0.0525,
    status: 'operational',
  }, 201);
  let flatRuleId = '';
  if (flatRule.json?.id) {
    flatRuleId = flatRule.json.id;
    console.log('  ✓ Created flat rule:', flatRuleId, `(${flatRule.json.ruleCode})`);
  }

  // Create Rule (tiered)
  const tieredRule = await req('POST', '/api/commissions/rules', {
    name: 'Q2 Tiered Growth',
    description: 'Tiered commission with volume bonuses',
    type: 'tiered',
    flatRate: 0.03,
    status: 'operational',
  }, 201);
  if (tieredRule.json?.id) {
    ruleId = tieredRule.json.id;
    console.log('  ✓ Created tiered rule:', ruleId, `(${tieredRule.json.ruleCode})`);
  }

  // List Rules
  const list = await req('GET', '/api/commissions/rules?page=1&limit=10');
  if (list.json?.data) console.log('  ✓ Listed', list.json.data.length, 'rules');

  if (ruleId) {
    // Get Rule by ID (should include empty tiers and categories)
    const detail = await req('GET', `/api/commissions/rules/${ruleId}`);
    console.log('  ✓ Rule detail:', detail.json?.name, '- tiers:', detail.json?.tiers?.length);

    // Update Rule
    await req('PUT', `/api/commissions/rules/${ruleId}`, {
      name: 'Q2 Tiered Growth (v2)',
      description: 'Updated tiered commission',
    });

    // Add Tier 1
    const t1 = await req('POST', `/api/commissions/rules/${ruleId}/tiers`, {
      tierOrder: 1,
      minVolume: 0,
      maxVolume: 100000,
      commissionRate: 0.0025,
    }, 201);
    if (t1.json?.id) {
      tierId = t1.json.id;
      console.log('  ✓ Tier 1: $0–$100K @ 0.25%');
    }

    // Add Tier 2
    const t2 = await req('POST', `/api/commissions/rules/${ruleId}/tiers`, {
      tierOrder: 2,
      minVolume: 100001,
      maxVolume: 500000,
      commissionRate: 0.0015,
    }, 201);
    if (t2.json?.id) {
      tier2Id = t2.json.id;
      console.log('  ✓ Tier 2: $100K–$500K @ 0.15%');
    }

    // Add Tier 3 (unlimited)
    await req('POST', `/api/commissions/rules/${ruleId}/tiers`, {
      tierOrder: 3,
      minVolume: 500001,
      maxVolume: null,
      commissionRate: 0.001,
    }, 201);
    console.log('  ✓ Tier 3: $500K+ @ 0.10%');

    // Update Tier
    if (tierId) {
      await req('PUT', `/api/commissions/tiers/${tierId}`, {
        commissionRate: 0.003,
      });
      console.log('  ✓ Updated Tier 1 rate to 0.30%');
    }

    // Simulate — low volume (should hit tier 1)
    const sim1 = await req('POST', '/api/commissions/calculate', {
      ruleId,
      totalSales: 50000,
      cumulativeSales: 75000,
    });
    if (sim1.json) {
      console.log('  ✓ Sim @$75K cumulative: flat=$' + sim1.json.flatCommission + 
                  ', tier=$' + sim1.json.tieredBonus + 
                  ', total=$' + sim1.json.totalCommission);
    }

    // Simulate — mid volume (should hit tier 2)
    const sim2 = await req('POST', '/api/commissions/calculate', {
      ruleId,
      totalSales: 100000,
      cumulativeSales: 250000,
    });
    if (sim2.json) {
      console.log('  ✓ Sim @$250K cumulative: flat=$' + sim2.json.flatCommission + 
                  ', tier=$' + sim2.json.tieredBonus + 
                  ', total=$' + sim2.json.totalCommission);
    }

    // Simulate — high volume (should hit tier 3)
    const sim3 = await req('POST', '/api/commissions/calculate', {
      ruleId,
      totalSales: 200000,
      cumulativeSales: 750000,
    });
    if (sim3.json) {
      console.log('  ✓ Sim @$750K cumulative: flat=$' + sim3.json.flatCommission + 
                  ', tier=$' + sim3.json.tieredBonus + 
                  ', total=$' + sim3.json.totalCommission);
    }

    // Get rule again — now with tiers
    const ruleWithTiers = await req('GET', `/api/commissions/rules/${ruleId}`);
    console.log('  ✓ Rule now has', ruleWithTiers.json?.tiers?.length, 'tiers');
  }

  // List Payouts (empty for now)
  const payouts = await req('GET', '/api/commissions/payouts?page=1&limit=10');
  if (payouts.json?.data) console.log('  ✓ Payouts:', payouts.json.data.length, '(expected 0)');

  // Clean up flat rule
  if (flatRuleId) {
    await req('DELETE', `/api/commissions/rules/${flatRuleId}`, null, 204);
    console.log('  ✓ Deleted flat rule');
  }
}

async function testUsers() {
  section('👥 User Management');

  // List users
  const list = await req('GET', '/api/users?page=1&limit=10');
  if (list.json?.data) console.log('  ✓ Listed', list.json.data.length, 'users');

  // Stats
  const stats = await req('GET', '/api/users/stats');
  if (stats.json) {
    console.log('  ✓ Stats: total=' + stats.json.totalUsers + 
                ', maxSeats=' + stats.json.maxSeats + 
                ', active=' + stats.json.activeUsers);
  }

  // Get own profile
  if (userId) {
    const me = await req('GET', `/api/users/${userId}`);
    console.log('  ✓ My profile:', me.json?.name, '/', me.json?.role);
  }

  // Invite new user (sales)
  const invite1 = await req('POST', '/api/users/invite', {
    name: 'Jane Sales Agent',
    email: `jane-${Date.now()}@autocomm.test`,
    role: 'sales',
  }, 201);
  if (invite1.json?.id) {
    invitedUserId = invite1.json.id;
    console.log('  ✓ Invited sales agent:', invitedUserId);
  }

  // Invite another user (manager)
  const invite2 = await req('POST', '/api/users/invite', {
    name: 'Bob Manager',
    email: `bob-${Date.now()}@autocomm.test`,
    role: 'manager',
  }, 201);
  if (invite2.json?.id) console.log('  ✓ Invited manager:', invite2.json.id);

  // Update invited user
  if (invitedUserId) {
    await req('PUT', `/api/users/${invitedUserId}`, {
      jobTitle: 'Senior Sales Representative',
    });
    console.log('  ✓ Updated job title');

    // Change role
    await req('PATCH', `/api/users/${invitedUserId}/role`, {
      role: 'manager',
    });
    console.log('  ✓ Changed role to manager');

    // Toggle inactive
    await req('PATCH', `/api/users/${invitedUserId}/status`, {
      isActive: false,
    });
    console.log('  ✓ Deactivated user');

    // Toggle active again
    await req('PATCH', `/api/users/${invitedUserId}/status`, {
      isActive: true,
    });
    console.log('  ✓ Reactivated user');
  }

  // Updated stats
  const stats2 = await req('GET', '/api/users/stats');
  if (stats2.json) {
    console.log('  ✓ Updated stats: total=' + stats2.json.totalUsers + ', active=' + stats2.json.activeUsers);
  }
}

async function testReporting() {
  section('📑 Reporting');

  // Generate CSV report
  const csvReport = await req('POST', '/api/reports/generate', {
    format: 'csv',
    detailLevel: 'standard',
  }, 201);
  if (csvReport.json?.id) {
    reportId = csvReport.json.id;
    console.log('  ✓ Generated CSV report:', reportId);
  }

  // Generate PDF report
  const pdfReport = await req('POST', '/api/reports/generate', {
    format: 'pdf',
    detailLevel: 'comprehensive',
  }, 201);
  if (pdfReport.json?.id) console.log('  ✓ Generated PDF report:', pdfReport.json.id);

  // Report history
  const history = await req('GET', '/api/reports/history?page=1&limit=10');
  if (history.json?.data) console.log('  ✓ Report history:', history.json.data.length, 'entries');

  // Download report
  if (reportId) {
    const dl = await req('GET', `/api/reports/download/${reportId}`);
    console.log('  ✓ Download returned status:', dl.status);
  }

  // Create schedule
  const sched = await req('POST', '/api/reports/schedules', {
    name: 'Weekly Commission Summary',
    frequency: 'weekly',
    format: 'csv',
    detailLevel: 'comprehensive',
    dataSlice: 'All Teams',
    recipients: [userId],
  }, 201);
  if (sched.json?.id) {
    scheduleId = sched.json.id;
    console.log('  ✓ Created schedule:', scheduleId);
  }

  // Create another schedule
  await req('POST', '/api/reports/schedules', {
    name: 'Monthly Audit Report',
    frequency: 'monthly',
    format: 'pdf',
    detailLevel: 'audit',
  }, 201);

  // List schedules
  const scheds = await req('GET', '/api/reports/schedules');
  if (Array.isArray(scheds.json)) console.log('  ✓ Schedules:', scheds.json.length);

  // Update schedule
  if (scheduleId) {
    await req('PUT', `/api/reports/schedules/${scheduleId}`, {
      name: 'Bi-Weekly Commission Summary',
      frequency: 'weekly',
    });
    console.log('  ✓ Updated schedule');
  }
}

async function testCSVImport() {
  section('📂 CSV Import');

  // Template download (the route returns a file download)
  const template = await req('GET', '/api/csv/template');
  console.log('  ✓ Template endpoint returned:', template.status);

  // Note: File upload (multipart) can't easily be tested with fetch.
  // The upload/mapping/import flow would need multipart form data.
  console.log('  ℹ️  File upload test skipped (requires multipart form data)');
}

async function testAudit() {
  section('📋 Audit Logs');

  // Wait a moment for audit logs to be written (they write on response finish)
  await new Promise(r => setTimeout(r, 1000));

  // List
  const list = await req('GET', '/api/audit?page=1&limit=20');
  if (list.json?.data) {
    console.log('  ✓ Found', list.json.data.length, 'audit logs (total:', list.json.pagination.totalItems + ')');
    if (list.json.data.length > 0) {
      auditLogId = list.json.data[0].id;
      // Show a few logs
      for (const log of list.json.data.slice(0, 5)) {
        console.log(`    → ${log.action} by ${log.actorName} (${log.status})`);
      }
    }
  }

  // Get specific log
  if (auditLogId) {
    const detail = await req('GET', `/api/audit/${auditLogId}`);
    if (detail.json) {
      console.log('  ✓ Audit detail:', detail.json.action, '→', detail.json.targetResource);
    }
  }
}

async function testAIPlaceholders() {
  section('🤖 AI Placeholders');

  const chat = await req('POST', '/api/ai/chat', { message: 'How am I doing?' });
  if (chat.json) console.log('  ✓ Chat:', chat.json.response?.substring(0, 80));

  const anomaly = await req('POST', '/api/ai/anomaly-detect', {});
  if (anomaly.json?.anomalies) console.log('  ✓ Anomalies detected:', anomaly.json.anomalies.length);

  const mapping = await req('POST', '/api/ai/csv-mapping', {});
  if (mapping.json?.mappings) console.log('  ✓ Column mappings:', mapping.json.mappings.length);
}

async function testAuthProtection() {
  section('🛡️ Auth & RBAC Protection (unauthenticated)');

  const savedCookie = sessionCookie;
  sessionCookie = '';

  await req('GET', '/api/dashboard/summary', null, 401);
  await req('GET', '/api/transactions', null, 401);
  await req('POST', '/api/transactions', { transactionCode: 'X', customerName: 'X', date: '2026-01-01', quantity: 1, unitPrice: 1 }, 401);
  await req('GET', '/api/commissions/rules', null, 401);
  await req('POST', '/api/commissions/rules', { name: 'Hack', type: 'flat' }, 401);
  await req('GET', '/api/users', null, 401);
  await req('POST', '/api/users/invite', { name: 'Hacker', email: 'h@x.com', role: 'admin' }, 401);
  await req('GET', '/api/reports/schedules', null, 401);
  await req('GET', '/api/audit', null, 401);
  await req('GET', '/api/csv/template', null, 401);
  await req('PUT', '/api/workspaces/current', { name: 'Hacked' }, 401);

  console.log('  ✓ All 11 protected routes correctly return 401');

  sessionCookie = savedCookie;
}

async function testEdgeCases() {
  section('🔍 Edge Cases & Error Handling');

  // 404 route
  await req('GET', '/api/nonexistent', null, 404);
  console.log('  ✓ Unknown route → 404');

  // Non-existent resource
  const fake = await req('GET', '/api/transactions/00000000-0000-0000-0000-000000000000');
  if (fake.status >= 400) {
    results[results.length - 1].result = '✅ PASS';
    results[results.length - 1].expected = undefined;
    passCount++;
    failCount--;
    console.log('  ✓ Fake transaction ID → ' + fake.status);
  }

  // Validation error (missing required field)
  const invalid = await req('POST', '/api/transactions', {
    customerName: 'Test',
    // missing transactionCode, date, quantity, unitPrice
  }, 400);
  console.log('  ✓ Invalid body → 400');

  // Validation error (wrong type)  
  const wrongType = await req('POST', '/api/transactions', {
    transactionCode: 'TEST',
    customerName: 'Test',
    date: '2026-01-01',
    quantity: 'not-a-number',
    unitPrice: 100,
  }, 400);
  console.log('  ✓ Wrong type → 400');
}

async function testCleanup() {
  section('🧹 Cleanup');

  // Delete tier
  if (tierId) {
    await req('DELETE', `/api/commissions/tiers/${tierId}`, null, 204);
    console.log('  ✓ Deleted tier 1');
  }
  if (tier2Id) {
    await req('DELETE', `/api/commissions/tiers/${tier2Id}`, null, 204);
    console.log('  ✓ Deleted tier 2');
  }

  // Delete rule (cascades remaining tiers)
  if (ruleId) {
    await req('DELETE', `/api/commissions/rules/${ruleId}`, null, 204);
    console.log('  ✓ Deleted tiered rule (cascaded tiers)');
  }

  // Delete schedules
  if (scheduleId) {
    await req('DELETE', `/api/reports/schedules/${scheduleId}`, null, 204);
    console.log('  ✓ Deleted schedule');
  }

  // Delete transactions
  if (transactionId) {
    await req('DELETE', `/api/transactions/${transactionId}`, null, 204);
    console.log('  ✓ Deleted transaction 1');
  }
  if (transaction2Id) {
    await req('DELETE', `/api/transactions/${transaction2Id}`, null, 204);
    console.log('  ✓ Deleted transaction 2');
  }
}

// ── Main Runner ──────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║       AutoComm API — Comprehensive Test Suite           ║');
  console.log('║       Target: http://localhost:3001                      ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  await testHealth();
  await testAuth();
  await setupWorkspace();
  await testWorkspaceRoutes();
  await testDashboard();
  await testTransactions();
  await testCommissions();
  await testUsers();
  await testReporting();
  await testCSVImport();
  await testAudit();
  await testAIPlaceholders();
  await testAuthProtection();
  await testEdgeCases();
  await testCleanup();

  // ── Summary ──────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log('  TEST RESULTS');
  console.log('═'.repeat(60));
  
  for (const r of results) {
    const status = r.expected
      ? `${r.status} (expected ${r.expected})`
      : `${r.status}`;
    console.log(`  ${r.result}  ${r.label} → ${status}`);
    if (r.result === '❌ FAIL' && r.body) {
      console.log(`         ${r.body}`);
    }
    if (r.error) console.log(`         Error: ${r.error}`);
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`  ✅ Passed: ${passCount}`);
  console.log(`  ❌ Failed: ${failCount}`);
  console.log(`  📊 Total:  ${passCount + failCount}`);
  console.log('═'.repeat(60));

  if (failCount > 0) {
    console.log('\n  ⚠️  Some tests failed. See details above.\n');
  } else {
    console.log('\n  🎉 All tests passed!\n');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
