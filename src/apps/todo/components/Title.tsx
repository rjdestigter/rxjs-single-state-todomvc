import * as React from "react";
import { Typography } from "@rmwc/typography";

const style: React.CSSProperties = { textAlign: "center", marginTop: 15 };

export default () => (
  <div style={style}>
    <Typography use="headline1" theme="secondary">
      todos
    </Typography>
  </div>
);
