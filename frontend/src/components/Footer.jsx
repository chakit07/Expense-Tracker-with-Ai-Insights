import { motion } from "framer-motion";
import {
  BarChart3,
  Github,
  Home,
  Linkedin,
  Mail,
  Settings,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/transactions", icon: Wallet, label: "Transactions" },
    { path: "/reports", icon: BarChart3, label: "Reports" },
    { path: "/profile", icon: Settings, label: "Profile" },
  ];

  const socialLinks = [
    {
      href: "https://github.com/chakit07",
      icon: Github,
      label: "GitHub",
    },
    {
      href: "https://www.linkedin.com/in/chakitsharma/",
      icon: Linkedin,
      label: "LinkedIn",
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Copyright */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Expense Tracker
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Take control of your finances with AI-powered expense tracking and
              insights.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © {currentYear} Expense Tracker. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 italic">
              Made with ❤️ by Chakit Sharma
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <div className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                Contact
              </h3>
              <a
                href="mailto:support@expensetracker.com"
                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span>chakitsharma7@gmail.com</span>
              </a>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                Follow me
              </h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Built with React, Tailwind CSS, and Firebase
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
              Version 1.0.0
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
