// src/features/todo/components/__tests__/EchoInput.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { EchoInput } from "./EchoInput";
import { it,describe,expect,vi } from "vitest";

describe("EchoInput", () => {
  it("入力した文字を表示する", () => {
    render(<EchoInput onEcho={() => {}} />);
    const input = screen.getByPlaceholderText("新しいEchoを入力");
    fireEvent.change(input, { target: { value: "買い物" } });
    expect((input as HTMLInputElement).value).toBe("買い物");
  });

  it("ボタンを押すとonEchoが呼ばれる", () => {
    //arrage
    const handleEcho=vi.fn();
    render(<EchoInput onEcho={handleEcho} />)
    // act
    const input = screen.getByPlaceholderText("新しいEchoを入力");
    fireEvent.change(input,{target:{value:"hoge"}})
    const button=screen.getByRole("button",{name:/Echo/i})
    fireEvent.click(button)

    expect(handleEcho).toBeCalled();

  });


  it("追加後に入力欄が空になる", () => {
    // act
    render(<EchoInput onEcho={()=>{}} />)
    // arrange
    const input = screen.getByPlaceholderText("新しいEchoを入力");
    fireEvent.change(input,{target:{value:"hoge"}})
    const button=screen.getByRole("button",{name:/Echo/i})
    fireEvent.click(button)
    // assert
    expect((input as HTMLInputElement).value).toBe("")

  });
});
