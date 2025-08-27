# TDDProcedure

## MyConcept

1. UI 作成
1. Component に分離
1. 実装する機能を考える
1. 持つべきデータを考える
1. 各コンポーネントが持つべき機能とデータを決める
1. テストを書く
1. 実装する
1. CSS 適用

## PlanTheDesign

- TodoApp を作るぞ
- TodoApp の UI を作る

## DetailedDesign

### Component に分ける

- TodoList
  - Todo
- TodoInput

### Function を考える

- TodoList の表示
- Todo 追加
- Todo の削除
- Todo の編集
  - Todo のテキスト編集
  - Todo を Done にする

### Data を考える

- Todo
  - Id
  - Text
  - IsDone
- Todos
  - Todo[]

### Component と FunctionData をくっつける

- TodoList

  - Data: Todos
  - Func: ShowTodoList

- Todo

  - Data: Todo
  - Func: DeleteTodo,EditTodo,ToggleTodo

- TodoInput
  - Data: Text
  - Func: AddTodo

## WritingTest

### import

```cmd
npm install
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Funcs

```ts
// src/features/todo/hooks/__tests__/useTodos.test.ts
import { renderHook, act } from "@testing-library/react";
import { useTodos } from "./useTodos";
import { it,expect,describe  } from "vitest";

// result.current.
  // todos,addTodo,deleteTodo,toggleTodo

describe("useTodos", () => {
  it("初期状態ではtodosは空", () => {
    //
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it("addTodoで新しいTodoが追加される", () => {
    // arrange
    const {result} = renderHook(()=>useTodos());

    // act
    // act 内でのみState変更が行える
    act(()=>{
      result.current.addTodo("hoge")
    })

    // arrange
    expect(result.current.todos[0].text).toBe("hoge")
  });
```

```ts
// src/features/todo/hooks/useTodos.ts
import { useState } from "react";
import type { Todo } from "../types/todo";

// useTodosでは
// state todos や　todoにかかわる操作を他でも使えるようにする
// そしてそれをexport するのだ
export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      done: false,
    };
    // これまでのTodos+newTodo
    setTodos((prev) => [...prev, newTodo]);
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };
  const editTodoText = (id: number, newTodoText: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: newTodoText } : todo
      )
    );
  };

  return {
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodoText,
  };
};
```

### Todo

```ts
// src/features/todo/components/Todo.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Todo } from "./Todo";

describe("Todo", () => {
  const sample = {
    id: 1,
    text: "散歩する",
    done: false,
  };

  // 初期表示
  it("テキストが表示される", () => {
    render(
      <Todo
        todo={sample}
        onDelete={() => {}}
        onToggle={() => {}}
        onEdit={()=>{}}
      />
    );
    expect(screen.getByText("散歩する")).toBeInTheDocument();
  });

  // 関数が呼ばれているか？
  it("削除ボタンを押すとonDeleteが呼ばれる", () => {
    const handleDelete = vi.fn();
    render(
      <Todo
        todo={sample}
        onDelete={handleDelete}
        onToggle={() => {}}
        onEdit={()=>{}}
      />
    );

    const btn = screen.getByRole("button", { name: /削除/i });
    fireEvent.click(btn);

    expect(handleDelete).toHaveBeenCalledWith(1);
  });
  ...
```

```ts
// src/features/todo/components/Todo.tsx
import { useState } from "react";
import type { Todo as TodoType } from "../types/todo";

// 受ける値をPropsで定義
type Props = {
  todo: TodoType;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
};

export const Todo = ({ todo, onDelete, onToggle, onEdit }: Props) => {
  // この画面だけで使うステータスを定義
  // このTodoが修正中か？　修正中のテキスト
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  // 編集についてはこのコンポーネントで完結するのでこのメソッドはここに書くのだ
  const handleEditSubmit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      // 編集≒Todosを書き換える作業である→TodoListに処理を移管するべきである
      onEdit(todo.id, trimmed);
    }
    setIsEditing(false);
  };

  // Cancelも同様
  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <>
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
          />
          <button onClick={handleEditSubmit}>保存</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <span
            onClick={() => onToggle(todo.id)}
            style={{
              textDecoration: todo.done ? "line-through" : "none",
              cursor: "pointer",
              marginRight: "1rem",
            }}
          >
            {todo.text}
          </span>
          <button onClick={() => setIsEditing(true)}>編集</button>
          <button onClick={() => onDelete(todo.id)}>削除</button>
        </>
      )}
    </div>
  );
};
```

### TodoList

```ts
describe("TodoList", () => {
  const sampleTodos: Todo[] = [
    { id: 1, text: "ランニング", done: false },
    { id: 2, text: "読書", done: true },
  ];

  it("todosが表示される", () => {
    render(
      <TodoList
        todos={sampleTodos}
        onDelete={() => {}}
        onToggle={() => {}}
        onEdit={()=>{}}
      />
    );

    expect(screen.getByText("ランニング")).toBeInTheDocument();
    expect(screen.getByText("読書")).toBeInTheDocument();
  });
```

```ts
// src/features/todo/components/TodoList.tsx
import { Todo } from "./Todo";
import type { Todo as TodoType } from "../types/todo";

type Props = {
  todos: TodoType[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
};

export const TodoList = ({ todos, onDelete, onToggle, onEdit }: Props) => {
  if (todos.length === 0) {
    return <p>TODOがありません</p>;
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <Todo
            todo={todo}
            onDelete={onDelete}
            onToggle={onToggle}
            onEdit={onEdit}
          />
        </li>
      ))}
    </ul>
  );
};
```

### TodoInput

```ts
// src/features/todo/components/TodoInput.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoInput } from "./TodoInput";
import { it, describe, expect, vi } from "vitest";

