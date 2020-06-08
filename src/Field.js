import React, { useContext, useEffect, useReducer, memo, useState } from "react";
import { Context, listen } from "./Form";
import useComponent from "./useComponent";

const defaultControl = <input/>

const Field = ({ name, control = defaultControl, label: labelText }) => {
  const { fieldRender: render, store, listen } = useContext(Context);
  const [value, forceUpdate] = useState(() => store[name])
  useEffect(() => {
    return listen(name, forceUpdate)
  }, [name])
  const formProps = {
    store,
    value, onChange: ({ target: { value } }) => {
      store[name] = value
    }
  };
  
  const Control = useComponent(control, formProps)
  const Label = useComponent(({ children, ...props }) => {
    return (
      <label {...props}>
        {labelText} {children}
      </label>
    );
  });
  return render({ Control, Label });
};

export default memo(Field);
