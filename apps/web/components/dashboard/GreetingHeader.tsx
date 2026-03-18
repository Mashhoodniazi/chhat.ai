"use client";

import { useEffect, useState } from "react";

interface Props {
  firstName: string;
}

export default function GreetingHeader({ firstName }: Props) {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
      {firstName ? `${greeting}, ${firstName} 👋` : "Dashboard"}
    </h1>
  );
}
