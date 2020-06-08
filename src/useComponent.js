import React, { useRef } from "react";

const useComponent = (children, formProps) => {
  const renderRef = useRef()
  renderRef.current = (props) => {
    if (typeof children === 'function') {
      return children({...formProps, ...props})
    }
    return <children.type {...formProps} {...children.props}/>
  }
  const ref = useRef(function Component(props){ return renderRef.current(props)});
  return ref.current;
};

export default useComponent;
