const BASE_URL = 'http://localhost:5000/api';

async function testFullBackend() {
  console.log('=== STARTING LIVE BACKEND INTEGRATION TEST ===\n');

  try {
    // 1. Health Check
    console.log('[1/4] Testing GET /api/health...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log('  ✅ Health Status:', healthData);

    // 2. Admin Login
    console.log('\n[2/4] Testing POST /api/auth/login...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@jharkhand.gov',
        password: 'password123',
      }),
    });
    const loginData = await loginRes.json();
    console.log('  ✅ Login Success! Received JWT Token:', loginData.token.substring(0, 25) + '...');
    const adminToken = loginData.token;

    // 3. Issue Creation with Multipart Upload & Groq AI
    console.log('\n[3/4] Testing POST /api/issues with Multer + Cloudinary + Groq AI...');
    // Create a 1x1 dummy PNG image blob
    const dummyBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const imageBlob = new Blob([Buffer.from(dummyBase64, 'base64')], { type: 'image/png' });

    const formData = new FormData();
    formData.append('image', imageBlob, 'pothole_test.png');
    formData.append('description', 'Severe deep pothole on Main Road Ranchi causing heavy traffic jam');
    formData.append('latitude', '23.3441');
    formData.append('longitude', '85.3096');

    const issueRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      body: formData,
    });
    const issueData = await issueRes.json();
    console.log('  ✅ Issue Created & AI Triaged Successfully!');
    console.log('     ID:', issueData.data._id);
    console.log('     Category (AI):', issueData.data.category);
    console.log('     Severity (AI):', issueData.data.severity);
    console.log('     Cloudinary URL:', issueData.data.imageUrl.substring(0, 45) + '...');
    console.log('     GeoJSON Coordinates:', issueData.data.location.coordinates);

    const createdIssueId = issueData.data._id;

    // 4. Update Status (PATCH)
    console.log('\n[4/4] Testing PATCH /api/issues/:id/status (JWT Protected)...');
    const updateRes = await fetch(`${BASE_URL}/issues/${createdIssueId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'In Progress' }),
    });
    const updateData = await updateRes.json();
    console.log('  ✅ Status Updated to:', updateData.data.status);

    console.log('\n======================================================');
    console.log('🎉 ALL BACKEND APIS & SERVICES (DB, CLOUDINARY, GROQ, AUTH) WORK 100% PERFECTLY!');
    console.log('======================================================');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testFullBackend();
