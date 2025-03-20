import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const BottomNavBar = () => {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const menuItems = [
    { name: "Experience", links: ["Travel", "Adventure", "Culture"] },
    { name: "Essentials", links: ["Gear", "Guides", "Tips"] },
    { name: "Others", links: ["Blog", "Community", "Support"] },
  ];

  return (
    <nav className="relative bg-gray-800 text-white p-4">
      <div className="flex space-x-6">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className="relative"
            onMouseEnter={() => setHoveredMenu(item.name)}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <span className="cursor-pointer">{item.name}</span>
            <AnimatePresence>
              {hoveredMenu === item.name && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 top-full mt-2 bg-gray-700 rounded-lg shadow-lg p-3 w-40"
                >
                  {item.links.map((link) => (
                    <NavLink
                      key={link}
                      to={`/${link.toLowerCase()}`}
                      className="block px-3 py-2 hover:bg-gray-600 rounded"
                    >
                      {link}
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
