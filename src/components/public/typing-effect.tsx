"use client";

import { useEffect, useState } from "react";

interface TypingEffectProps {
  rolesString?: string | null;
}

export function TypingEffect({
  rolesString = "Web Developer, Digital Marketer, Frontend Designer, Machine Learning Enthusiast",
}: TypingEffectProps) {
  const roles = (rolesString || "")
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);

  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (roles.length === 0) return;

    const currentRole = roles[roleIndex % roles.length];
    const typingSpeed = isDeleting ? 40 : 80;
    const pauseTime = isDeleting ? 40 : 1200;

    if (!isDeleting && charIndex === currentRole.length) {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex === 0) {
      const timer = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }, pauseTime);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setText(currentRole.substring(0, charIndex + (isDeleting ? -1 : 1)));
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex, roles]);

  if (roles.length === 0) return null;

  return (
    <span className="font-semibold text-indigo-400 border-b-2 border-indigo-400 pb-0.5 ml-1 inline-block min-h-[1.5em]">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
}
