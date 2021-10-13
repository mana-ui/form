# @mana-ui/form

# Features

Mana form handles four aspects of forms: data management, layout, validation and submit.

- data management: get values show in each fields with correct controls and update values correctly
- layout: how each field is rendered: include control, label and error message
- validation: validate value restrictions & show errors
- submit: complete form filling

## Data Management

1. When using mana form, an init value should be provided to useForm hook, which returns a form instance, then pass the instance to Form component:

```javascript
// init value
const form = useForm({ a: "a", b: "b" })
<Form init={form}>...</Form>
```

The form instance identity is guaranted to be stable and won't change on re-renders.

2. The form instance returned by useForm hook is useful when you want to get/set data outside of the form.

```javascript
import {useForm} from '@mana-ui/form'

// init form
const form = useForm({a: 'a', b: 'b'})
<Form init={form}>...</Form>

// get/set value by form:
form.get() // {a: 'a', b: 'b'}
form.set('updated b', 'b') // set property b a new value
form.get('b') // returns 'update b'
```

3. associate update:

When it comes to associate update, we need a way to represent the related fields, in mana form we take the concept of field ref:

```javascript
const form = useForm({})
const field = useField('a', form) // get field ref of field 'a', form is not required in a nested child of Form
<Field name={field} /> // field ref can passed to name prop
```

You should use field ref if a field is used in multiple place, rather than literal field path, field ref warns if you declare a field multiple times by literal field path:

```javascript
const field = useField('a')
<Field name="a"/> // warning: field a already exists
```

Keep use the same field ref have some advantages:

- field ref is a one-to-one map to a field
- easy to track the field by an explicit variable
- easy to change field path
- set field value programatically

Since we have field ref, we can use form.listen to subscribe source field update, and update target field:

```javascript
const App = () => {
  const form = useForm({ source: "", target: "" })
  const SOURCE = form.field("source")
  const TARGET = form.field("target")
  useEffect(() =>
    form.listen((v) => {
      TARGET.value = v // won't trigger validation
    }, SOURCE),
  )
  return (
    <Form init={form}>
      <Field name={SOURCE} label="Source" />
      <Field name={TARGET} label="Target" />
    </Form>
  )
}
```

First arg is a callback, which receives the changed value, and you can set any other fields in the callback. Listen to field a by pass fieldRef of A to second argument.

form.listen make sure A and B updates renders in same batch.

Usually the value of associate update is valid or reset to default empty. In the later case, it is annoying to yell at user to fill the required field, since it is not changed by user directly. So associate update doesn't trigger validation.

form.listen can also subscribe to any form data changes by omit second argument:

```javascript
const form = useForm({ a: "a" })
form.listen((v) => console.log(v)) // log value when data changes
```

4. useStore (DEPRECATED)

useStore is deprecated, use useForm instead

## Layout

1. Mana form provides default view components, and inject `value` and `onChange`:

```javascript
 <Field name="f" label="F">
// render as <div><label for="f">F <input id="f" value="a"></label></div>
```

value is fetched by name or path, onChange is same as plain `input` onChange prop

2. customize components:

You can override control component by providing control prop a react element, Field will pass `value` and `onChange` props to this react element.

```javascript
<Field
  name="a"
  label="A"
  control={
    <select className="custom-a">
      <option value="a">a</option>
      <option value="b">b</option>
    </select>
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

Usually fields of a form have the same layout, you can define this layout by `fieldRender` of Form.

```javascript
<Form
  fieldRender={({ Control, labelElem, id }) => (
    <div className="field">
      <label htmlFor={id} >{labelElem}</label>
      <Control id={id} />
    </div>
  )}
>
  {() => {
    <>
      <Field name="a" label="A" />
      <Field name="b" label="B" />
    </>
  }}
</Form>

// reander as:
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
  {() => (
    <>
      <Field name="a" label="A" />
      <Field name="b" label="B" render={customRender("field-b")} />
    </>
  )}
</Form>

// render as
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

You may define validators by `validators` prop, and use validators by props other than Field used props:

```javascript
<Form
  validators={{
    required: (v) => v === "" && "F is required",
  }}
  fieldRender={({ labelElem, Control, error }) => (
    <div>
      <label>{labelElem}</label>
      <div>
        <Control />
        {error}
      </div>
    </div>
  )}
>
  {() => (
    <Field
      name="f"
      label="F"
      validators={{
        maxLength: (v, max) => v.length > max && "F exceeds max length",
      }}
      required // required is not a Field used prop and it enables required rule defined in Form validators
      maxLength={5} // as the same, maxLength enables the rule of Field validator with the param 5
    />
  )}
</Form>
```

A validator is a function returns a message when a rule is not fullfilled. A validator is enabled when a prop same as the key. The validator function will be invoked with the field value as the first argument and the prop value as the second argument. Enabled validators on a Field will be called by chronological order defined on props.

You can decide how error is shown by fieldRender.

### form.valid

You may use _form.valid_ to get form validation state. It may be used to disabled submit button.

```javascript
const App = () => {
  const form = useForm({})
  return form.valid ? (
    <span>all fields valid</span>
  ) : (
    <span>some field invalid</span>
  )
}
```

## Submit

Form provides sumbit callback by children render prop, when it's called, all enabled validators get invoked, if anyone fails, onSubmit is skipped, otherwise onSubmit is called with form data.

```javascript
<Form value={{ a: "x", b: "y" }} onSubmit={({value} => {})}>
  {({ submit }) => (
    <>
      <Field name="a" label="A" />
      <Field name="b" label="B" />
      <button onClick={submit}>submit</button>
    </>
  )}
</Form>
```

## FieldSet

FieldSet is used when your form have multi-layer data structure or you need validation of multi-fields.

```javascript
// multi-layer form
<Form value={{ a: { b: "b", c: "c" } }}>
  <FieldSet name="a">
    <Field name="b" label="B" />
    <Field name="c" label="C" />
  </FieldSet>
</Form>

// multi-fields validation
<Form value={{ a: "a", b: "b" }}>
  <FieldSet
    validators={{
      same: ({ a, b }) => a !== b && "A and B should be same",
    }}
    same
  >
    {({ error }) => (
      <>
        <Field name="a" label="A" />
        <Field name="b" label="B" />
        {error}
      </>
    )}
  </FieldSet>
</Form>
```
