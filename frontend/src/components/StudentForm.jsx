import React, { useState, useEffect } from 'react';
import { UserPlus, Save, X, BookOpen, Users, User, AlertCircle, Loader2 } from 'lucide-react';

export default function StudentForm({
  editingStudent,
  onSubmit,
  onCancelEdit,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    course: '',
    section: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        firstname: editingStudent.firstname || '',
        lastname: editingStudent.lastname || '',
        course: editingStudent.course || '',
        section: editingStudent.section || '',
      });
      setErrors({});
    } else {
      setFormData({
        firstname: '',
        lastname: '',
        course: '',
        section: '',
      });
      setErrors({});
    }
  }, [editingStudent]);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!formData.course.trim()) newErrors.course = 'Course is required';
    if (!formData.section.trim()) newErrors.section = 'Section is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      course: formData.course.trim().toUpperCase(),
      section: formData.section.trim().toUpperCase(),
    });
  };

  const isEditing = Boolean(editingStudent);

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs overflow-hidden ${
        isEditing
          ? 'border-amber-400 ring-2 ring-amber-300/40'
          : 'border-slate-200'
      }`}
    >
      {/* Header */}
      <div
        className={`px-6 py-4.5 border-b flex items-center justify-between ${
          isEditing ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-50/70 border-slate-100'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-lg ${
              isEditing ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white'
            }`}
          >
            {isEditing ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isEditing ? `Edit Student #${editingStudent.id}` : 'Add New Student'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {isEditing
                ? 'Update student details below'
                : 'Fill in the information to enroll a student'}
            </p>
          </div>
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
        )}
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              First Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="e.g. John"
                disabled={isSubmitting}
                className={`w-full pl-9 pr-3 py-2 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.firstname
                    ? 'border-rose-400 focus:ring-rose-500/30'
                    : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors.firstname && (
              <p className="text-rose-600 text-xs mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {errors.firstname}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Last Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="e.g. Doe"
                disabled={isSubmitting}
                className={`w-full pl-9 pr-3 py-2 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.lastname
                    ? 'border-rose-400 focus:ring-rose-500/30'
                    : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors.lastname && (
              <p className="text-rose-600 text-xs mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {errors.lastname}
              </p>
            )}
          </div>
        </div>

        {/* Course & Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Course / Degree <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g. BSIT"
                disabled={isSubmitting}
                className={`w-full pl-9 pr-3 py-2 bg-slate-50/50 border rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.course
                    ? 'border-rose-400 focus:ring-rose-500/30'
                    : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors.course && (
              <p className="text-rose-600 text-xs mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {errors.course}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Section <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Users className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                placeholder="e.g. 3A"
                disabled={isSubmitting}
                className={`w-full pl-9 pr-3 py-2 bg-slate-50/50 border rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.section
                    ? 'border-rose-400 focus:ring-rose-500/30'
                    : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors.section && (
              <p className="text-rose-600 text-xs mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {errors.section}
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-end gap-3">
          {isEditing && (
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              Cancel Edit
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
              isEditing
                ? 'bg-amber-600 hover:bg-amber-700 focus:ring-2 focus:ring-amber-500/50'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500/50'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isEditing ? 'Saving Changes...' : 'Adding Student...'}</span>
              </>
            ) : isEditing ? (
              <>
                <Save className="w-4 h-4" />
                <span>Update Student</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Add Student</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
