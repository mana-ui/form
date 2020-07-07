import React, { useContext } from 'react'
import { Context } from './Form'

const FieldSet = ({children, name}) => {
   const context = useContext(Context)
  return (
      <Context.Provider value={{...context, path: [name]}}>
          {children}
      </Context.Provider>
  )
}

export default FieldSet