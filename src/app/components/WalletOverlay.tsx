import { X, Plus, ArrowDownToLine, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "motion/react";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  description: string;
  amount: number;
  status: "success" | "pending" | "failed";
  date: string;
}

interface WalletOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletOverlay({ isOpen, onClose }: WalletOverlayProps) {
  const balance = 450;

  const transactions: Transaction[] = [
    {
      id: "TXN-1023",
      type: "credit",
      description: "Quest Reward: Print Assignment",
      amount: 100,
      status: "success",
      date: "Dec 25, 2:30 PM",
    },
    {
      id: "TXN-1022",
      type: "debit",
      description: "Platform Fee",
      amount: 5,
      status: "success",
      date: "Dec 25, 2:30 PM",
    },
    {
      id: "TXN-1021",
      type: "credit",
      description: "Quest Reward: Hold Canteen Line",
      amount: 150,
      status: "success",
      date: "Dec 24, 5:15 PM",
    },
    {
      id: "TXN-1020",
      type: "credit",
      description: "Quest Reward: Wake Me Up Call",
      amount: 80,
      status: "pending",
      date: "Dec 24, 8:00 AM",
    },
    {
      id: "TXN-1019",
      type: "debit",
      description: "Withdrawal to Bank",
      amount: 500,
      status: "success",
      date: "Dec 23, 3:45 PM",
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Overlay */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-[var(--campus-bg)] border-l border-[var(--campus-border)] z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--campus-bg)] border-b border-[var(--campus-border)] px-6 py-4 flex items-center justify-between">
          <h2 className="text-[var(--campus-text-primary)]">My Wallet</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--campus-border)] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[var(--campus-text-secondary)]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-[#2D7FF9] to-[#9D4EDD] rounded-2xl p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Current Balance</p>
            <p className="text-4xl mb-6">₹{balance}</p>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Plus className="w-5 h-5" />
                <span>Add Money</span>
              </button>
              <button className="bg-[#00F5D4]/20 backdrop-blur-md hover:bg-[#00F5D4]/30 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <ArrowDownToLine className="w-5 h-5" />
                <span>Withdraw</span>
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <h3 className="text-[var(--campus-text-primary)] mb-4">Recent Transactions</h3>
            
            {/* Transaction Table */}
            <div className="bg-[var(--campus-card-bg)] rounded-xl border border-[var(--campus-border)] overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-[var(--campus-border)] text-xs text-[var(--campus-text-secondary)] border-b border-[var(--campus-border)]">
                <div className="col-span-5">Details</div>
                <div className="col-span-3">ID</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-2 text-center">Status</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-[var(--campus-border)]">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-[var(--campus-border)] transition-colors"
                  >
                    {/* Details */}
                    <div className="col-span-5">
                      <div className="flex items-start gap-2">
                        <div
                          className={`mt-0.5 p-1.5 rounded-lg ${
                            txn.type === "credit"
                              ? "bg-[#00F5D4]/10 text-[#00F5D4]"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {txn.type === "credit" ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--campus-text-primary)] truncate">
                            {txn.description}
                          </p>
                          <p className="text-xs text-[var(--campus-text-secondary)] mt-0.5">
                            {txn.date}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Transaction ID */}
                    <div className="col-span-3">
                      <p className="text-xs text-[var(--campus-text-secondary)] font-mono">
                        {txn.id}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="col-span-2 text-right">
                      <p
                        className={`text-sm ${
                          txn.type === "credit" ? "text-[#00F5D4]" : "text-red-500"
                        }`}
                      >
                        {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex justify-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          txn.status === "success"
                            ? "bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/30"
                            : txn.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/30"
                            : "bg-red-500/10 text-red-500 border border-red-500/30"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
