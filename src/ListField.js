import React, { useContext, useEffect } from "react"
import { Context } from "./Form"
import { join } from "./path"
import KEYS from "./keysSymbol"
import { SUBMIT_VALIDATE } from "./events"

const ListField = ({ listField, children }) => {
  const context = useContext(Context)
  const items = listField[KEYS].map((k, i) => {
    const item = listField.extend(k, {
      getPath: (ctxPath) => {
        return join(ctxPath, listField[KEYS].indexOf(k))
      },
    })
    item.key = k
    item.remove = () => listField.remove(i)
    return item
  })
  const handleSubmit = () =>
    Promise.all(
      items.map((item) => context.store.observer.emit(SUBMIT_VALIDATE, item)),
    )

  useEffect(() =>
    context.store.observer.listen(SUBMIT_VALIDATE, handleSubmit, context.path),
  )
  return items.map((item) => {
    return (
      <Context.Provider
        key={item.key}
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
