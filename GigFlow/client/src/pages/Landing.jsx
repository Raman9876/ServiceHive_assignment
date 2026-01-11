import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Users,
  Shield,
  Zap,
  DollarSign,
  CheckCircle,
  Code,
  Palette,
  PenTool,
  Megaphone,
  Video,
  Database,
  Lock,
  Globe,
  Activity,
} from "lucide-react";

// Animated Counter Component
const AnimatedCounter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// Marquee Component for Partner Logos
const Marquee = () => {
  const partners = [
    "ORBITAL",
    "SYNTHETICS",
    "HYPERION",
    "VERTEX",
    "QUANTUM",
    "NVIDIA",
    "ORBITAL",
    "SYNTHETICS",
    "HYPERION",
    "VERTEX",
    "QUANTUM",
    "NVIDIA",
  ];

  return (
    <div className="marquee-container py-8 border-y border-white/5">
      <div className="marquee-content">
        {partners.map((name, i) => (
          <span
            key={i}
            className="text-2xl md:text-3xl font-display font-bold text-white/20 hover:text-white/40 transition-colors cursor-default"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
};

const Landing = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const features = [
    {
      icon: Briefcase,
      title: "Find Quality Gigs",
      description:
        "Browse thousands of projects from clients worldwide. Filter by category, budget, and skills.",
      stat: "10K+",
      statLabel: "ACTIVE GIGS",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description:
        "Your earnings are protected. Get paid safely and securely for every completed project.",
      stat: "99.9%",
      statLabel: "UPTIME",
    },
    {
      icon: Users,
      title: "Build Your Team",
      description:
        "Post projects and connect with skilled freelancers who can bring your vision to life.",
      stat: "50K+",
      statLabel: "FREELANCERS",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description:
        "Get instant notifications when you receive bids or get hired. Never miss an opportunity.",
      stat: "<20ms",
      statLabel: "LATENCY",
    },
  ];

  const stats = [
    { value: 50000, suffix: "+", label: "ACTIVE FREELANCERS" },
    { value: 10000, suffix: "+", label: "PROJECTS POSTED" },
    { value: 5, suffix: "M+", label: "PAID OUT", prefix: "$" },
    { value: 99, suffix: ".99%", label: "SLA GUARANTEE" },
  ];

  const categories = [
    { name: "Web Development", count: 2340, icon: Code },
    { name: "Mobile Development", count: 1876, icon: Zap },
    { name: "UI/UX Design", count: 1654, icon: Palette },
    { name: "Content Writing", count: 1432, icon: PenTool },
    { name: "Digital Marketing", count: 1298, icon: Megaphone },
    { name: "Video Editing", count: 1187, icon: Video },
  ];

  return (
    <div className="min-h-screen bg-nexus-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Cyan Glow Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-glow-cyan/20 rounded-full blur-[120px]" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid opacity-50" />

        <div className="container-custom relative z-10 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Version Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-accent-orange/30 bg-accent-orange/10"
            >
              <span className="text-xs font-mono tracking-wider text-accent-orange">
                V2.0 STABLE RELEASE
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-display text-6xl sm:text-7xl lg:text-8xl mb-6"
            >
              <span className="text-white">FREELANCE</span>
              <br />
              <span className="text-gradient-orange">MARKETPLACE</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              The professional infrastructure layer for freelancers.
              <br />
              Zero delays. Zero hassle. Pure opportunity.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/gigs">
                <button className="btn-primary btn-lg">
                  <Briefcase className="w-5 h-5" />
                  FIND WORK
                </button>
              </Link>

              <Link to={isAuthenticated ? "/gigs/create" : "/register"}>
                <button className="btn-secondary btn-lg">
                  <Users className="w-5 h-5" />
                  POST A GIG
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partner Marquee */}
      <Marquee />

      {/* Core Modules Section */}
      <section className="py-24 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="section-label">CORE MODULES</span>
            <div className="flex items-center justify-between">
              <h2 className="text-display text-4xl sm:text-5xl text-white">
                Neural Engine
              </h2>
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="status-online" />
                  <span className="text-xs font-mono tracking-wider text-status-online">
                    GRID: ACTIVE
                  </span>
                </div>
                <span className="text-xs font-mono text-text-muted">
                  NODES ONLINE: 8,492
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Feature Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:row-span-2 nexus-card-glow p-8 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <span className="badge-info">PROCESSING_BATCH_04</span>
              </div>

              {/* Illustration Placeholder */}
              <div className="h-64 flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 border-2 border-accent-orange/30 rounded-full flex items-center justify-center">
                    <span className="text-xs font-mono text-text-secondary">
                      PROCESSING
                    </span>
                  </div>
                  <div className="absolute -top-2 left-1/2 w-2 h-2 bg-white rounded-full animate-pulse" />
                  <div className="absolute top-0 right-0 w-2 h-2 bg-accent-orange rounded-full animate-pulse" />
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent-orange/10 border border-accent-orange/30 flex items-center justify-center">
                  <Database className="w-5 h-5 text-accent-orange" />
                </div>
                <h3 className="text-xl font-display font-bold text-white">
                  Vector Synthesis
                </h3>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                Skill matching at 400k profiles/sec on dedicated GPU clusters.
              </p>
            </motion.div>

            {/* Uptime Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="nexus-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-text-muted tracking-wider">
                  UPTIME
                </span>
                <span className="status-online" />
              </div>
              <div className="text-5xl font-display font-bold text-white mb-2">
                99.99
              </div>
              <span className="text-xs font-mono text-text-muted">
                SLA Guarantee
              </span>
            </motion.div>

            {/* Security Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="nexus-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4 text-text-muted" />
                <span className="text-sm font-medium text-white">Enclave</span>
              </div>
              <div className="space-y-2 mb-4">
                {["i9a2b3c4d5e6f", "i3c4d5e6f7a8b", "i7e6f5a4b3c2a"].map(
                  (hash, i) => (
                    <div
                      key={i}
                      className="text-xs font-mono text-text-muted truncate"
                    >
                      {hash}
                    </div>
                  )
                )}
              </div>
              <span className="badge-success">
                <span className="status-online mr-2" />
                SOC2 TYPE II
              </span>
            </motion.div>

            {/* Throughput Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="nexus-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-text-muted tracking-wider">
                  THROUGHPUT
                </span>
                <Activity className="w-4 h-4 text-text-muted" />
              </div>
              {/* Mini Bar Chart */}
              <div className="flex items-end gap-2 h-20 mb-4">
                {[40, 60, 45, 80, 65, 90, 75, 95].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-accent-orange/80 transition-all hover:bg-accent-orange"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <span className="text-lg font-display font-bold text-white">
                4.2M REQ/S
              </span>
            </motion.div>

            {/* Threat Shield Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="nexus-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-white">
                  Threat Shield
                </span>
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="text-xs font-mono text-glow-cyan">
                  &gt; SCANNING...
                </div>
                <div className="text-xs font-mono text-status-online">
                  &gt; NO THREATS
                </div>
                <div className="text-xs font-mono text-text-muted">
                  &gt; PACKET_LOSS: 0%
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="section-label">DEVELOPER EXPERIENCE</span>
            <h2 className="text-display text-4xl sm:text-5xl text-white">
              Built for Builders
            </h2>
            <p className="text-text-secondary mt-4 max-w-xl">
              Don't wrestle with complexity. Our platform abstracts the hassle
              of freelancing into a simple, powerful interface.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="nexus-card-hover p-6 group"
              >
                <div className="w-12 h-12 bg-accent-orange/10 border border-accent-orange/30 flex items-center justify-center mb-4 group-hover:bg-accent-orange/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-accent-orange" />
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="pt-4 border-t border-white/5">
                  <div className="text-2xl font-display font-bold text-white">
                    {feature.stat}
                  </div>
                  <div className="text-xs font-mono text-text-muted tracking-wider">
                    {feature.statLabel}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative border-t border-white/5">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="section-label">WORKFLOW</span>
            <h2 className="text-display text-4xl sm:text-5xl text-white">
              How It Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Ingestion",
                description:
                  "Your requirements enter our processing queue. Skills are vectorized and indexed.",
              },
              {
                step: "02",
                title: "Reasoning",
                description:
                  "Requests hit our matching layer. Complex requirements are routed to expert clusters.",
              },
              {
                step: "03",
                title: "Synthesis",
                description:
                  "The perfect match is found and delivered via real-time API in sub-20ms.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="text-6xl font-display font-bold text-white/5 mb-4">
                  {item.step}.
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="section-label">CATEGORIES</span>
            <h2 className="text-display text-4xl sm:text-5xl text-white">
              Explore Opportunities
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/gigs?category=${encodeURIComponent(category.name)}`}
                >
                  <div className="nexus-card-hover p-5 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 flex items-center justify-center group-hover:bg-accent-orange/10 transition-colors">
                        <category.icon className="w-5 h-5 text-text-secondary group-hover:text-accent-orange transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white group-hover:text-accent-orange transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs font-mono text-text-muted">
                          {category.count.toLocaleString()} OPEN
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-accent-orange group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative border-t border-white/5">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="nexus-card p-6 text-center"
              >
                <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                  {stat.prefix}
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-mono text-text-muted tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-accent-orange/5 to-transparent" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-display text-4xl sm:text-5xl text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-text-secondary mb-10">
              Join thousands of freelancers and clients already using GigFlow.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <button className="btn-primary btn-lg">START FREE</button>
              </Link>

              <Link to="/gigs">
                <button className="btn-secondary btn-lg">BROWSE GIGS</button>
              </Link>

              <Link to="/login">
                <button className="btn-secondary btn-lg">CONTACT SALES</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
