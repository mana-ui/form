import React, { createContext, useRef, useMemo, useEffect } from "react";

export const Context = createContext();

const Form = ({ children, value, setValue, fieldRender }) => {
  const vRef = useRef(value);
  const reg = useRef([])
  const pending = useRef(new Set())
  vRef.current = value
  const store = useMemo(() => {
    const proxy = new Proxy(vRef, {
      get(target, property) {
        return target.current[property];
      },
      set(target, property, value) {
        setValue({...target.current, [property]: value})
        pending.current.add(property)
        return true
      },
      
    });
    return proxy;
  }, []);
  const context = useMemo(() => ({ store, fieldRender, listen: (name, callback) => {
    reg.current = [...reg.current, {name, callback}]
    return () => {
      reg.current = reg.current.filter(({name: n, callback: c}) => n !== name || c !== callback)
    }
  } }), []);
  useEffect(() => {
    for (const {name, callback} of reg.current) {
      if (pending.current.has(name)) {
        pending.current.delete(name)
        callback(store[name])
      }
    }
  })
  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export default Form;
