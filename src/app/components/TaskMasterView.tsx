import { Calendar, Shield } from "lucide-react";
import { useState } from "react";
import { UrgencySelector } from "./UrgencySelector";
import { SuccessModal } from "./SuccessModal";

interface FormErrors {
  taskName?: string;
  taskDetails?: string;
  deadline?: string;
  incentive?: string;
}

export function TaskMasterView() {
  const [urgency, setUrgency] = useState<"low" | "medium" | "high">("medium");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    taskName: "",
    taskDetails: "",
    deadline: "",
    incentive: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.taskName.trim()) {
      newErrors.taskName = "Task name is required";
    }
    
    if (!formData.taskDetails.trim()) {
      newErrors.taskDetails = "Task details are required";
    }
    
    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required";
    }
    
    if (!formData.incentive || parseFloat(formData.incentive) <= 0) {
      newErrors.incentive = "Bounty is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowSuccessModal(true);
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          taskName: "",
          taskDetails: "",
          deadline: "",
          incentive: "",
        });
        setErrors({});
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen pt-16 md:pt-28 pb-20 md:pb-16 px-4 md:px-8 bg-[var(--campus-bg)]">
      <div className="max-w-[1400px] mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="mb-4 text-2xl md:text-4xl lg:text-5xl">
            Ready to{" "}
            <span className="bg-gradient-to-r from-[#2D7FF9] to-[#9D4EDD] bg-clip-text text-transparent">
              Conquer Campus?
            </span>
          </h1>
          <p className="text-[var(--campus-text-secondary)] text-base md:text-lg lg:text-xl">
            Delegate your chaos. Summon a Hero.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-[var(--campus-card-bg)] bg-opacity-50 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-[var(--campus-border)] shadow-2xl">
            {/* Glassmorphic glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2D7FF9]/20 to-[#9D4EDD]/20 rounded-3xl blur-xl opacity-50"></div>
            
            <div className="relative space-y-6">
              {/* Task Name */}
              <div>
                <label className="block text-[var(--campus-text-primary)] mb-2">Task Name</label>
                <input
                  type="text"
                  placeholder="Task Name"
                  value={formData.taskName}
                  onChange={(e) => {
                    setFormData({ ...formData, taskName: e.target.value });
                    if (errors.taskName) setErrors({ ...errors, taskName: undefined });
                  }}
                  className={`w-full px-4 py-3 bg-[var(--campus-border)] rounded-xl text-[var(--campus-text-primary)] placeholder-[var(--campus-text-secondary)] focus:outline-none focus:ring-2 transition-all ${
                    errors.taskName
                      ? "border-2 border-red-500 focus:ring-red-500/50"
                      : "border border-[var(--campus-border)] focus:ring-[#2D7FF9]/50"
                  }`}
                />
                {errors.taskName && (
                  <p className="text-red-500 text-sm mt-1">{errors.taskName}</p>
                )}
              </div>

              {/* Two Column Layout - Stack on mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Task Details */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[var(--campus-text-primary)] mb-2">Task Details</label>
                    <textarea
                      placeholder="Brief details about the task..."
                      rows={6}
                      value={formData.taskDetails}
                      onChange={(e) => {
                        setFormData({ ...formData, taskDetails: e.target.value });
                        if (errors.taskDetails) setErrors({ ...errors, taskDetails: undefined });
                      }}
                      className={`w-full px-4 py-3 bg-[var(--campus-border)] rounded-xl text-[var(--campus-text-primary)] placeholder-[var(--campus-text-secondary)] focus:outline-none focus:ring-2 transition-all resize-none ${
                        errors.taskDetails
                          ? "border-2 border-red-500 focus:ring-red-500/50"
                          : "border border-[var(--campus-border)] focus:ring-[#2D7FF9]/50"
                      }`}
                    />
                    {errors.taskDetails && (
                      <p className="text-red-500 text-sm mt-1">{errors.taskDetails}</p>
                    )}
                  </div>
                </div>

                {/* Right Column - Deadline, Urgency, Incentive */}
                <div className="space-y-6">
                  {/* Deadline */}
                  <div>
                    <label className="block text-[var(--campus-text-primary)] mb-2">Deadline</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        value={formData.deadline}
                        onChange={(e) => {
                          setFormData({ ...formData, deadline: e.target.value });
                          if (errors.deadline) setErrors({ ...errors, deadline: undefined });
                        }}
                        className={`w-full px-4 py-3 bg-[var(--campus-border)] rounded-xl text-[var(--campus-text-primary)] focus:outline-none focus:ring-2 transition-all ${
                          errors.deadline
                            ? "border-2 border-red-500 focus:ring-red-500/50"
                            : "border border-[var(--campus-border)] focus:ring-[#2D7FF9]/50"
                        }`}
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--campus-text-secondary)] pointer-events-none" />
                    </div>
                    {errors.deadline && (
                      <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
                    )}
                  </div>

                  {/* Urgency Selector */}
                  <div>
                    <label className="block text-[var(--campus-text-primary)] mb-4">Urgency</label>
                    <UrgencySelector value={urgency} onChange={setUrgency} />
                  </div>

                  {/* Incentive Amount */}
                  <div>
                    <label className="block text-[var(--campus-text-primary)] mb-2">Incentive Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--campus-text-secondary)]">₹</span>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={formData.incentive}
                        onChange={(e) => {
                          setFormData({ ...formData, incentive: e.target.value });
                          if (errors.incentive) setErrors({ ...errors, incentive: undefined });
                        }}
                        className={`w-full pl-8 pr-4 py-3 bg-[var(--campus-border)] rounded-xl text-[var(--campus-text-primary)] placeholder-[var(--campus-text-secondary)] focus:outline-none focus:ring-2 transition-all ${
                          errors.incentive
                            ? "border-2 border-red-500 focus:ring-red-500/50"
                            : "border border-[var(--campus-border)] focus:ring-[#2D7FF9]/50"
                        }`}
                      />
                    </div>
                    {errors.incentive && (
                      <p className="text-red-500 text-sm mt-1">{errors.incentive}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleSubmit}
                className="w-full mt-8 py-4 bg-gradient-to-r from-[#2D7FF9] to-[#9D4EDD] rounded-xl text-white transition-all hover:shadow-lg hover:shadow-[#2D7FF9]/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                <Shield className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                FIND YOUR HERO
              </button>
            </div>
          </div>

          {/* Preview Card on the Right */}
          <div className="mt-8 bg-[var(--campus-card-bg)] bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border border-[var(--campus-border)]">
            <h3 className="text-[var(--campus-text-primary)] mb-3">Preview</h3>
            <div className="bg-[var(--campus-surface)] rounded-xl p-4 border border-[#2D7FF9]/30">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-[var(--campus-text-primary)]">Hold Canteen Line Spot</h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    urgency === "low"
                      ? "bg-[#2D7FF9]/20 text-[#2D7FF9] border border-[#2D7FF9]/40"
                      : urgency === "medium"
                      ? "bg-[#9D4EDD]/20 text-[#9D4EDD] border border-[#9D4EDD]/40"
                      : "bg-[#FF4800]/20 text-[#FF4800] border border-[#FF4800]/40"
                  }`}
                >
                  {urgency.toUpperCase()}
                </span>
              </div>
              <p className="text-[var(--campus-text-secondary)] text-sm mb-3">
                Stand in the lunch queue for me for 20 mins.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </div>
  );
}