import React from "react";
import { FaMapMarkerAlt, FaTruck, FaCalendar } from "react-icons/fa";
import { RiDeleteBin5Fill, RiShieldFill, RiBankCardFill, RiCloseFill } from "react-icons/ri";
import { NavLink, useLocation } from "react-router-dom";

/**
 * Array of navigation pages with their display name, route path, and icon.
 * The order defines navigation sequence and disabled state logic.
 */
const navPages = [
    { name: "Postcode", path: "#", icon: <FaMapMarkerAlt /> },
    { name: "Waste Type", path: "/waste-type", icon: <RiDeleteBin5Fill /> },
    { name: "Select Skip", path: "/select-skip", icon: <FaTruck /> },
    { name: "Permit Check", path: "/permit-check", icon: <RiShieldFill /> },
    { name: "Choose Date", path: "#", icon: <FaCalendar /> },
    { name: "Payment", path: "#", icon: <RiBankCardFill /> },
];

/**
 * Sidebar component displaying navigation links with icons.
 * Highlights current page and disables future pages based on user's progress.
 * Supports mobile toggle with a close button.
 *
 * @param {boolean} isOpen - Sidebar visibility state for mobile.
 * @param {function} onClose - Function to close sidebar on mobile.
 */
export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation();

    // Determine the current active page index based on URL path
    const currentPageIndex = navPages.findIndex(page => page.path === location.pathname);

    return (
        <nav
            className={`
                fixed lg:relative z-50 bg-neutral-900 p-4 py-8 m-5 rounded-lg shadow-lg text-center flex flex-col gap-3
                ${isOpen ? "block" : "hidden"} lg:flex
            `}
        >
            {/* Mobile Close Button */}
            <button
                className="lg:hidden absolute top-4 right-4 text-white"
                onClick={onClose}
                aria-label="Close sidebar"
            >
                <RiCloseFill />
            </button>

            {navPages.map((navPage, index) => {
                // Disable navigation for pages ahead of the current one
                const isDisabled = index > currentPageIndex;

                return (
                    <NavLink
                        key={navPage.name}
                        to={navPage.path}
                        className={`
                            flex flex-col items-center gap-3
                            ${isDisabled ? "cursor-not-allowed" : "cursor-pointer transition transform hover:scale-105"}
                        `}
                        tabIndex={isDisabled ? -1 : 0}
                        aria-disabled={isDisabled}
                    // (We can uncomment these code lines to prevent navigation on disabled links)
                    // onClick={e => {
                    //     if (isDisabled) e.preventDefault();
                    // }}
                    >
                        {React.cloneElement(navPage.icon, {
                            className: `text-2xl ${isDisabled ? "text-gray-400" : "text-blue-600"}`
                        })}
                        <span className="font-semibold text-white text-sm">{navPage.name}</span>

                        {/* Divider line except after last item */}
                        {index < navPages.length - 1 && (
                            <div className="bg-gray-300 w-px h-4 mx-auto"></div>
                        )}
                    </NavLink>
                );
            })}
        </nav>
    );
}
