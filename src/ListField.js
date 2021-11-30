import React, { useContext, useEffect } from "react"
import { Context } from "./Form"
import { join } from "./path"
import KEYS from "./keysSymbol"
import { SUBMIT_VALIDATE, VALIDATE } from "./events"

const ListField = ({ listField, children }) => {
  const context = useContext(Context)
  const items = listField[KEYS].map((k, i) => {
    const item = listField.extend(k, {
      getPath: (ctxPath) => {
        return join(ctxPath, listField[KEYS].indexOf(k))
      },
    })
    item.remove = () => listField.remove(i)
    return item
  })
  const handleSubmit = () =>
    Promise.all(
      items.map((item) => context.store.observer.emit(SUBMIT_VALIDATE, item)),
    )

  const { observer } = context.store
  useEffect(() => observer.listen(SUBMIT_VALIDATE, handleSubmit, context.path))
  useEffect(() => {
    const unsubs = items.map((item) =>
      observer.listen(
        VALIDATE,
        (childError) => observer.emit(VALIDATE, listField, childError),
        item,
      ),
    )
    return () => {
      for (const unsub of unsubs) {
        unsub()
      }
    }
  })
  return items.map((item, i) => {
    return (
      <Context.Provider
        key={item.name}
        value={{
          ...context,
          path: item,
        }}
      >
        {children(item, i)}
      </Context.Provider>
    )
  })
}

export default ListField
