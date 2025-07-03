import React from "react";
import { create, act } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { Extension } from "../src/index";

describe("Component Rendering", () => {
  it("renders the extension", async () => {
    const query = "test query";

    let extension;
    act(() => {
      extension = create(<Extension query={query} visible={true} />);
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const items = extension?.root?.findAll((el: any) => !!el.props.title) ?? [];

    console.log(items.map((item: any) => item.props));

    expect(items.length).toBeGreaterThan(0);
  });
});
