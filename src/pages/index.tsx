import React, { useEffect, useState } from "react";
import { VenomConnect } from "venom-connect";

import { Main } from "@/templates/Main/Main";
import { initVenomConnect } from "@/venom-connect/configure";

const Index = () => {
  const [venomConnect, setVenomConnect] = useState<VenomConnect | undefined>();
  const init = async () => {
    const _venomConnect = await initVenomConnect();
    setVenomConnect(_venomConnect);
  };
  useEffect(() => {
    init();
  }, []);

  return <Main venomConnect={venomConnect} />;
};

export default Index;
