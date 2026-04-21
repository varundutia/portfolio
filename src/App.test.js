import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders selected work section", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", {
      name: /three shipped systems that should anchor your portfolio/i,
    })
  ).toBeTruthy();
});
