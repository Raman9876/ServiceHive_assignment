import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { createGig } from "../../store/slices/gigSlice";
import {
  Briefcase,
  FileText,
  DollarSign,
  Calendar,
  Tag,
  Plus,
  X,
  Loader2,
  ArrowLeft,
  Terminal,
} from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Graphic Design",
  "Content Writing",
  "Digital Marketing",
  "Video Editing",
  "Data Entry",
  "Virtual Assistant",
  "Other",
];

const CreateGig = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCreating } = useSelector((state) => state.gigs);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
    deadline: "",
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    }
    if (!formData.description || formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }
    if (!formData.budget || formData.budget < 10) {
      newErrors.budget = "Budget must be at least $10";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.deadline) {
      newErrors.deadline = "Please set a deadline";
    } else {
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= new Date()) {
        newErrors.deadline = "Deadline must be in the future";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const result = await dispatch(
        createGig({ ...formData, budget: Number(formData.budget) })
      ).unwrap();
      toast.success("Gig posted successfully!");
      navigate(`/gigs/${result.gig._id}`);
    } catch (error) {
      toast.error(error || "Failed to create gig");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-nexus-black py-8 relative overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 77, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 77, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-glow-cyan/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container-custom max-w-3xl relative z-10">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-accent-orange transition-colors mb-6 font-mono text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="nexus-card overflow-hidden"
        >
          {/* Orange Top Line */}
          <div className="h-1 bg-gradient-to-r from-accent-orange to-accent-orange-hover" />

          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-accent-orange/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-accent-orange" />
                </div>
                <div>
                  <span className="text-xs font-mono text-glow-cyan tracking-wider">
                    CREATE_GIG
                  </span>
                  <h1 className="text-2xl font-display font-bold text-white">
                    POST A NEW GIG
                  </h1>
                </div>
              </div>
              <p className="text-text-secondary font-mono text-sm">
                Describe your project and find the perfect freelancer
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="section-label mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> TITLE
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`input w-full ${
                    errors.title ? "border-red-500/50" : ""
                  }`}
                  placeholder="e.g., Build a responsive e-commerce website"
                />
                {errors.title && (
                  <p className="text-xs text-red-400 mt-1 font-mono">
                    {errors.title}
                  </p>
                )}
                <p className="text-xs text-text-muted mt-1 font-mono">
                  {formData.title.length}/100 characters
                </p>
              </div>

              {/* Category & Budget */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="section-label mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> CATEGORY
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`input w-full ${
                      errors.category ? "border-red-500/50" : ""
                    }`}
                  >
                    <option value="" className="bg-nexus-black">
                      Select a category
                    </option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-nexus-black">
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-xs text-red-400 mt-1 font-mono">
                      {errors.category}
                    </p>
                  )}
                </div>
                <div>
                  <label className="section-label mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> BUDGET (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className={`input w-full pl-10 ${
                        errors.budget ? "border-red-500/50" : ""
                      }`}
                      placeholder="500"
                      min="10"
                      max="100000"
                    />
                  </div>
                  {errors.budget && (
                    <p className="text-xs text-red-400 mt-1 font-mono">
                      {errors.budget}
                    </p>
                  )}
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="section-label mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> DEADLINE
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  min={minDate}
                  max="2099-12-31"
                  className={`input w-full ${
                    errors.deadline ? "border-red-500/50" : ""
                  }`}
                />
                {errors.deadline && (
                  <p className="text-xs text-red-400 mt-1 font-mono">
                    {errors.deadline}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div>
                <label className="section-label mb-2">
                  REQUIRED_SKILLS (OPTIONAL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    className="input flex-1"
                    placeholder="e.g., React, Node.js"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-3 bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2 font-mono text-sm"
                  >
                    <Plus className="w-4 h-4" /> ADD
                  </button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent-orange/10 text-accent-orange text-sm font-mono border border-accent-orange/30"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="section-label mb-2">DESCRIPTION</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`input w-full min-h-[180px] resize-none ${
                    errors.description ? "border-red-500/50" : ""
                  }`}
                  placeholder="Provide a detailed description of your project..."
                />
                <div className="flex justify-between mt-1">
                  {errors.description && (
                    <p className="text-xs text-red-400 font-mono">
                      {errors.description}
                    </p>
                  )}
                  <p className="text-xs text-text-muted ml-auto font-mono">
                    {formData.description.length}/2000
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 py-3.5 font-mono font-medium text-text-secondary bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> POSTING...
                    </>
                  ) : (
                    <>
                      <Terminal className="w-4 h-4" /> POST GIG
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateGig;
