import { describe,it,expect } from "vitest";
import { fireEvent, render,screen } from "@testing-library/react";
import { TodoContainer } from "./TodoContainer";

describe("TodoContainer",()=>{
    it("TodoInputとTodoListが表示される",()=>{
        render(<TodoContainer/>);
        expect(screen.getByPlaceholderText("新しいTODOを入力")).toBeInTheDocument();
    })
    it("TodoInputで追加ボタンを押すと新しいTODOが表示される",()=>{
        render(<TodoContainer/>);
        const input=screen.getByPlaceholderText("新しいTODOを入力");
        fireEvent.change(input,{target:{value:"新しいタスク"}});
        const button=screen.getByText("追加");
        fireEvent.click(button);
        expect(screen.getByText("新しいタスク")).toBeInTheDocument();
    })
    it("TodoListでタスクを削除できる",()=>{
        render(<TodoContainer/>);
        const input=screen.getByPlaceholderText("新しいTODOを入力");
        fireEvent.change(input,{target:{value:"新しいタスク"}});
        const button=screen.getByText("追加");
        fireEvent.click(button);
        const deleteButton=screen.getByText("削除");
        fireEvent.click(deleteButton);
        expect(screen.queryByText("新しいタスク")).not.toBeInTheDocument();
    })
    it("TodoListでタスクを編集できる",()=>{
        render(<TodoContainer/>);
        const input=screen.getByPlaceholderText("新しいTODOを入力");
        fireEvent.change(input,{target:{value:"新しいタスク"}});
        const button=screen.getByText("追加");
        fireEvent.click(button);
        const editButton=screen.getByText("編集");
        fireEvent.click(editButton);

        const editInput=screen.getByPlaceholderText("編集するTODOを入力");
        fireEvent.change(editInput,{target:{value:"編集されたタスク"}});
        const updateButton=screen.getByText("保存");
        fireEvent.click(updateButton);
        expect(screen.getByText("編集されたタスク")).toBeInTheDocument();

    })

    it("TodoListでタスクを完了できる",()=>{
        render(<TodoContainer/>);
        const input=screen.getByPlaceholderText("新しいTODOを入力");
        fireEvent.change(input,{target:{value:"新しいタスク"}});
        const button=screen.getByText("追加");
        fireEvent.click(button);
        const todo=screen.getByText("新しいタスク");
        fireEvent.click(todo);
        expect(screen.getByText("新しいタスク")).toHaveClass("line-through");
    })


})
