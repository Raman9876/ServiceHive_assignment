import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfile } from "../store/slices/authSlice";
import {
  User,
  Mail,
  Briefcase,
  MapPin,
  Link as LinkIcon,
  Camera,
  Save,
  Loader2,
  CheckCircle,
  Award,
  Star,
  TrendingUp,
  Calendar,
  Edit3,
  X,
  Plus,
  Terminal,
} from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    skills: [],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        skills: user.skills || [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      bio: user.bio || "",
      location: user.location || "",
      website: user.website || "",
      skills: user.skills || [],
    });
    setIsEditing(false);
  };

  const stats = [
    {
      label: "GIGS POSTED",
      value: user?.gigsPosted || 0,
      icon: Briefcase,
    },
    {
      label: "COMPLETED",
      value: user?.gigsCompleted || 0,
      icon: CheckCircle,
    },
    {
      label: "TOTAL BIDS",
      value: user?.totalBids || 0,
      icon: TrendingUp,
    },
    {
      label: "RATING",
      value: user?.rating?.toFixed(1) || "N/A",
      icon: Star,
    },
  ];

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

      <div className="container-custom max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Label */}
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-5 h-5 text-accent-orange" />
            <span className="text-xs font-mono text-glow-cyan tracking-wider">
              USER_PROFILE
            </span>
          </div>

          {/* Profile Header Card */}
          <div className="nexus-card overflow-hidden mb-6">
            {/* Orange Top Line */}
            <div className="h-1 bg-gradient-to-r from-accent-orange to-accent-orange-hover" />

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-28 h-28 overflow-hidden border-2 border-accent-orange/50">
                    <img
                      src={
                        user?.avatar ||
                        `https://ui-avatars.com/api/?name=${user?.name}&background=ff4d00&color=fff&size=200`
                      }
                      alt={user?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent-orange flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <h1 className="text-3xl font-display font-bold text-white mb-2">
                        {user?.name}
                      </h1>
                      <p className="text-text-secondary flex items-center gap-2 font-mono text-sm">
                        <Mail className="w-4 h-4" />
                        {user?.email}
                      </p>
                      {user?.location && (
                        <p className="text-text-muted flex items-center gap-2 mt-1 font-mono text-sm">
                          <MapPin className="w-4 h-4" />
                          {user.location}
                        </p>
                      )}
                      {user?.website && (
                        <a
                          href={
                            user.website.startsWith("http")
                              ? user.website
                              : `https://${user.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-orange hover:text-accent-orange-hover flex items-center gap-2 mt-1 font-mono text-sm"
                        >
                          <LinkIcon className="w-4 h-4" />
                          {user.website}
                        </a>
                      )}
                    </div>

                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn-primary"
                      >
                        <Edit3 className="w-4 h-4" />
                        EDIT PROFILE
                      </button>
                    )}
                  </div>

                  {/* Member Since */}
                  <div className="flex items-center gap-2 mt-4 text-text-muted font-mono text-sm">
                    <Calendar className="w-4 h-4" />
                    MEMBER SINCE{" "}
                    {new Date(user?.createdAt)
                      .toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                      .toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {user?.bio && !isEditing && (
                <div className="mt-6 p-4 bg-white/5 border border-white/10">
                  <p className="text-text-secondary leading-relaxed">
                    {user.bio}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="nexus-card p-5"
              >
                <div className="w-10 h-10 bg-accent-orange/10 flex items-center justify-center mb-3">
                  <stat.icon className="w-5 h-5 text-accent-orange" />
                </div>
                <p className="text-2xl font-display font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-xs font-mono text-text-muted">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Edit Form */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="nexus-card overflow-hidden mb-6"
              >
                <div className="h-1 bg-gradient-to-r from-glow-cyan to-glow-cyan/50" />

                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="section-label flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-glow-cyan" />
                      EDIT_PROFILE
                    </h2>
                    <button
                      onClick={handleCancel}
                      className="text-text-muted hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name & Email Row */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="section-label mb-2 flex items-center gap-2">
                          <User className="w-4 h-4" /> NAME
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="input w-full"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="section-label mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4" /> EMAIL
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input w-full opacity-60 cursor-not-allowed"
                          placeholder="your@email.com"
                          disabled
                        />
                      </div>
                    </div>

                    {/* Location & Website Row */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="section-label mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> LOCATION
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="input w-full"
                          placeholder="City, Country"
                        />
                      </div>
                      <div>
                        <label className="section-label mb-2 flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" /> WEBSITE
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="input w-full"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="section-label mb-2">BIO</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="input w-full min-h-[120px] resize-none"
                        placeholder="Tell us about yourself..."
                      />
                      <p className="text-xs font-mono text-text-muted mt-1">
                        {formData.bio.length}/500 CHARACTERS
                      </p>
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="section-label mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4" /> SKILLS
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={handleSkillKeyDown}
                          className="input flex-1"
                          placeholder="Add a skill (e.g., React, Node.js)"
                        />
                        <button
                          type="button"
                          onClick={addSkill}
                          className="px-4 py-3 bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {formData.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.skills.map((skill, index) => (
                            <motion.span
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent-orange/10 text-accent-orange text-sm font-mono border border-accent-orange/30"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="hover:text-white ml-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 py-3.5 font-mono font-medium text-text-secondary bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary flex-1 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            SAVING...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            SAVE CHANGES
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skills Display (when not editing) */}
          {!isEditing && user?.skills?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="nexus-card p-6"
            >
              <h3 className="section-label mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-accent-orange" />
                SKILLS_EXPERTISE
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-accent-orange/10 text-accent-orange border border-accent-orange/30 text-sm font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
