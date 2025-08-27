import { describe,it,expect } from "vitest";
import { render,screen } from "@testing-library/react";
import { CountDisplay } from "./CountDisplay";

describe("CountDisplay",()=>{
    const sampleCount:number=10;
    it("カウントが表示される",()=>{
        render(<CountDisplay count={sampleCount}/>);
        expect(screen.getByText("10")).toBeInTheDocument();
    })
})
