import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Issue } from '../models/Issue.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedDemo = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // Clean existing data
    await User.deleteMany({});
    await Issue.deleteMany({});
    console.log('Cleared existing users and issues.');

    // ─── Create Users ──────────────────────────────────────────────
    const admin = await User.create({
      email: 'admin@jharkhand.gov.in',
      password: 'Admin@123',
      role: 'admin',
      name: 'Municipal Admin',
    });
    console.log(`Admin created: ${admin.email}`);

    const worker1 = await User.create({
      email: 'ravi.kumar@jharkhand.gov.in',
      password: 'Worker@123',
      role: 'worker',
      name: 'Ravi Kumar',
      department: 'Roads & Infrastructure',
    });

    const worker2 = await User.create({
      email: 'priya.singh@jharkhand.gov.in',
      password: 'Worker@123',
      role: 'worker',
      name: 'Priya Singh',
      department: 'Water Supply',
    });

    const worker3 = await User.create({
      email: 'amit.verma@jharkhand.gov.in',
      password: 'Worker@123',
      role: 'worker',
      name: 'Amit Verma',
      department: 'Sanitation & Waste',
    });

    console.log(`Workers created: ${worker1.name}, ${worker2.name}, ${worker3.name}`);

    // ─── Create Realistic Issues ───────────────────────────────────
    const issues = [
      {
        trackingId: 'JH-20260815-00001',
        description: 'Large pothole on Main Road near Ranchi Railway Station causing vehicle damage. Multiple complaints from commuters. Immediate repair needed before monsoon worsens.',
        imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60',
        location: { type: 'Point', coordinates: [85.3096, 23.3441] },
        category: 'Roads',
        severity: 'High',
        status: 'In Progress',
        department: 'Roads & Infrastructure',
        aiSummary: 'Critical road surface damage near major transportation hub requiring immediate repair.',
        aiConfidence: 0.92,
        upvotes: 15,
        assignedTo: worker1._id,
        assignedAt: new Date(Date.now() - 86400000),
      },
      {
        trackingId: 'JH-20260815-00002',
        description: 'Overflowing garbage dump at Doranda Market creating severe health hazard. Foul smell affecting nearby residential areas and shops.',
        imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=60',
        location: { type: 'Point', coordinates: [85.3211, 23.3375] },
        category: 'Sanitation',
        severity: 'High',
        status: 'Pending',
        department: 'Sanitation & Waste',
        aiSummary: 'Overflowing waste collection point at commercial area posing public health risk.',
        aiConfidence: 0.88,
        upvotes: 23,
      },
      {
        trackingId: 'JH-20260815-00003',
        description: 'Broken water pipeline at Morabadi Ground sector flooding the street. Clean water wasting continuously for past 3 days.',
        imageUrl: 'https://images.unsplash.com/photo-1542010589005-d1eacc3918f2?w=600&auto=format&fit=crop&q=60',
        location: { type: 'Point', coordinates: [85.3385, 23.3871] },
        category: 'Water',
        severity: 'High',
        status: 'In Progress',
        department: 'Water Supply',
        aiSummary: 'Major water pipeline breach causing continuous water loss and street flooding.',
        aiConfidence: 0.95,
        upvotes: 31,
        assignedTo: worker2._id,
        assignedAt: new Date(Date.now() - 172800000),
      },
      {
        trackingId: 'JH-20260815-00004',
        description: 'Non-functional street lights on Kanke Road near Birsa Agricultural University. Entire stretch of 200m is completely dark after sunset, creating safety concerns.',
        imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=60',
        location: { type: 'Point', coordinates: [85.3188, 23.4124] },
        category: 'Electricity',
        severity: 'Medium',
        status: 'Resolved',
        department: 'Electricity Board',
        aiSummary: 'Multiple non-functional street lights creating pedestrian safety hazard near educational institution.',
        aiConfidence: 0.85,
        upvotes: 8,
        assignedTo: worker1._id,
        assignedAt: new Date(Date.now() - 604800000),
        resolvedAt: new Date(Date.now() - 259200000),
        resolutionNotes: 'Replaced 4 faulty sodium vapor lamps and repaired wiring connection. All lights operational.',
      },
      {
        trackingId: 'JH-20260815-00005',
        description: 'Open sewer drain without concrete cover near Harmu Housing Colony school. Children at risk during school hours.',
        imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=60',
        location: { type: 'Point', coordinates: [85.3092, 23.3512] },
        category: 'Sanitation',
        severity: 'High',
        status: 'Pending',
        department: 'Sanitation & Waste',
        aiSummary: 'Uncovered sewer drain near school zone posing child safety hazard.',
        aiConfidence: 0.91,
        upvotes: 42,
      },
      {
        trackingId: 'JH-20260815-00006',
        description: 'Dangerously exposed electrical wires hanging low near Lalpur Chowk. Risk of electrocution during rain. Immediate attention needed.',
        imageUrl: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=600&auto=format&fit=crop&q=60',
        location: { type: 'Point', coordinates: [85.3240, 23.3690] },
        category: 'Electricity',
        severity: 'High',
        status: 'In Progress',
        department: 'Electricity Board',
        aiSummary: 'Low-hanging exposed electrical cables at busy intersection creating electrocution risk.',
        aiConfidence: 0.94,
        upvotes: 56,
        assignedTo: worker1._id,
        assignedAt: new Date(Date.now() - 43200000),
      },
      {
        trackingId: 'JH-20260815-00007',
        description: 'Water logging on Circular Road due to blocked drainage. Vehicles unable to pass. Water level rising with each rain.',
        imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=60',
        location: { type: 'Point', coordinates: [85.3150, 23.3550] },
        category: 'Water',
        severity: 'Medium',
        status: 'Pending',
        department: 'Water Supply',
        aiSummary: 'Chronic water logging due to blocked storm drains affecting major road.',
        aiConfidence: 0.82,
        upvotes: 19,
      },
      {
        trackingId: 'JH-20260815-00008',
        description: 'Cracked and uneven footpath on MG Road making it inaccessible for elderly and disabled persons. Tiles broken and missing.',
        imageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&auto=format&fit=crop&q=60',
        location: { type: 'Point', coordinates: [85.3350, 23.3600] },
        category: 'Roads',
        severity: 'Medium',
        status: 'Resolved',
        department: 'Roads & Infrastructure',
        aiSummary: 'Deteriorated pedestrian footpath requiring accessibility repairs on major commercial road.',
        aiConfidence: 0.79,
        upvotes: 7,
        assignedTo: worker1._id,
        assignedAt: new Date(Date.now() - 1209600000),
        resolvedAt: new Date(Date.now() - 604800000),
        resolutionNotes: 'Replaced broken tiles on 150m stretch. Added tactile paving for visually impaired.',
      },
    ];

    const createdIssues = await Issue.insertMany(issues);
    console.log(`Created ${createdIssues.length} demo issues.`);

    console.log('\n====================================================');
    console.log('  Demo Data Seeded Successfully!');
    console.log('====================================================');
    console.log('  Admin Login:');
    console.log('    Email:    admin@jharkhand.gov.in');
    console.log('    Password: Admin@123');
    console.log('');
    console.log('  Worker Logins:');
    console.log('    ravi.kumar@jharkhand.gov.in / Worker@123');
    console.log('    priya.singh@jharkhand.gov.in / Worker@123');
    console.log('    amit.verma@jharkhand.gov.in / Worker@123');
    console.log('====================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedDemo();
