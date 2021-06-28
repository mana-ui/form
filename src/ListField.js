import React, { useContext, useEffect, useState } from "react"
import { Context } from "./Form"
import { join } from "./path"
import { UPDATE } from "./events"
import KEYS from "./keysSymbol"

const ListField = ({ listField, children }) => {
  const context = useContext(Context)
  const rerender = useState(0)[1]
  useEffect(() => {
    return context.store.observer.listen(
      UPDATE,
      () => {
        rerender((x) => x + 1)
      },
      listField,
    )
  })
  return listField[KEYS].map((k, i) => {
    const item = listField.extend(k, {
      getPath: (ctxPath) => {
        return join(ctxPath, listField[KEYS].indexOf(k))
      },
    })
    item.remove = () => listField.remove(i)
    return (
      <Context.Provider
        key={k}
        value={{
          ...context,
          path: item,
        }}
      >
        {children(item)}
      </Context.Provider>
    )
  })
}

export default ListField
