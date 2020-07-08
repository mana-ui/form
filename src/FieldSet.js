import React, { useContext } from "react"
import { Context } from "./Form"
import { join } from "path"

const FieldSet = ({ children, name }) => {
  const ctx = useContext(Context)
  return (
    <Context.Provider value={{ ...ctx, path: join(ctx.path, name) }}>
      {children}
    </Context.Provider>
  )
}

export default FieldSet
