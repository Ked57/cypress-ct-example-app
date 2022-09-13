import { useState } from "react";
import { DarkModeSelector } from "../../src/components/DarkModeSelector";
import { DarkModeProvider } from "../../src/utils/useDarkMode";

const initWrapper = (initialValue, props) => {
  const setDarkModeSpy = cy.spy();
  const ComboboxWrapper = () => {
    const [darkMode, setDarkMode] = useState(initialValue);
    return (
      <DarkModeProvider
        value={{
          darkMode,
          setDarkMode: (value) => {
            setDarkMode(value);
            setDarkModeSpy(value);
          },
        }}
      >
        <DarkModeSelector {...props} />
      </DarkModeProvider>
    );
  };
  return [setDarkModeSpy, ComboboxWrapper];
};

describe("<DarkModeSelector />", () => {
  it("mounts", () => {
    const [_, DarkModeSelector] = initWrapper(false);
    cy.mount(<DarkModeSelector />);
    cy.get("button").should("exist");
  });
  it("renders the 'Switch to lightmode' label when initiated with darkmode=true value", () => {
    const [_, DarkModeSelector] = initWrapper(true);
    cy.mount(<DarkModeSelector />);
    cy.contains("Switch to lightmode").should("exist");
  });
  it("changes display value to 'Switch to lightmode' once clicked when initiated with darkmode=false value", () => {
    const [_, DarkModeSelector] = initWrapper(false);
    cy.mount(<DarkModeSelector />);
    cy.get("button").click();
    cy.contains("Switch to lightmode").should("exist");
  });
  it("changes context value to 'Switch to lightmode' once clicked when initiated with darkmode=false value", () => {
    const [setDarkModeSpy, DarkModeSelector] = initWrapper(false);
    cy.mount(<DarkModeSelector />);
    cy.get("button")
      .click()
      .then(() => expect(setDarkModeSpy).to.have.been.calledWith(true));
  });
  it("changes display value to 'Switch to darkmode' once clicked when initiated with darkmode=true value", () => {
    const [_, DarkModeSelector] = initWrapper(false);
    cy.mount(<DarkModeSelector />);
    cy.get("button").click();
    cy.contains("Switch to lightmode").should("exist");
  });
  it("changes context value to 'Switch to darkmode' once clicked when initiated with darkmode=true value", () => {
    const [setDarkModeSpy, DarkModeSelector] = initWrapper(false);
    cy.mount(<DarkModeSelector />);
    cy.get("button")
      .click()
      .then(() => expect(setDarkModeSpy).to.have.been.calledWith(true));
  });
});
