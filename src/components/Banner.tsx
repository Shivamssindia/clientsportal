"use client";
import { useEffect } from "react";

export default function Banner() {
  useEffect(() => {
    console.clear();

    const banner = `
   ███████  ██████  ███████ ████████ ███    ███  █████  ██   ██
   ██      ██    ██ ██         ██    ████  ████ ██   ██  ██ ██ 
   ███████ ██    ██ █████      ██    ██ ████ ██ ███████   ███  
        ██ ██    ██ ██         ██    ██  ██  ██ ██   ██  ██ ██ 
   ███████  ██████  ██         ██    ██      ██ ██   ██ ██   ██

   ==========================================================

                 :: SOFTMAX ::      (v1.0.0)
    `;

    console.log(
      `%c${banner}`,
      "color:#00ff88; font-family: monospace; font-weight:bold;"
    );
  }, []);

  return null;
}