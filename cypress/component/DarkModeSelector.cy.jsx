import { useState } from "react";
import { DarkModeSelector } from "../../src/components/DarkModeSelector";
import { DarkModeProvider } from "../../src/utils/useDarkMode";

const DarkModeWrapper = ({ children, initialValue }) => {
  const [darkMode, setDarkMode] = useState(initialValue || false);
  return (
    <DarkModeProvider
      value={{
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </DarkModeProvider>
  );
};

const initDarkModeWrapper = () => {
  const setDarkModeSpy = cy.spy();
  const DarkModeWrapper = ({ children, initialValue }) => {
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
        {children}
      </DarkModeProvider>
    );
  };
  return [setDarkModeSpy, DarkModeWrapper];
};

describe("<DarkModeSelector />", () => {
  it("mounts with a wrapper", () => {
    cy.mount(
      <DarkModeWrapper>
        <DarkModeSelector />
      </DarkModeWrapper>
    );
    cy.contains("Switch to darkmode");
  });
  it("renders the 'Switch to lightmode' label when initiated with darkmode=true value", () => {
    cy.mount(
      <DarkModeWrapper initialValue={true}>
        <DarkModeSelector />
      </DarkModeWrapper>
    );
    cy.contains("Switch to lightmode");
  });
  it("renders the 'Switch to darkmode' label when initiated with darkmode=false value", () => {
    cy.mount(
      <DarkModeWrapper initialValue={false}>
        <DarkModeSelector />
      </DarkModeWrapper>
    );
    cy.contains("Switch to darkmode");
  });
  it("mounts with a wrapper and a spy", () => {
    const [setDarkModeSpy, DarkModeWrapper] = initDarkModeWrapper();
    cy.mount(
      <DarkModeWrapper initialValue={true}>
        <DarkModeSelector />
      </DarkModeWrapper>
    );
    cy.contains("Switch to lightmode");
  });
  it("changes context value to 'true' once clicked when initiated with darkmode=false value", () => {
    const [setDarkModeSpy, DarkModeWrapper] = initDarkModeWrapper();
    cy.mount(
      <DarkModeWrapper initialValue={false}>
        <DarkModeSelector />
      </DarkModeWrapper>
    );
    cy.get("button")
      .click()
      .then(() => expect(setDarkModeSpy).to.have.been.calledWith(true));
  });
  it("changes context value to 'false' once clicked when initiated with darkmode=true value", () => {
    const [setDarkModeSpy, DarkModeWrapper] = initDarkModeWrapper();
    cy.mount(
      <DarkModeWrapper initialValue={true}>
        <DarkModeSelector />
      </DarkModeWrapper>
    );
    cy.get("button")
      .click()
      .then(() => expect(setDarkModeSpy).to.have.been.calledWith(false));
  });
});
