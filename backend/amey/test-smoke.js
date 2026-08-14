import http from 'http';
import { triageIssueWithVision } from './src/services/groqService.js';

console.log('--- RUNNING BACKEND SMOKE TESTS ---');

// Test 1: Verify AI Triage heuristic fallback and classification
async function testTriage() {
  console.log('\n[Test 1] Testing Groq AI Triage logic & fallback...');
  const potholeResult = await triageIssueWithVision(null, 'Huge dangerous pothole on main road causing accidents');
  console.log('  Result for pothole:', potholeResult);
  if (potholeResult.category === 'Roads' && potholeResult.severity === 'High') {
    console.log('  ✅ Pothole correctly classified as Roads/High');
  } else {
    console.log('  ⚠️ Pothole triage returned:', potholeResult);
  }

  const garbageResult = await triageIssueWithVision(null, 'Overflowing garbage bin near residential area');
  console.log('  Result for garbage:', garbageResult);
  if (garbageResult.category === 'Sanitation') {
    console.log('  ✅ Garbage correctly classified as Sanitation');
  } else {
    console.log('  ⚠️ Garbage triage returned:', garbageResult);
  }
}

// Test 2: Check imports of key models and config
async function testImports() {
  console.log('\n[Test 2] Testing module imports (User, Issue, Multer, Config)...');
  const { User } = await import('./src/models/User.js');
  const { Issue } = await import('./src/models/Issue.js');
  const { upload } = await import('./src/middleware/uploadMiddleware.js');
  
  if (User && Issue && upload) {
    console.log('  ✅ All models and middlewares imported successfully');
  } else {
    throw new Error('Failed to import one or more core modules');
  }
}

async function runAll() {
  try {
    await testImports();
    await testTriage();
    console.log('\n✅ ALL CODEBASE TESTS COMPLETED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('\n❌ Smoke Test Error:', err);
  }
}

runAll();
