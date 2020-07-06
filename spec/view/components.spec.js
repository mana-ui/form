import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../App';
import { Field } from '../../src';

const Select = ({ children, ...props}) => (
  <select {...props}>
    {children}
  </select>
)

describe("Form control component", () => {
  test("default control is `input` tag", () => {
    const {container} = render(<App><Field name="f" label="F"/></App>)
    expect(container).toContainHTML(`<div><label for="f">F <input id="f" value="a"></label></div>`);
  });
  test("customize control component", () => {
    render(<App>
      <Field name="f" label="F1" control={<Select className="custom"><option value="a">a</option></Select>} />

    </App>)
    const ctrl = screen.getByDisplayValue('a')
    expect(ctrl.tagName).toBe('SELECT')
  });
});
