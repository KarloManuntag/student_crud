import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Notification({ notification, onDismiss }) {
  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';

  const bgStyles = isSuccess
    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
    : isError
    ? 'bg-rose-50 border-rose-200 text-rose-800'
    : 'bg-indigo-50 border-indigo-200 text-indigo-800';

  const Icon = isSuccess ? CheckCircle2 : isError ? AlertCircle : Info;

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all duration-200 shadow-xs mb-6 ${bgStyles}`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1 text-sm font-medium">
        {notification.message}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-md"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
