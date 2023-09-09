import { useCallback, useEffect, useState } from "react";

import { IMediaQuery } from "@/types/IMediaQuery";

const useMediaQuery = ({ width }: IMediaQuery) => {
  const [targetReached, setTargetReached] = useState(false);

  // @ts-ignore
  const updateTarget = useCallback((e) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addListener(updateTarget);

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeListener(updateTarget);
  }, []);

  return targetReached;
};

export default useMediaQuery;
