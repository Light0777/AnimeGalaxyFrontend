"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

    const navLinks = [
        { id: "home", label: "Home", href: "/" },
        { id: "anime", label: "Anime", href: "/anime" },
        { id: "manga", label: "Manga", href: "/manga" },
        { id: "discussion", label: "Discussion", href: "/discussion" },
        { id: "news", label: "News", href: "/news" },
    ];

    useEffect(() => {
        if (isMenuOpen && menuRef.current) {
            gsap.fromTo(
                menuRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
            );

            // Stagger animation for links
            gsap.fromTo(
                linksRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.3, delay: 0.1 }
            );
        }

        // Disable scroll when menu is open
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <header className="py-0 md:py-0 px-3 sm:p-0">
                <div className="w-full">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <img
                                    src="/logo.png"
                                    alt="AnimeGalaxy Logo"
                                    className="w-30 h-30 md:w-32 md:h-32 object-contain"
                                    onError={(e) => {
                                        e.currentTarget.src = "/placeholder-logo.png";
                                    }}
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation - Center */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.id}
                                    href={link.href}
                                    className="text-gray-300 hover:text-white text-lg font-bold transition-colors duration-200 relative group"
                                >
                                    {link.label}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Menu Button with proper bars */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden p-2 hover:opacity-80 transition-opacity"
                            aria-label="Toggle menu"
                        >
                            <div className="grid gap-1.5">
                                <div className="h-0.5 w-8 bg-white"></div>
                                <div className="h-0.5 w-8 bg-white"></div>
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Full Screen Menu */}
            {isMenuOpen && (
                <div 
                    ref={menuRef}
                    className="fixed inset-0 z-50 bg-black md:hidden"
                >
                    {/* Close button */}
                    <div className="absolute top-6 right-6">
                        <button
                            onClick={closeMenu}
                            className="p-3 hover:opacity-80 transition-opacity"
                            aria-label="Close menu"
                        >
                            <div className="grid gap-1.5">
                                <div className="h-0.5 w-8 bg-white rotate-45 translate-y-1.5"></div>
                                <div className="h-0.5 w-8 bg-white -rotate-45 -translate-y-1"></div>
                            </div>
                        </button>
                    </div>

                    {/* Navigation Links - Center */}
                    <div className="h-full flex flex-col items-center justify-center px-4">
                        <div className="flex flex-col items-center gap-10">
                            {navLinks.map((link, index) => (
                                <Link
                                    key={link.id}
                                    href={link.href}
                                    ref={(el) => { linksRef.current[index] = el; }}
                                    onClick={closeMenu}
                                    className="text-4xl font-bold text-gray-300 hover:text-white transition-colors duration-200 relative group text-center"
                                >
                                    {link.label}
                                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-white group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}