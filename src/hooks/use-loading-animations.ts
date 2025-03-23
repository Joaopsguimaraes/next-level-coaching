import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useLoadingAnimations() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return {
    isLoading,
  };
}
