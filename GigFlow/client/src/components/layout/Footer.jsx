import { Zap, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    setEmail("");
  };

  return (
    <footer className="relative bg-nexus-black border-t border-white/5">
      {/* Large Background Text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 text-[20vw] font-display font-bold text-white/[0.02] leading-none tracking-tighter select-none">
          GIGFLOW
        </div>
      </div>

      <div className="container-custom relative py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Section - CTA */}
          <div className="lg:col-span-5">
            <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to scale?
            </h3>

            {/* Email Signup */}
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@company.com"
                className="flex-1 px-4 py-3 bg-nexus-dark border border-white/10 text-white placeholder:text-text-muted focus:outline-none focus:border-accent-orange/50 font-mono text-sm"
              />
              <button type="submit" className="btn-primary px-6">
                JOIN
              </button>
            </form>
          </div>

          {/* Right Section - Links */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Platform */}
              <div>
                <h4 className="text-xs font-mono tracking-widest text-white mb-4">
                  PLATFORM
                </h4>
                <ul className="space-y-3">
                  {[
                    { label: "Find Work", path: "/gigs" },
                    { label: "Post Gig", path: "/gigs/create" },
                    { label: "Dashboard", path: "/dashboard" },
                  ].map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.path}
                        className="text-sm text-text-secondary hover:text-accent-orange transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-xs font-mono tracking-widest text-white mb-4">
                  LEGAL
                </h4>
                <ul className="space-y-3">
                  {[
                    { label: "Privacy", href: "#" },
                    { label: "Terms", href: "#" },
                  ].map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-sm text-text-secondary hover:text-accent-orange transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connect */}
              <div>
                <h4 className="text-xs font-mono tracking-widest text-white mb-4">
                  CONNECT
                </h4>
                <div className="flex items-center gap-3">
                  {[
                    { icon: Twitter, href: "#", label: "Twitter" },
                    { icon: Github, href: "#", label: "GitHub" },
                    { icon: Linkedin, href: "#", label: "LinkedIn" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="w-10 h-10 flex items-center justify-center border border-white/10 text-text-secondary hover:text-white hover:border-accent-orange/50 transition-all"
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-white/5" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center bg-accent-orange">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-bold font-display">
                GIG<span className="text-accent-orange">FLOW</span>
              </span>
            </Link>
            <span className="text-xs text-text-muted font-mono">
              © {new Date().getFullYear()} GIGFLOW INC.
            </span>
          </div>

          {/* Location */}
          <span className="text-xs text-text-muted font-mono tracking-wider">
            WORLDWIDE
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
