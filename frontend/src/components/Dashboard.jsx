import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentQueries, setRecentQueries] = useState([]);
  const [newQuery, setNewQuery] = useState({
    message: "",
    channel: "email",
    customerEmail: "",
    customerName: "",
  });

  useEffect(() => {
    fetchStats();
    fetchRecentQueries();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchRecentQueries = async () => {
    try {
      const response = await axios.get(`${API_URL}/queries`);
      setRecentQueries(response.data.slice(0, 5)); // Get first 5
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/queries`, newQuery);
      setNewQuery({
        message: "",
        channel: "email",
        customerEmail: "",
        customerName: "",
      });
      fetchStats();
      fetchRecentQueries();
    } catch (error) {
      console.error("Error submitting query:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-purple-100 text-purple-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📨</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Queries
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.totalQueries || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⏱️</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg Response Time
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.avgResponseTime
                      ? Math.round(stats.avgResponseTime / (1000 * 60 * 60)) +
                        "h"
                      : "N/A"}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🔴</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.byStatus?.find((s) => s._id === "new")?.count || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Resolved
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.byStatus?.find((s) => s._id === "resolved")
                      ?.count || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Query Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Submit New Query
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={newQuery.customerName}
                  onChange={(e) =>
                    setNewQuery({ ...newQuery, customerName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer Email
                </label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={newQuery.customerEmail}
                  onChange={(e) =>
                    setNewQuery({ ...newQuery, customerEmail: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Channel
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={newQuery.channel}
                  onChange={(e) =>
                    setNewQuery({ ...newQuery, channel: e.target.value })
                  }
                >
                  <option value="email">Email</option>
                  <option value="social">Social Media</option>
                  <option value="chat">Chat</option>
                  <option value="community">Community</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  required
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={newQuery.message}
                  onChange={(e) =>
                    setNewQuery({ ...newQuery, message: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Submit Query
              </button>
            </form>
          </div>
        </div>

        {/* Recent Queries */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Queries
              </h3>
              <Link
                to="/inbox"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentQueries.map((query) => (
                <div
                  key={query._id}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900 truncate">
                      {query.customerName || "Anonymous"}
                    </span>
                    <div className="flex space-x-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                          query.priority
                        )}`}
                      >
                        {query.priority}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          query.status
                        )}`}
                      >
                        {query.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {query.message}
                  </p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>{query.channel}</span>
                    <span>
                      {new Date(query.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
