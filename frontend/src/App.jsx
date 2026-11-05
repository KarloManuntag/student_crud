import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';
import SearchBar from './components/SearchBar';
import Notification from './components/Notification';
import { studentApi } from './api/studentApi';
import { RefreshCw } from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  // Fetch all students from backend
  const fetchStudents = async (showSuccessAlert = false) => {
    setIsLoading(true);
    try {
      const data = await studentApi.getAll();
      // Ensure data is an array
      const list = Array.isArray(data) ? data : [];
      setStudents(list);
      if (showSuccessAlert) {
        showNotification('Student list refreshed successfully.', 'info');
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      showNotification(
        `Unable to reach student backend API (${err.message}). Ensure Spring Boot backend is running on port 8080.`,
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const query = searchTerm.toLowerCase().trim();

    return students.filter((s) => {
      const fullName = `${s.firstname || ''} ${s.lastname || ''}`.toLowerCase();
      const course = (s.course || '').toLowerCase();
      const section = (s.section || '').toLowerCase();
      const id = String(s.id || '');

      return (
        fullName.includes(query) ||
        course.includes(query) ||
        section.includes(query) ||
        id.includes(query)
      );
    });
  }, [students, searchTerm]);

  // Handle Form Submission (Create or Update)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingStudent) {
        // UPDATE Existing
        await studentApi.update(editingStudent.id, formData);
        showNotification(
          `Student "${formData.firstname} ${formData.lastname}" updated successfully!`,
          'success'
        );
        setEditingStudent(null);
      } else {
        // CREATE New
        await studentApi.create(formData);
        showNotification(
          `Student "${formData.firstname} ${formData.lastname}" added successfully!`,
          'success'
        );
      }
      await fetchStudents();
    } catch (err) {
      console.error('Save failed:', err);
      showNotification(
        `Failed to save student: ${err.message}`,
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Click
  const handleEditClick = (student) => {
    setEditingStudent(student);
    // Smooth scroll to form on mobile devices
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  // Handle Delete Click (confirmed inline)
  const handleDeleteStudent = async (id) => {
    try {
      await studentApi.delete(id);
      showNotification(`Student #${id} deleted successfully.`, 'success');
      // If the deleted student was currently being edited, cancel edit
      if (editingStudent && editingStudent.id === id) {
        setEditingStudent(null);
      }
      await fetchStudents();
    } catch (err) {
      console.error('Delete failed:', err);
      showNotification(`Failed to delete student #${id}: ${err.message}`, 'error');
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <Navbar studentCount={students.length} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Notification Banner */}
        <Notification
          notification={notification}
          onDismiss={dismissNotification}
        />

        {/* 2-Column Responsive Layout (NO MODAL) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Card (Sticky on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <StudentForm
              editingStudent={editingStudent}
              onSubmit={handleFormSubmit}
              onCancelEdit={handleCancelEdit}
              isSubmitting={isSubmitting}
            />

            {/* Quick Context Tip */}
            <div className="mt-4 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
              <span className="font-bold">Connected Endpoint:</span>{' '}
              <code className="bg-white/80 px-1.5 py-0.5 rounded border border-indigo-200 font-mono text-[11px]">
                /manuntag/students
              </code>
              <p className="mt-1 text-indigo-700/80">
                All changes reflect directly on your Spring Boot PostgreSQL backend.
              </p>
            </div>
          </div>

          {/* Right Column: Search + Table View */}
          <div className="lg:col-span-7 space-y-4">
            {/* Table Controls (Search & Refresh) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onClear={() => setSearchTerm('')}
              />

              <button
                type="button"
                onClick={() => fetchStudents(true)}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                title="Refresh student list"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            {/* Search Match Results Status */}
            {searchTerm && (
              <div className="text-xs text-slate-500 font-medium px-1 flex items-center justify-between">
                <span>
                  Found <strong className="text-slate-800">{filteredStudents.length}</strong> matching "{searchTerm}"
                </span>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                >
                  Clear filter
                </button>
              </div>
            )}

            {/* Student Table with In-Row Delete Confirmation (NO MODAL) */}
            <StudentTable
              students={filteredStudents}
              isLoading={isLoading}
              editingStudentId={editingStudent ? editingStudent.id : null}
              onEdit={handleEditClick}
              onDelete={handleDeleteStudent}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          Student CRUD Management • Built with Vite, React, & Tailwind CSS
        </div>
      </footer>
    </div>
  );
}
