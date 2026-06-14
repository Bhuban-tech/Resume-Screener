/**
 * Toast.jsx
 *
 * Application-wide notification toasts.
 * Reads from the Zustand resumeStore.toasts array.
 * Toasts are auto-dismissed by the store after their configured duration.
 *
 * Usage: Mount <ToastContainer /> once in App.jsx.
 *        Trigger toasts from anywhere: toast.success('Done!') / toast.error('...')
 */
import { useResumeStore } from '../../stores/resumeStore.js';

const TYPE_STYLES = {
  success: {
    border: 'border-emerald-500/30',
    bg:     'bg-emerald-500/10',
    text:   'text-emerald-400',
    icon:   '✓',
  },
  error: {
    border: 'border-[#ff5f57]/30',
    bg:     'bg-[#ff5f57]/10',
    text:   'text-[#ff5f57]',
    icon:   '✕',
  },
  info: {
    border: 'border-[#4f6ef7]/30',
    bg:     'bg-[#4f6ef7]/10',
    text:   'text-[#4f6ef7]',
    icon:   'ℹ',
  },
};

function ToastItem({ id, type, message }) {
  const dismiss = useResumeStore((s) => s.dismissToast);
  const styles = TYPE_STYLES[type] ?? TYPE_STYLES.info;

  return (
    <div
      className={`
        flex items-start gap-3 min-w-[260px] max-w-[380px]
        px-4 py-3 rounded-2xl border backdrop-blur-sm
        shadow-lg shadow-black/40
        animate-[slideInRight_0.25s_ease-out]
        ${styles.bg} ${styles.border}
      `}
      role="alert"
    >
      <span className={`text-sm font-bold mt-px ${styles.text}`}>{styles.icon}</span>
      <p className="flex-1 text-sm text-[#e8e8f0] leading-snug">{message}</p>
      <button
        type="button"
        onClick={() => dismiss(id)}
        aria-label="Dismiss notification"
        className="text-[#6b6b85] hover:text-white transition-colors text-xs leading-none mt-0.5 cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useResumeStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  );
}
