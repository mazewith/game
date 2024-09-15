import { useState, useMemo } from "react";

export const useSearchParams = () => {
  const [searchParams] = useState(new URLSearchParams(window.location.search));

  const paramsObject = useMemo(() => {
    const params: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  }, [searchParams]);

  return paramsObject;
};
