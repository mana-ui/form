import React, { useState } from 'react'
import { Form } from '../src';

const App = ({ children, rules }) => {
    const [value, setValue] = useState({ f: "a" });
    return (
      <Form
        rules={rules}
        value={value}
        setValue={(v) => {
          setValue(v);
        }}
        fieldRender={({ Control, Label, ErrorMessage }) => (
          <>
            <Label>
              <Control />
            </Label>
            <ErrorMessage />
          </>
        )}
      >
        {() => children}
      </Form>
    );
  };

export default App