const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('====================================================');
  console.log('  JHARKHAND CIVIC PORTAL - SYSTEM VERIFICATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    console.log('--- 1. Testing Health & Connectivity ---');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'online', 'Health endpoint returns online status');

    // 2. Security: Unauthorized Status Update Rejection
    console.log('\n--- 2. Testing Security & 401 Rejections ---');
    const unauthRes = await fetch(`${BASE_URL}/api/issues/66bb112233445566778899aa/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Resolved' }),
    });
    assert(unauthRes.status === 401, 'Unauthorized request to /api/issues/:id/status rejected with 401');

    // 3. Security: Invalid Token Rejection
    const invalidTokenRes = await fetch(`${BASE_URL}/api/issues/66bb112233445566778899aa/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer fake_invalid_token_123',
      },
      body: JSON.stringify({ status: 'Resolved' }),
    });
    assert(invalidTokenRes.status === 401, 'Fake/invalid Bearer token rejected with 401');

    // 4. Auth: Admin Login
    console.log('\n--- 3. Testing Authentication & RBAC ---');
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@jharkhand.gov.in', password: 'Admin@123' }),
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && !!adminLoginData.token && adminLoginData.role === 'admin', 'Admin login successful, returns valid JWT and role: admin');
    const adminToken = adminLoginData.token;

    // 5. Auth: Worker Login
    const workerLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ravi.kumar@jharkhand.gov.in', password: 'Worker@123' }),
    });
    const workerLoginData = await workerLoginRes.json();
    assert(workerLoginRes.status === 200 && !!workerLoginData.token && workerLoginData.role === 'worker', 'Worker login successful, returns valid JWT and role: worker');
    const workerToken = workerLoginData.token;

    // 6. Issues: List Issues with Pagination
    console.log('\n--- 4. Testing Grievance Retrieval & Pagination ---');
    const issuesRes = await fetch(`${BASE_URL}/api/issues?limit=10`);
    const issuesData = await issuesRes.json();
    assert(issuesRes.status === 200 && Array.isArray(issuesData.data) && issuesData.data.length > 0, `Issues list returned ${issuesData.data?.length} real database issues`);
    assert(!!issuesData.pagination && issuesData.pagination.total >= 8, `Pagination metadata returned (Total: ${issuesData.pagination?.total})`);

    // 7. Issues: Complaint Tracking by Tracking ID
    console.log('\n--- 5. Testing Citizen Complaint Tracking ---');
    const trackRes = await fetch(`${BASE_URL}/api/issues/track/JH-20260815-00001`);
    const trackData = await trackRes.json();
    assert(trackRes.status === 200 && trackData.data?.trackingId === 'JH-20260815-00001', 'Tracking lookup for JH-20260815-00001 returned correct grievance details');
    assert(!!trackData.data?.department && !!trackData.data?.aiSummary, 'Track data includes AI Summary and Departmental routing');

    // 8. Issues: Geospatial Proximity Search
    console.log('\n--- 6. Testing Geospatial $near Queries ---');
    const nearbyRes = await fetch(`${BASE_URL}/api/issues/nearby?lat=23.3441&lng=85.3096&radius=5000`);
    const nearbyData = await nearbyRes.json();
    assert(nearbyRes.status === 200 && Array.isArray(nearbyData.data), `Geospatial 2dsphere query returned ${nearbyData.data?.length} nearby issues within 5km of Ranchi station`);

    // 9. Worker: Assigned Tasks Endpoint
    console.log('\n--- 7. Testing Field Worker Workflow ---');
    const workerTasksRes = await fetch(`${BASE_URL}/api/issues/worker/tasks`, {
      headers: { Authorization: `Bearer ${workerToken}` },
    });
    const workerTasksData = await workerTasksRes.json();
    assert(workerTasksRes.status === 200 && Array.isArray(workerTasksData.data), `Worker tasks endpoint returned ${workerTasksData.data?.length} assigned work orders for Ravi Kumar`);

    // 10. Admin: Analytics Dashboard
    console.log('\n--- 8. Testing Admin Analytics Intelligence ---');
    const analyticsRes = await fetch(`${BASE_URL}/api/issues/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const analyticsData = await analyticsRes.json();
    assert(analyticsRes.status === 200 && analyticsData.data?.totalIssues >= 8, `Analytics returned total issues: ${analyticsData.data?.totalIssues}, resolution rate: ${analyticsData.data?.resolutionRate}%`);
    assert(Array.isArray(analyticsData.data?.categoryBreakdown) && Array.isArray(analyticsData.data?.severityBreakdown), 'Department and Severity aggregation breakdowns generated');

    // 11. Admin: Workers List
    const workersListRes = await fetch(`${BASE_URL}/api/issues/workers/list`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const workersListData = await workersListRes.json();
    assert(workersListRes.status === 200 && workersListData.data?.length >= 3, `Workers list returned ${workersListData.data?.length} active field personnel`);

    // 12. Spam Filter: Reject Short Description
    console.log('\n--- 9. Testing Spam & Validation Rules ---');
    const shortDescRes = await fetch(`${BASE_URL}/api/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'Too short', latitude: 23.34, longitude: 85.31 }),
    });
    assert(shortDescRes.status === 400, 'Report with <20 chars description or missing photo correctly rejected with 400');

    // Summary
    console.log('\n====================================================');
    console.log(`  VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal Verification Error:', err);
    process.exit(1);
  }
}

runTests();
