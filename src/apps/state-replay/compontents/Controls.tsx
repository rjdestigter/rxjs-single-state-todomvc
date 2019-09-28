import * as React from "react";

import { IconButton } from "@rmwc/icon-button";
import { Slider } from "@rmwc/slider";

export interface PropsControls {
  index: number;
  max: number;
  setIndex: (index: number) => void;
  play: () => void;
  pause: () => void;
}

export default (props: PropsControls) => (
  <div style={{ padding: 15 }}>
    <Slider
      value={props.index}
      // onChange={evt => setIndex(evt.detail.value)}
      onInput={evt => {
        props.setIndex(evt.detail.value);
      }}
      discrete
      start={0}
      max={props.max}
      step={1}
    />
    <div className="controls">
      <IconButton
        theme={props.index === 0 ? undefined : "secondary"}
        icon="fast_rewind"
        onClick={() => props.setIndex(0)}
        disabled={props.index === 0}
      />
      <IconButton
        theme={props.index === 0 ? undefined : "secondary"}
        icon="skip_previous"
        onClick={() => props.setIndex(props.index - 1)}
        disabled={props.index === 0}
      />
      <IconButton theme="secondary" icon="stop" onClick={props.pause} />
      <IconButton
        theme="secondary"
        icon="play_circle_filled"
        onClick={props.play}
      />
      <IconButton
        theme={props.index === props.max ? undefined : "secondary"}
        icon="skip_next"
        onClick={() => props.setIndex(props.index + 1)}
        disabled={props.index === props.max}
      />
      <IconButton
        theme={props.index === props.max ? undefined : "secondary"}
        icon="fast_forward"
        onClick={() => props.setIndex(props.max)}
        disabled={props.index === props.max}
      />
    </div>
  </div>
);
