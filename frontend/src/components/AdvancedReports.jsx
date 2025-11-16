import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AdvancedReports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [selectedTeam, setSelectedTeam] = useState("all");
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === "admin") {
      fetchAdvancedReport();
    }
  }, [user]);

  const fetchAdvancedReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append("startDate", dateRange.startDate);
      if (dateRange.endDate) params.append("endDate", dateRange.endDate);
      if (selectedTeam) params.append("team", selectedTeam);

      const response = await axios.get(
        `http://localhost:5000/api/reports/advanced?${params}`
      );
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching advanced report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/reports/export",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "queries-export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">
            You need admin privileges to view this page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading advanced reports...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Advanced Reports</h1>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Report Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="all">All Teams</option>
              <option value="support-team">Support Team</option>
              <option value="tech-team">Tech Team</option>
              <option value="billing-team">Billing Team</option>
            </select>
          </div>
        </div>
        <button
          onClick={fetchAdvancedReport}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>

      {reportData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Response Time Analysis */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Response Time Analysis</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Average Response Time:</span>
                <span className="font-medium">
                  {reportData.responseTimeAnalysis.avgResponseTime
                    ? Math.round(
                        reportData.responseTimeAnalysis.avgResponseTime /
                          (1000 * 60 * 60 * 24)
                      ) + " days"
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Minimum Response Time:</span>
                <span className="font-medium">
                  {reportData.responseTimeAnalysis.minResponseTime
                    ? Math.round(
                        reportData.responseTimeAnalysis.minResponseTime /
                          (1000 * 60 * 60 * 24)
                      ) + " days"
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Maximum Response Time:</span>
                <span className="font-medium">
                  {reportData.responseTimeAnalysis.maxResponseTime
                    ? Math.round(
                        reportData.responseTimeAnalysis.maxResponseTime /
                          (1000 * 60 * 60 * 24)
                      ) + " days"
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Team Performance */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Team Performance</h3>
            <div className="space-y-3">
              {reportData.teamPerformance.map((team) => (
                <div
                  key={team._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span className="capitalize">{team._id}</span>
                  <div className="text-right">
                    <div>Resolved: {team.resolvedCount}</div>
                    <div className="text-sm text-gray-600">
                      Avg:{" "}
                      {team.avgResolutionTime
                        ? Math.round(
                            team.avgResolutionTime / (1000 * 60 * 60 * 24)
                          )
                        : 0}{" "}
                      days
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Performance */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-medium mb-4">Agent Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Team
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total Assigned
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Resolved
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Resolution Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Avg Resolution Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.agentPerformance.map((agent) => (
                    <tr key={agent._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {agent.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize">
                        {agent.team}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {agent.totalAssigned}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {agent.resolved}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {agent.totalAssigned > 0
                          ? Math.round(
                              (agent.resolved / agent.totalAssigned) * 100
                            ) + "%"
                          : "0%"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {agent.avgResolutionTime
                          ? Math.round(
                              agent.avgResolutionTime / (1000 * 60 * 60 * 24)
                            ) + " days"
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Channel Effectiveness */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-medium mb-4">Channel Effectiveness</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportData.channelEffectiveness.map((channel) => (
                <div
                  key={channel._id}
                  className="border rounded-lg p-4 text-center"
                >
                  <h4 className="font-medium capitalize">{channel._id}</h4>
                  <p className="text-2xl font-bold text-blue-600 my-2">
                    {channel.total}
                  </p>
                  <p className="text-sm text-gray-600">
                    {channel.total > 0
                      ? Math.round((channel.resolved / channel.total) * 100) +
                        "% resolved"
                      : "No data"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedReports;
