import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react';
import ConfirmModal from '../../components/admin/ConfirmModal';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([
    { _id: '1', title: 'Getting Started with Alice Proctor', author: 'Admin', status: 'published', created_at: new Date().toISOString(), views: 1250 },
    { _id: '2', title: 'Top 5 Anti-Cheat Mechanisms', author: 'System', status: 'draft', created_at: new Date(Date.now() - 86400000).toISOString(), views: 0 },
    { _id: '3', title: 'Future of Online Exams', author: 'Admin', status: 'published', created_at: new Date(Date.now() - 172800000).toISOString(), views: 3420 }
  ]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    // Ideally fetch from API
    filterBlogs();
  }, [blogs, searchQuery, statusFilter]);

  const filterBlogs = () => {
    let filtered = [...blogs];

    if (searchQuery) {
      filtered = filtered.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.author?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((blog) => blog.status === statusFilter);
    }

    setFilteredBlogs(filtered);
  };

  const handleAction = (blog, action) => {
    setSelectedBlog(blog);
    setActionType(action);
    if (action === 'delete') {
      setShowConfirmModal(true);
    } else {
      // Handle edit/view
      console.log(`Action: ${action}`, blog);
    }
  };

  const confirmAction = async () => {
    try {
      if (actionType === 'delete') {
        setBlogs(blogs.filter(b => b._id !== selectedBlog._id));
      }
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#e6edf3]">
              Blog Management
            </h1>
            <p className="text-[#8b949e] mt-1">
              Create, edit and manage blog posts
            </p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-[#2ea043] hover:bg-[#3fb950] text-white rounded-lg transition-all">
            <Plus className="w-4 h-4" />
            <span>Create Post</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-[#161b22] rounded-xl p-4 shadow-sm border border-[#30363d]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm focus:ring-1 focus:ring-[#2ea043] text-[#e6edf3] placeholder-[#8b949e]"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm focus:ring-1 focus:ring-[#2ea043] text-[#e6edf3]"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Blogs Table */}
        <div className="bg-[#161b22] rounded-xl shadow-sm border border-[#30363d] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0d1117] border-b border-[#30363d]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                {filteredBlogs.map((blog) => (
                  <motion.tr
                    key={blog._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-[#0d1117] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#e6edf3]">
                        {blog.title}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8b949e]">
                      {blog.author}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center space-x-1 ${
                          blog.status === 'published'
                            ? 'text-[#3fb950]'
                            : 'text-[#e3b341]'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            blog.status === 'published' ? 'bg-[#3fb950]' : 'bg-[#e3b341]'
                          }`}
                        />
                        <span className="text-sm font-medium capitalize">
                          {blog.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8b949e]">
                      {blog.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8b949e]">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleAction(blog, 'view')}
                          className="p-2 rounded-lg hover:bg-[#30363d] transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-[#8b949e]" />
                        </button>
                        <button
                          onClick={() => handleAction(blog, 'edit')}
                          className="p-2 rounded-lg hover:bg-[#30363d] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-[#3fb950]" />
                        </button>
                        <button
                          onClick={() => handleAction(blog, 'delete')}
                          className="p-2 rounded-lg hover:bg-[rgba(248,81,73,0.1)] transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-[#f85149]" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#8b949e]">No blogs found</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <ConfirmModal
          title={`Confirm ${actionType}`}
          message={`Are you sure you want to ${actionType} "${selectedBlog?.title}"?`}
          onConfirm={confirmAction}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </AdminLayout>
  );
};

export default BlogManagement;
