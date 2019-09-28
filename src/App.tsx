import React from "react";
import { noop } from "rxjs";

import TodoApp from "./apps/todo/Todo";
import Controls from "./apps/state-replay/compontents/Controls";
import Loading from "./Loading";

import { setIndex, play, pause } from "./apps/todo/state";
import { useTodoProps } from "./apps/todo/hooks";

const App = () => {
  const [props, state] = useTodoProps();
  if (props != null) {
    const todoApp = (
      <TodoApp
        todos={props.todos}
        new={props.new}
        onChangeFilterType={
          props.onChangeFilterType
        }
        onChangeNew={props.onChangeNew}
        onSubmitNew={props.onSubmitNew}
        filterType={props.filterType}
        onEdit={props.onEdit}
        onSave={props.onSave}
        onCompleteAll={props.onCompleteAll}
        onClearComplete={
          props.onClearComplete
        }
      />
    );

    const controls = (
      <Controls
        index={state.index}
        max={state.max}
        setIndex={setIndex}
        pause={pause}
        play={play}
      />
    );

    return (
      <>
        <div>
          <div className="todomvc">{todoApp}</div>
        </div>
        <div>{controls}</div>
      </>
    );
  }

  return <Loading />;
};

export default App;