describe("TodoInput", () => {
  it("入力した文字を表示する", () => {
    render(<TodoInput onAdd={() => {}} />);
    const input = screen.getByPlaceholderText("新しいTODOを入力");

    fireEvent.change(input, { target: { value: "買い物" } });

    expect((input as HTMLInputElement).value).toBe("買い物");
  });

  it("ボタンを押すとonAddが呼ばれる", () => {
    //arrage
    const handleAdd = vi.fn();
    render(<TodoInput onAdd={handleAdd} />);
    // act
    const input = screen.getByPlaceholderText("新しいTODOを入力");
    fireEvent.change(input, { target: { value: "hoge" } });
    const button = screen.getByRole("button", { name: /追加/i });
    fireEvent.click(button);

    expect(handleAdd).toBeCalled();
  });

  it("空文字ではonAddが呼ばれない", () => {
    const handleAdd = vi.fn();
    render(<TodoInput onAdd={handleAdd} />);

    const button = screen.getByRole("button", { name: /追加/i });
    fireEvent.click(button);

    expect(handleAdd).not.toHaveBeenCalled();
  });

  it("追加後に入力欄が空になる", () => {
    // act
    render(<TodoInput onAdd={() => {}} />);
    // arrange
    const input = screen.getByPlaceholderText("新しいTODOを入力");
    fireEvent.change(input, { target: { value: "hoge" } });
    const button = screen.getByRole("button", { name: /追加/i });
    fireEvent.click(button);
    // assert
    expect((input as HTMLInputElement).value).toBe("");
  });
});
```

```ts
// src/features/todo/components/TodoInput.tsx
import { useState } from "react";

type Props = {
  onAdd: (text: string) => void;
};

export const TodoInput = ({ onAdd }: Props) => {
  //
  const [text, setText] = useState("");

  // ボタンを押しての操作はこのコンポーネントで完結する
  // stateとかの変更があるが親に任せる
  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    onAdd(trimmed);
    setText("");
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        placeholder="新しいTODOを入力"
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSubmit}>追加</button>
    </div>
  );
};
```

### APP

```ts
// src/App.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { App } from "./App";

describe("App", () => {
  it("Todoの追加・表示・削除ができる", () => {
    render(<App />);

    const input = screen.getByPlaceholderText("新しいTODOを入力");
    const button = screen.getByRole("button", { name: "追加" });

    // 入力 & 追加
    fireEvent.change(input, { target: { value: "勉強" } });
    fireEvent.click(button);

    // 表示される
    expect(screen.getByText("勉強")).toBeInTheDocument();

    // 削除する
    const deleteButton = screen.getByRole("button", { name: "削除" });
    fireEvent.click(deleteButton);

    // 表示されなくなる
    expect(screen.queryByText("勉強")).not.toBeInTheDocument();
  });
});
```

```ts
// src/App.tsx
import { TodoInput } from "./features/todo/components/TodoInput";
import { TodoList } from "./features/todo/components/TodoList";
import { useTodos } from "./features/todo/hooks/useTodos";

export const App = () => {
  const { todos, addTodo, deleteTodo, toggleTodo } = useTodos();

  return (
    <div>
      <h1>Todoアプリ</h1>
      <TodoInput onAdd={addTodo} />
      <TodoList todos={todos} onDelete={deleteTodo} onToggle={toggleTodo} />
    </div>
  );
};
```

### CSS

#### Todo

```css
/* Todo.module.css */
.todo {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.todoText {
  margin-right: 1rem;
  cursor: pointer;
}

.done {
  text-decoration: line-through;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
```

```ts
// Todo.tsx
return (
  <div className={styles.todo}>
    {isEditing ? (
      <>
        <input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
        />
        <div className={styles.actions}>
          <button onClick={handleEditSubmit}>保存</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </>
    ) : (
      <>
        <span
          onClick={() => onToggle(todo.id)}
          className={`${styles.todoText} ${todo.done ? styles.done : ""}`}
        >
          {todo.text}
        </span>
        <div className={styles.actions}>
          <button onClick={() => setIsEditing(true)}>編集</button>
          <button onClick={() => onDelete(todo.id)}>削除</button>
        </div>
      </>
    )}
  </div>
);
```

### Components

```ts
// Todo.tsx
return (
  ...
  <>
    <span
      onClick={() => onToggle(todo.id)}
      className={`${styles.todoText} ${todo.done ? styles.done : ""}`}
    >
      {todo.text}
    </span>
    <div className={styles.actions}>
    // Button variant
      <Button variant="primary" onClick={() => setIsEditing(true)}>
        編集
      </Button>
      <Button variant="danger" onClick={() => onDelete(todo.id)}>
        削除
      </Button>
    </div>
  </>
);
```

```ts
// src/components/button/button.tsx
import type { ButtonHTMLAttributes } from "react";
import styles from "./button.module.css";

type Variant = "primary" | "secondary" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export const Button = ({ children, variant = "primary", ...props }: Props) => {
  return (
    <button className={`${styles.button} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
};
```

```css
// src/components/button/button.module.css
.button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  color: white;
}

.primary {
  background-color: #3182ce;
}
.primary:hover {
  background-color: #2b6cb0;
}

.secondary {
  background-color: #718096;
}
.secondary:hover {
  background-color: #4a5568;
}

.danger {
  background-color: #e53e3e;
}
.danger:hover {
  background-color: #c53030;
}
```
