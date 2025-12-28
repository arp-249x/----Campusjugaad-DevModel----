import { X, Bell, CheckCircle2, Info, AlertTriangle, Trash2 } from "lucide-react";

interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning";
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: AppNotification[];
  onClear?: () => void;
}

export function NotificationPanel({ isOpen, onClose, notifications = [], onClear }: NotificationPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden" onClick={onClose} />
      <div className="fixed top-20 right-4 md:right-8 w-[90vw] md:w-[380px] bg-[var(--campus-card-bg)] border border-[var(--campus-border)] rounded-2xl shadow-2xl z-50 animate-in slide-in-from-right fade-in duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--campus-border)] bg-[var(--campus-surface)]/50">
           <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[var(--campus-text-primary)]" />
              <span className="font-bold text-[var(--campus-text-primary)]">Notifications</span>
              {notifications.length > 0 && (
                <span className="bg-[#2D7FF9] text-white text-[10px] px-1.5 rounded-full">{notifications.length}</span>
              )}
           </div>
           <div className="flex gap-1">
              {notifications.length > 0 && (
                <button onClick={onClear} className="p-1.5 hover:bg-red-500/10 text-[var(--campus-text-secondary)] hover:text-red-500 rounded transition-colors" title="Clear All">
                    <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button onClick={onClose} className="p-1.5 hover:bg-[var(--campus-border)] text-[var(--campus-text-secondary)] rounded transition-colors">
                 <X className="w-4 h-4" />
              </button>
           </div>
        </div>

        {/* List */}
        <div className="max-h-[400px] overflow-y-auto">
           {notifications.length > 0 ? (
             <div className="divide-y divide-[var(--campus-border)]">
                {notifications.map((notif) => (
                   <div key={notif.id} className="p-4 hover:bg-[var(--campus-surface)] transition-colors flex gap-3">
                      <div className={`mt-1 shrink-0 ${
                         notif.type === 'success' ? 'text-green-500' :
                         notif.type === 'warning' ? 'text-yellow-500' : 'text-[#2D7FF9]'
                      }`}>
                         {notif.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                          notif.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                          <Info className="w-5 h-5" />}
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-[var(--campus-text-primary)]">{notif.title}</h4>
                         <p className="text-xs text-[var(--campus-text-secondary)] mt-0.5">{notif.message}</p>
                         <span className="text-[10px] text-[var(--campus-text-secondary)] opacity-60 mt-1 block">{notif.time}</span>
                      </div>
                   </div>
                ))}
             </div>
           ) : (
             <div className="p-8 text-center text-[var(--campus-text-secondary)]">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No new notifications</p>
             </div>
           )}
        </div>
      </div>
    </>
  );
}