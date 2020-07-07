import React, { useState } from 'react'
import { Form } from '../src';

const App = ({ children, rules, initValue= { f: "a" } }) => {
    const [value, setValue] = useState(initValue);
    return (
      <Form
        rules={rules}
        value={value}
        setValue={(v) => {
          setValue(v);
        }}
      >
        {() => children}
      </Form>
    );
  };

export default App