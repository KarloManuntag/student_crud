import React, { useState } from 'react';
import { Edit2, Trash2, Check, X, AlertTriangle, UserCheck } from 'lucide-react';

export default function StudentTable({
  students,
  isLoading,
  editingStudentId,
  onEdit,
  onDelete,
}) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleConfirmDelete = async (id) => {
    setIsDeletingId(id);
    try {
      await onDelete(id);
      setConfirmDeleteId(null);
    } finally {
      setIsDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <UserCheck className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No students found</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
          No records match your query, or no students have been registered yet. Use the form to enroll a new student.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 pl-6">ID</th>
              <th className="py-3.5 px-4">Student Name</th>
              <th className="py-3.5 px-4">Course</th>
              <th className="py-3.5 px-4">Section</th>
              <th className="py-3.5 px-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {students.map((student) => {
              const isEditing = editingStudentId === student.id;
              const isConfirming = confirmDeleteId === student.id;
              const isDeleting = isDeletingId === student.id;

              return (
                <tr
                  key={student.id}
                  className={`transition-colors ${
                    isEditing
                      ? 'bg-amber-50/60'
                      : isConfirming
                      ? 'bg-rose-50/50'
                      : 'hover:bg-slate-50/70'
                  }`}
                >
                  {/* ID */}
                  <td className="py-3.5 px-4 pl-6 font-mono text-xs text-slate-500 font-semibold">
                    #{student.id}
                  </td>

                  {/* Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">
                      {student.firstname} {student.lastname}
                    </div>
                  </td>

                  {/* Course Badge */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      {student.course}
                    </span>
                  </td>

                  {/* Section Badge */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {student.section}
                    </span>
                  </td>

                  {/* Actions - 100% Non-Modal Inline Controls */}
                  <td className="py-3.5 px-4 pr-6 text-right">
                    {isConfirming ? (
                      /* Inline Row Confirmation - NO MODAL */
                      <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-rose-200 shadow-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="text-xs font-semibold text-rose-700 whitespace-nowrap">
                          Confirm delete?
                        </span>
                        <button
                          type="button"
                          onClick={() => handleConfirmDelete(student.id)}
                          disabled={isDeleting}
                          className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isDeleting ? 'Deleting...' : 'Yes'}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelDelete}
                          disabled={isDeleting}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      /* Standard Action Buttons */
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit(student)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            isEditing
                              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                              : 'text-slate-600 bg-white border-slate-200 hover:text-indigo-600 hover:bg-indigo-50/50 hover:border-indigo-200'
                          }`}
                          title="Edit Student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(student.id)}
                          className="p-1.5 text-slate-600 bg-white border border-slate-200 hover:text-rose-600 hover:bg-rose-50/50 hover:border-rose-200 rounded-lg transition-all cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
