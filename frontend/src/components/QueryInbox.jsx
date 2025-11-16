import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const QueryInbox = () => {
  const [queries, setQueries] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
  });

  useEffect(() => {
    fetchQueries();
  }, [filters]);

  const fetchQueries = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`${API_URL}/queries?${params}`);
      setQueries(response.data);
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  const updateQuery = async (id, updates) => {
    try {
      await axios.put(`${API_URL}/queries/${id}`, updates);
      fetchQueries();
    } catch (error) {
      console.error("Error updating query:", error);
    }
  };

  const deleteQuery = async (id) => {
    if (window.confirm("Are you sure you want to delete this query?")) {
      try {
        await axios.delete(`${API_URL}/queries/${id}`);
        fetchQueries();
      } catch (error) {
        console.error("Error deleting query:", error);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "complaint":
        return "bg-red-50 text-red-700 border-red-200";
      case "request":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "feedback":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Query Inbox</h1>
        <div className="flex space-x-4">
          {/* Filters */}
          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">All Categories</option>
            <option value="question">Question</option>
            <option value="request">Request</option>
            <option value="complaint">Complaint</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {queries.map((query) => (
            <li key={query._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {query.customerName || "Anonymous"} (
                      {query.customerEmail || "No email"})
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getCategoryColor(
                          query.category
                        )}`}
                      >
                        {query.category}
                      </p>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex space-x-2">
                    <p
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getPriorityColor(
                        query.priority
                      )}`}
                    >
                      {query.priority}
                    </p>
                    <p
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(
                        query.status
                      )}`}
                    >
                      {query.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {query.message}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Via {query.channel} •{" "}
                      {new Date(query.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-4">
                  <select
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                    value={query.status}
                    onChange={(e) =>
                      updateQuery(query._id, { status: e.target.value })
                    }
                  >
                    <option value="new">New</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  <select
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                    value={query.assignedTo || ""}
                    onChange={(e) =>
                      updateQuery(query._id, { assignedTo: e.target.value })
                    }
                  >
                    <option value="">Unassigned</option>
                    <option value="support-team">Support Team</option>
                    <option value="tech-team">Tech Team</option>
                    <option value="billing-team">Billing Team</option>
                  </select>

                  <button
                    onClick={() => deleteQuery(query._id)}
                    className="text-xs text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QueryInbox;
