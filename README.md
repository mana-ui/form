# form

|                  | component | value | onChange | extra props |
| :--------------- | :-------- | :---- | :------- | :---------- |
| none             | no        | no    | no       | no          |
| component        | yes       | no    | no       | no          |
| element children | yes       | no    | no       | yes         |
| render children  | yes       | yes   | yes      | yes         |
| layout render    | yes       | yes   | yes      | yes         |

# Features

Mana form handles four aspects of forms: view & update, validation and submit.

- view & update: get values show in each fields with correct controls and update values correctly
- validation: validate value restrictions & show errors
- submit: complete form filling

## View & Update

1. Mana form provides default view components, and inject `value` and `onChange`:

```javascript
 <Field name="f" label="F">
// render as <div><label for="f">F <input id="f" value="a"></label></div>
```

value is fetched by name or path, onChange is same as plain `input` onChange prop

2. customize components:

You can override control component by provide control prop a react element, Field will pass `value` and `onChange` props to this react element.

```javascript
<Field
  name="a"
  label="A"
  control={
    <Select className="custom-a">
      <option value="a">a</option>
      <option value="b">b</option>
    </Select>
  }
/>
```

If your component don't receive `value` or `onChange` prop, you can use render prop function to render your component

```javascript
<Field
  name="b"
  label="B"
  control={({ get, set }) => {
    return (
      <input
        type="checkbox"
        checked={get()}
        onChange={({ target: { checked } }) => {
          set(checked)
        }}
      />
    )
  }}
/>
```

3. define form layout

Usually fields of a form have the same layout, you can define this layout by fieldRender prop of Form.

```javascript
<Form
  fieldRender={({ Control, labelElem, id }) => (
    <div className="field">
      <label htmlFor={id} >{labelElem}</label>
      <Control id={id} />
    </div>
  )}
>
  <Field name="a" label="A" />
  <Field name="b" label="B" />
</Form>

<div>
  <div class="field" >
    <label for="a">A</label>
    <input id="a" value="A" />
  </div>
  <div class="field" >
    <label for="b">B</label>
    <input id="b" value="B" />
  </div>
</div>
```

Or you can provide render to Field, which will overrides fieldRender from Form:

```javascript
const customRender = (className) => ({ Control, labelElem, id }) => (
  <div className={className}>
    <label htmlFor={id}>{labelElem}</label>
    <Control id={id} />
  </div>
)

<Form
  value={{ a: "A", b: "B" }}
  fieldRender={customRender("field-render")}
>
  <Field name="a" label="A" />
  <Field name="b" label="B" render={customRender("field-b")} />
</Form>

<div>
  <div class="field-render" >
    <label for="a" />
    <input id="a" value="A" />
  </div>
  <div class="field-b" >
    <label for="b" />
    <input id="b" value="B" />
  </div>
</div>
```

## Validation & Errors

## Submit
