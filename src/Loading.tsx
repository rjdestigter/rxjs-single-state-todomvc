import * as React from "react";

import { CircularProgress } from "@rmwc/circular-progress";

const styles: React.CSSProperties = {
  flex: "1 1 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

export default () => (
  <div style={styles}>
    <div>
      <CircularProgress theme="secondary" size={"large"} />
    </div>
  </div>
);
