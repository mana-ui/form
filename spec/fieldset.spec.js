import React from 'react'
import { render } from "@testing-library/react"
import App from "./App"
import { FieldSet, Field } from "../src"
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('FieldSet', () => {
    test('multi layer form', async () => {
        const onChange = jest.fn()
        render(
            <App initValue={{a: {b: 'b'}}} onChange={onChange}>
                <FieldSet name="a">
                    <Field name="b" label="B"/>
                </FieldSet>
            </App>
        )
        const inputB = screen.getByLabelText('B')
        expect(inputB).toHaveValue('b')
        await userEvent.type(inputB, '{backspace}hello')
        expect(inputB).toHaveValue('hello')
        expect(onChange).toHaveBeenLastCalledWith({a: {b: 'hello'}})
    })
})