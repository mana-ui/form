import React, { cloneElement, useRef } from "react"

const useComponent = (children, formProps) => {
  const renderRef = useRef()
  renderRef.current = function Control(props) {
    if (typeof children === "function") {
      const control = children(formProps)
      return cloneElement(control, {...control.props, ...props})
    }
    return cloneElement(children, {...formProps, ...children.props, ...props})
  }
  const ref = useRef(function Component(props) {
    return renderRef.current(props)
  })
  return ref.current
}

export default useComponent
