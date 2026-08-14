import React, { useState } from 'react';
import useIssues from '../hooks/useIssues';
import KanbanBoard from './KanbanBoard';
import MapView from './MapView';
import IssueModal from './IssueModal';

export const AdminDashboard = () => {
  const { issues, loading, error, refetch, updateIssueStatus } = useIssues();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('both'); // 'kanban', 'map', or 'both'
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCardClick = (issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedIssue(null);
    setIsModalOpen(false);
  };

  // Filter issues by category
  const filteredIssues = issues.filter((issue) => {
    if (selectedCategory === 'All') return true;
    return issue.category === selectedCategory;
  });

  // Calculate statistics
  const pendingCount = issues.filter((i) => (i.status || 'Pending') === 'Pending').length;
  const inProgressCount = issues.filter((i) => i.status === 'In Progress').length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-8">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Jharkhand Civic Admin Dashboard
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Municipal Issue Triage, Geographic Monitoring & Resolution Workflow
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs transition-all"
            >
              <svg
                className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : 'text-slate-500'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Reports</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{issues.length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 border-l-4 border-l-amber-500">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{pendingCount}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 border-l-4 border-l-blue-500">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">In Progress</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{inProgressCount}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 border-l-4 border-l-emerald-500">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Resolved</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{resolvedCount}</div>
          </div>
        </div>

        {/* View Controls & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          {/* View Mode Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'both'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'kanban'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'map'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Map
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2 font-medium"
            >
              <option value="All">All Categories</option>
              <option value="Roads">Roads</option>
              <option value="Water">Water</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Electricity">Electricity</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        {loading && issues.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-slate-400">
            <svg className="animate-spin h-8 w-8 text-emerald-500 mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <p className="text-sm font-medium">Loading civic issues...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Split View */}
            {activeTab === 'both' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7">
                  <KanbanBoard issues={filteredIssues} onCardClick={handleCardClick} />
                </div>
                <div className="lg:col-span-5 sticky top-6">
                  <MapView issues={filteredIssues} onMarkerClick={handleCardClick} />
                </div>
              </div>
            )}

            {/* Kanban Only */}
            {activeTab === 'kanban' && (
              <KanbanBoard issues={filteredIssues} onCardClick={handleCardClick} />
            )}

            {/* Map Only */}
            {activeTab === 'map' && (
              <MapView issues={filteredIssues} onMarkerClick={handleCardClick} />
            )}
          </div>
        )}
      </div>

      {/* Detail & Status Modal */}
      <IssueModal
        issue={selectedIssue}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdateStatus={updateIssueStatus}
      />
    </div>
  );
};

export default AdminDashboard;

