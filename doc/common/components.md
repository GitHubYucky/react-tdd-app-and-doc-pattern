# CommonComponent

ボタンとかインプットとかの共通コンポーネントを用意してます

# Components

- Button
- Input
- Listbox

# How to Use

## Button

```tsx
import { Button } from "@/components/button/button";

<Button type="submit" disabled={disabled}>
  Search
</Button>;
```

## Input

```tsx
import { Input } from "@/components/input/input";
<Input
  type="text"
  // use this on test
  placeholder="Search CoffeeTitle..."
  // current value
  value={title}
  // action
  onChange={(e) => setTitle(e.target.value)}
  // negation
  disabled={disabled}
/>;
```

## Listbox

```tsx
<ListBox
  //selected value
  value={type}
  //action
  onChange={(e) => setType(e.target.value as "hot" | "iced")}
  //negation
  disabled={disabled}
  className="w-full" // 横幅は親の200pxにフィット
>
  // children
  <option value="hot">hot</option>
  <option value="iced">iced</option>
</ListBox>
```
