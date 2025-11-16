import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  if (!analytics)
    return (
      <div className="flex justify-center items-center h-64">
        Loading analytics...
      </div>
    );

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  const ChartBox = ({ title, children }) => (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Queries"
          value={analytics.totalQueries}
          icon="📨"
          color="bg-blue-100"
        />
        <StatCard
          title="Avg Response Time"
          value={
            analytics.avgResponseTime
              ? Math.round(analytics.avgResponseTime / (1000 * 60 * 60)) +
                " hours"
              : "N/A"
          }
          icon="⏱️"
          color="bg-green-100"
        />
        <StatCard
          title="Pending Queries"
          value={analytics.byStatus?.find((s) => s._id === "new")?.count || 0}
          icon="🔴"
          color="bg-red-100"
        />
        <StatCard
          title="Resolved Today"
          value={
            analytics.byStatus?.find((s) => s._id === "resolved")?.count || 0
          }
          icon="✅"
          color="bg-green-100"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category */}
        <ChartBox title="Queries by Category">
          <div className="space-y-3">
            {analytics.byCategory?.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {item._id}
                </span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (item.count / analytics.totalQueries) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartBox>

        {/* By Status */}
        <ChartBox title="Queries by Status">
          <div className="space-y-3">
            {analytics.byStatus?.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {item._id}
                </span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (item.count / analytics.totalQueries) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartBox>

        {/* By Priority */}
        <ChartBox title="Queries by Priority">
          <div className="space-y-3">
            {analytics.byPriority?.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {item._id}
                </span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className={`h-2 rounded-full ${
                        item._id === "urgent"
                          ? "bg-red-600"
                          : item._id === "high"
                          ? "bg-orange-600"
                          : item._id === "medium"
                          ? "bg-yellow-600"
                          : "bg-green-600"
                      }`}
                      style={{
                        width: `${
                          (item.count / analytics.totalQueries) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartBox>

        {/* By Channel */}
        <ChartBox title="Queries by Channel">
          <div className="space-y-3">
            {analytics.byChannel?.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {item._id}
                </span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (item.count / analytics.totalQueries) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartBox>
      </div>
    </div>
  );
};

export default Analytics;
