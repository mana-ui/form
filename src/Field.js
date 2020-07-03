import React, { useContext, useEffect, memo, useState, useRef } from "react";
import { Context } from "./Form";
import useComponent from "./useComponent";

const defaultControl = <input/>

const changed = (a, b) => a !== b && !(Number.isNaN(a) || Number.isNaN(b))

const defaultRender = ({Control, Label, ErrorMessage}) => <div><Label><Control/></Label><ErrorMessage/></div>

const Field = ({ name, control, label: labelText, render, required, validators=[], rules: propRules }) => {
  const { fieldRender, store, listen, rules: ctxRules, control: ctxControl } = useContext(Context);
  const r = render || fieldRender || defaultRender
  const c = control || ctxControl || defaultControl
  const rules = {...ctxRules, ...propRules}
  const [value, forceUpdate] = useState(() => store[name])
  const [error, setError] = useState(null)
  const prevValue = useRef(value)
  useEffect(() => {
    return listen(name, forceUpdate)
  }, [name])
  const formProps = {
    value, onChange: ({ target: { value } }) => {
      store[name] = value
    }
  };
  if (typeof c === 'function') {
    formProps.store = store
    delete formProps.onChange
  }
  
  useEffect(() => {
    let nextError = error
    if (changed(prevValue.current, value)) {
      nextError = null
      if (required ) {
        if (!value && value !== 0) {
          nextError ={rule: 'required'} 
        }
  
      }
      if (nextError === null) {
        for (let validator of validators) {
          validator = typeof validator === 'string' ? rules[validator] : validator
          const {validate, message} = validator
          if (!validate(value)) {
            nextError = {message: typeof message === 'string'? message: message({label: labelText })}
            break
          }
        }
      }
    }
   
    setError(nextError)
    prevValue.current = value
  })

  const Control = useComponent(c, {...formProps, id: name})
  const Label = useComponent(({ children, ...props }) => {
    return (
      <label {...props} htmlFor={name}>
        {labelText} {required && <span style={{color: 'red'}}>*</span>}{children}
      </label>
    );
  });
  const ErrorMessage = useComponent(props => error && <span {...props}>{error.message ?? error.rule}</span>)
  return r({ Control, Label, ErrorMessage });
};

export default memo(Field);
