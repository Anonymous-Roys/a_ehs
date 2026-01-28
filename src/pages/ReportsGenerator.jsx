import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Mail, Eye, Plus, Calendar } from "lucide-react";

const ReportsGeneratorPage = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      name: "January 2025 Performance Report",
      type: "Monthly",
      generated: "Jan 31, 2025",
      period: "Jan 1 - Jan 31, 2025",
      metrics: {
        solarGenerated: 314.8,
        gridImported: 45.2,
        totalSavings: 156.43,
        efficiency: 94.5,
      },
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "Q4 2024 Annual Report",
      type: "Quarterly",
      generated: "Jan 5, 2025",
      period: "Oct 1 - Dec 31, 2024",
      metrics: {
        solarGenerated: 945.3,
        gridImported: 156.8,
        totalSavings: 468.75,
        efficiency: 93.2,
      },
      size: "5.8 MB",
    },
  ]);

  const [reportForm, setReportForm] = useState({
    reportType: "monthly",
    startDate: "",
    endDate: "",
    includeMetrics: true,
    includeCharts: true,
    includeRecommendations: true,
    email: "",
  });

  const [showNewReport, setShowNewReport] = useState(false);

  const handleGenerateReport = () => {
    if (reportForm.startDate && reportForm.endDate) {
      const newReport = {
        id: Math.max(...reports.map((r) => r.id), 0) + 1,
        name: `${reportForm.reportType.charAt(0).toUpperCase() + reportForm.reportType.slice(1)} Report - ${reportForm.startDate}`,
        type: reportForm.reportType.charAt(0).toUpperCase() + reportForm.reportType.slice(1),
        generated: new Date().toLocaleDateString(),
        period: `${reportForm.startDate} - ${reportForm.endDate}`,
        metrics: {
          solarGenerated: Math.random() * 500 + 200,
          gridImported: Math.random() * 100 + 30,
          totalSavings: Math.random() * 300 + 100,
          efficiency: Math.random() * 10 + 85,
        },
        size: (Math.random() * 5 + 1).toFixed(1) + " MB",
      };

      setReports([newReport, ...reports]);
      setReportForm({
        reportType: "monthly",
        startDate: "",
        endDate: "",
        includeMetrics: true,
        includeCharts: true,
        includeRecommendations: true,
        email: "",
      });
      setShowNewReport(false);
    }
  };

  const deleteReport = (id) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Reports Generator
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Generate and manage custom energy reports
              </p>
            </div>
            <motion.button
              onClick={() => setShowNewReport(!showNewReport)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              Generate Report
            </motion.button>
          </div>
        </motion.div>

        {/* Generate Report Form */}
        {showNewReport && (
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">
              Create New Report
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Report Type
                </label>
                <select
                  value={reportForm.reportType}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, reportType: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="daily">Daily Report</option>
                  <option value="weekly">Weekly Report</option>
                  <option value="monthly">Monthly Report</option>
                  <option value="quarterly">Quarterly Report</option>
                  <option value="annual">Annual Report</option>
                  <option value="custom">Custom Period</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={reportForm.email}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, email: e.target.value })
                  }
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={reportForm.startDate}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={reportForm.endDate}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, endDate: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Options */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border dark:border-slate-600">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Report Contents
              </h4>
              <div className="space-y-3">
                {[
                  { key: "includeMetrics", label: "Include Performance Metrics" },
                  { key: "includeCharts", label: "Include Charts & Graphs" },
                  {
                    key: "includeRecommendations",
                    label: "Include Recommendations",
                  },
                ].map((option) => (
                  <label
                    key={option.key}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={reportForm[option.key]}
                      onChange={(e) =>
                        setReportForm({
                          ...reportForm,
                          [option.key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleGenerateReport}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition flex items-center gap-2"
              >
                <FileText size={18} />
                Generate Report
              </button>
              <button
                onClick={() => setShowNewReport(false)}
                className="px-6 py-2 bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Reports List */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {reports.map((report, idx) => (
            <motion.div
              key={report.id}
              className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-lg overflow-hidden hover:shadow-xl transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <motion.div
                      className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FileText
                        size={24}
                        className="text-blue-500 dark:text-blue-400"
                      />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {report.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium">
                          {report.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {report.period}
                        </span>
                        <span>Generated: {report.generated}</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-lg transition"
                      whileHover={{ scale: 1.1 }}
                      title="View Report"
                    >
                      <Eye size={20} />
                    </motion.button>
                    <motion.button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-lg transition"
                      whileHover={{ scale: 1.1 }}
                      title="Download"
                    >
                      <Download size={20} />
                    </motion.button>
                    <motion.button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-lg transition"
                      whileHover={{ scale: 1.1 }}
                      title="Email Report"
                    >
                      <Mail size={20} />
                    </motion.button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-1">
                      Solar Generated
                    </p>
                    <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                      {report.metrics.solarGenerated.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      kWh
                    </p>
                  </motion.div>

                  <motion.div
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">
                      Grid Imported
                    </p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {report.metrics.gridImported.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      kWh
                    </p>
                  </motion.div>

                  <motion.div
                    className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-xs text-green-700 dark:text-green-300 mb-1">
                      Total Savings
                    </p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      ${report.metrics.totalSavings.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      USD
                    </p>
                  </motion.div>

                  <motion.div
                    className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-xs text-purple-700 dark:text-purple-300 mb-1">
                      Efficiency
                    </p>
                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {report.metrics.efficiency.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Rating
                    </p>
                  </motion.div>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last updated: {report.generated}
                </p>
                <motion.button
                  onClick={() => deleteReport(report.id)}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  Delete Report
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Report Templates */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border dark:border-slate-700 shadow-lg p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Quick Report Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { name: "This Month", icon: "📊" },
              { name: "Last Quarter", icon: "📈" },
              { name: "Full Year", icon: "📅" },
              { name: "Custom Range", icon: "🎯" },
            ].map((template, idx) => (
              <motion.button
                key={idx}
                className="p-4 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 hover:shadow-lg transition text-center"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-2xl mb-2">{template.icon}</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {template.name}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ReportsGeneratorPage;
