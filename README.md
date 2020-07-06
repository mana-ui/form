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

```javascript
<Field
  name="f"
  label="F"
  control={<MyControl {...customProps} />}
/>
```

3. define form layout

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
    <Field name="a" label="A"/>
    <Field name="b" label="B"/>
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
