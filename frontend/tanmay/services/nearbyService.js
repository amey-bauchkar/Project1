import { getDeviceId, recordUpvotedIssue, hasUpvotedIssue } from '../utils/device';
import { extractCoordinates, getIssueDistance, formatDistance, sortIssuesByDistance } from '../utils/distance';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Realistic Ranchi, Jharkhand civic issues dataset for offline/mock fallback
const MOCK_NEARBY_ISSUES = [
  {
    _id: 'mock-near-1',
    description: 'Hazardous deep pothole on Main Road causing dangerous skidding for two-wheelers during rain.',
    category: 'Roads',
    severity: 'High',
    status: 'Pending',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    location: {
      type: 'Point',
      coordinates: [85.3240, 23.3700] // Albert Ekka Chowk, Ranchi
    },
    upvotes: 14,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    _id: 'mock-near-2',
    description: 'Burst water supply pipeline wasting drinking water and flooding residential pedestrian walkway.',
    category: 'Water',
    severity: 'High',
    status: 'In Progress',
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
    location: {
      type: 'Point',
      coordinates: [85.3280, 23.3680] // Near Ranchi University
    },
    upvotes: 9,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    _id: 'mock-near-3',
    description: 'Uncleaned municipal garbage container overflowing with stray animals scattering waste.',
    category: 'Sanitation',
    severity: 'Medium',
    status: 'Pending',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    location: {
      type: 'Point',
      coordinates: [85.3190, 23.3720] // Kutchery Road
    },
    upvotes: 6,
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString()
  },
  {
    _id: 'mock-near-4',
    description: 'Broken streetlight assembly dangling dangerously from pole over crowded market street.',
    category: 'Electricity',
    severity: 'High',
    status: 'Pending',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    location: {
      type: 'Point',
      coordinates: [85.3310, 23.3650] // Kantatoli Chowk
    },
    upvotes: 11,
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    _id: 'mock-near-5',
    description: 'Exposed high-voltage transformer wiring without safety fencing near local primary school.',
    category: 'Electricity',
    severity: 'High',
    status: 'Pending',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
    location: {
      type: 'Point',
      coordinates: [85.3210, 23.3630] // Doranda
    },
    upvotes: 22,
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString()
  },
  {
    _id: 'mock-near-6',
    description: 'Open manhole on side road without any barricade or caution indicator.',
    category: 'Roads',
    severity: 'High',
    status: 'Pending',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80',
    location: {
      type: 'Point',
      coordinates: [85.3265, 23.3715] // Circular Road
    },
    upvotes: 18,
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  }
];

/**
 * Fetch issues near a specific latitude and longitude
 *
 * @param {object} params
 * @param {number} params.lat Latitude
 * @param {number} params.lng Longitude
 * @param {number} [params.radius=2000] Radius in meters
 * @param {string} [params.category] Optional category filter
 * @returns {Promise<Array>} List of nearby issues with distance calculations
 */
export const fetchNearbyIssues = async ({ lat, lng, radius = 2000, category = null }) => {
  const userCoords = (lat !== undefined && lng !== undefined) ? [lat, lng] : null;

  // 1. Try hitting the dedicated backend endpoint if coordinates are present
  if (userCoords) {
    try {
      let url = `${API_BASE_URL}/api/issues/nearby?lat=${lat}&lng=${lng}&radius=${radius}`;
      if (category && category !== 'All') {
        url += `&category=${encodeURIComponent(category)}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        const rawData = json.data || json.issues || json;
        if (Array.isArray(rawData)) {
          return sortIssuesByDistance(rawData, userCoords);
        }
      }
    } catch (err) {
      console.info('Backend /api/issues/nearby not reachable, attempting general /api/issues...', err.message);
    }
  }

  // 2. Fallback: Try general GET /api/issues and compute proximity on client
  try {
    const fallbackResponse = await fetch(`${API_BASE_URL}/api/issues`);
    if (fallbackResponse.ok) {
      const json = await fallbackResponse.json();
      const allIssues = json.data || json.issues || json;
      if (Array.isArray(allIssues) && allIssues.length > 0) {
        let filtered = allIssues.filter((item) => item.status !== 'Resolved');
        if (category && category !== 'All') {
          filtered = filtered.filter((item) => item.category?.toLowerCase() === category.toLowerCase());
        }

        if (userCoords) {
          const withDist = sortIssuesByDistance(filtered, userCoords);
          // Return those within radius or top 10 closest
          const withinRadius = withDist.filter((item) => item.distanceMeters <= radius);
          return withinRadius.length > 0 ? withinRadius : withDist.slice(0, 8);
        }
        return filtered;
      }
    }
  } catch (err) {
    console.info('Backend /api/issues not reachable, using realistic offline mock dataset.', err.message);
  }

  // 3. Realistic Demo Fallback Dataset
  // Dynamically place mock issues around user coordinates if GPS acquired so distances look natural
  let mockList = MOCK_NEARBY_ISSUES.map((item, idx) => {
    let itemCoords = item.location.coordinates;
    if (userCoords) {
      // Offset slightly around user coordinates (~100m to 1.2km)
      const offsets = [
        [0.0015, 0.0012],
        [-0.0021, 0.0018],
        [0.0008, -0.0025],
        [-0.0032, -0.0014],
        [0.0041, 0.0029],
        [-0.0010, 0.0035],
      ];
      const [latOffset, lngOffset] = offsets[idx % offsets.length];
      itemCoords = [userCoords[1] + lngOffset, userCoords[0] + latOffset];
    }

    const modified = {
      ...item,
      location: {
        type: 'Point',
        coordinates: itemCoords
      }
    };

    return modified;
  });

  if (category && category !== 'All') {
    mockList = mockList.filter((item) => item.category?.toLowerCase() === category.toLowerCase());
  }

  return sortIssuesByDistance(mockList, userCoords);
};

/**
 * Upvote an issue with backend sync and persistent local state
 *
 * @param {string} issueId ID of the issue to upvote
 * @returns {Promise<{ success: boolean, upvotes: number }>}
 */
export const upvoteIssue = async (issueId) => {
  const voterId = getDeviceId();

  // Optimistically record vote in local storage
  recordUpvotedIssue(issueId);

  try {
    const response = await fetch(`${API_BASE_URL}/api/issues/${issueId}/upvote`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ voterId })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        upvotes: data.data?.upvotes || data.upvotes
      };
    }
  } catch (err) {
    console.info('Backend upvote endpoint offline, handled optimistically:', err.message);
  }

  // Graceful fallback for offline demo
  return {
    success: true,
    optimistic: true
  };
};
