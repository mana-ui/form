import React, { useContext, useEffect, useState } from "react"
import { Context } from "./Form"
import { join } from "./path"
import { UPDATE } from "./events"

const ListField = ({ field, children }) => {
  const context = useContext(Context)
  const rerender = useState(0)[1]
  useEffect(() => {
    return context.store.observer.listen(
      UPDATE,
      () => {
        rerender((x) => x + 1)
      },
      field,
    )
  })
  return field.map((k, i) => (
    <Context.Provider
      key={k}
      value={{
        ...context,
        path: field.extend(k, {
          getPath: (ctxPath) => {
            return join(ctxPath, field.keys.indexOf(k))
          },
        }),
      }}
    >
      {React.cloneElement(children, {
        ...children.props,
        remove: () => field.remove(i),
      })}
    </Context.Provider>
  ))
}

export default ListField
