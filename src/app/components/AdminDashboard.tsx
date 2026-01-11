import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ShieldCheck, UserCheck, Banknote, Split } from "lucide-react";

export function AdminDashboard({ currentUser }: { currentUser: any }) {
  const [disputes, setDisputes] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/disputes').then(res => res.json()).then(setDisputes);
  }, []);

  const handleResolve = async (questId: string, resolution: string) => {
    if(!confirm(`Are you sure you want to resolve as: ${resolution}?`)) return;

    try {
        const res = await fetch(`/api/disputes/${questId}/resolve`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ resolution, adminUsername: currentUser.username })
        });
        if(res.ok) {
            alert("Resolved!");
            setDisputes(prev => prev.filter(d => d._id !== questId));
        }
    } catch(e) { console.error(e); }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-20 bg-[var(--campus-bg)]">
       <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-8 h-8 text-[#2D7FF9]" />
              <h1 className="text-2xl font-bold text-[var(--campus-text-primary)]">Admin Resolution Centre</h1>
          </div>

          {disputes.length === 0 ? (
              <p className="text-[var(--campus-text-secondary)]">No active disputes. Peace prevails! 🕊️</p>
          ) : (
              <div className="space-y-4">
                  {disputes.map((d) => (
                      <div key={d._id} className="bg-[var(--campus-card-bg)] border border-red-500/30 p-4 md:p-6 rounded-xl shadow-lg">
                          {/* Header: Stack vertically on mobile, row on desktop */}
                          <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2 md:gap-0">
                              <div>
                                  <h3 className="font-bold text-lg text-[var(--campus-text-primary)]">{d.title}</h3>
                                  <p className="text-sm text-[var(--campus-text-secondary)]">Reward: ₹{d.reward}</p>
                              </div>
                              <span className="bg-red-500/20 text-red-500 text-xs px-2 py-1 rounded font-bold uppercase self-start md:self-auto">Disputed</span>
                          </div>

                          <div className="bg-[var(--campus-surface)] p-4 rounded-lg mb-4">
                              <p className="text-sm font-bold text-[var(--campus-text-secondary)] mb-1">
                                  Reported by @{d.dispute?.raisedBy}:
                              </p>
                              <p className="text-[var(--campus-text-primary)] italic">"{d.dispute?.reason}"</p>
                          </div>

                          {/* Info Row: Stack on mobile */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 text-sm text-[var(--campus-text-secondary)] mb-6">
                              <span>Task Master: <strong>{d.postedBy}</strong></span>
                              <span>Hero: <strong>{d.assignedTo}</strong></span>
                          </div>

                          {/* Button Grid: 1 column on mobile, 3 columns on tablet+ */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <Button variant="outline" onClick={() => handleResolve(d._id, 'refund_poster')} className="border-green-500 text-green-500 hover:bg-green-500/10 justify-center h-auto py-2">
                                  <Banknote className="w-4 h-4 mr-2" /> Refund Master
                              </Button>
                              <Button variant="outline" onClick={() => handleResolve(d._id, 'pay_hero')} className="border-blue-500 text-blue-500 hover:bg-blue-500/10 justify-center h-auto py-2">
                                  <UserCheck className="w-4 h-4 mr-2" /> Pay Hero
                              </Button>
                              <Button variant="outline" onClick={() => handleResolve(d._id, 'split')} className="border-orange-500 text-orange-500 hover:bg-orange-500/10 justify-center h-auto py-2">
                                  <Split className="w-4 h-4 mr-2" /> 50/50 Split
                              </Button>
                          </div>
                      </div>
                  ))}
              </div>
          )}
       </div>
    </div>
  );
}