# form

|                  | component | value | onChange | extra props |
| :--------------- | :-------- | :---- | :------- | :---------- |
| none             | no        | no    | no       | no          |
| component        | yes       | no    | no       | no          |
| element children | yes       | no    | no       | yes         |
| render children  | yes       | yes   | yes      | yes         |
| layout render    | yes       | yes   | yes      | yes         |

# Features

Mana form handles four aspects of forms: view, update, validation and submit.

- view: get values show in each fields with correct controls
- update: update values
- validation: validate value restrictions & show errors
- submit: complete form filling

## View

### components

1. Mana form provides default view components:

```javascript
 <Field name="f" label="F">
// render as <div><label for="f">F <input id="f" value="a"></label></div>
```

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
          set(checked);
        }}
      />
    );
  }}
/>
```

3. define form layout

Usually fields of a form have the same layout, you can define this layout by fieldRender prop of Form.

```javascript
<Form
  fieldRender={({ Control, Label, HelperText, id }) => (
    <div className="field">
      <Label htmlFor={id} />
      <Control id={id} />
      <HelperText />
    </div>
  )}
>
  <Field name="a" label="A" />
  <Field name="b" label="B" />
</Form>
```

### Pass value to control

1.  pass value to Field by name:

```javascript
  <Field name="f">
```

2.  pass value to Field

## Update

## Validation & Errors

## Submit
