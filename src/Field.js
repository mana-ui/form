import React, { useContext, useEffect, useReducer, memo, useState } from "react";
import { Context, listen } from "./Form";
import useComponent from "./useComponent";

const defaultControl = <input/>

const Field = ({ name, control = defaultControl, label: labelText, render }) => {
  const { fieldRender, store, listen } = useContext(Context);
  const r = render || fieldRender
  const [value, forceUpdate] = useState(() => store[name])
  useEffect(() => {
    return listen(name, forceUpdate)
  }, [name])
  const formProps = {
    value, onChange: ({ target: { value } }) => {
      store[name] = value
    }
  };
  if (typeof control === 'function') {
    formProps.store = store
  }
  
  const Control = useComponent(control, {...formProps, id: name})
  const Label = useComponent(({ children, ...props }) => {
    return (
      <label {...props} htmlFor={name}>
        {labelText} {children}
      </label>
    );
  });
  return r({ Control, Label });
};

export default memo(Field);
