"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function DeviceDetector() {
  useEffect(() => {
    const checkDevice = () => {
      // On considère mobile/tablette si la largeur est inférieure à 1024px
      const isMobileOrTablet = window.innerWidth < 1024;

      if (isMobileOrTablet) {
        setTimeout(() => {
          toast.info("Expérience optimale sur ordinateur", {
            description:
              "Vous aurez une meilleure expérience sur un ordinateur",
            duration: 5000,
          });
        }, 1500);
      }
    };

    checkDevice();
  }, []);

  return null;
}
