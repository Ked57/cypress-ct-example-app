Table of contents

- [What is Cypress Component Testing ?](#what-is-cypress-component-testing--)
- [Wrapping components to provide their external dependencies](#wrapping-components-to-provide-their-external-dependencies-)
- [Applying this concept to entire pages](#applying-this-concept-to-entire-pages--)

## What is Cypress Component Testing ? <a name="what-is-cypress"></a>

A few months ago, Cypress released their component test runner in beta. I have been using it since then, as part of a real world project, why ?

The main advantage of Cypress Component Testing over the competition is the fact that it runs in the browser, just like their end-to-end product. This is a big deal because your components will run on browsers as-well once you ship them to your users ! This alone makes writing component tests much easier for the developer because they have access to the same APIs they do when building their apps and components compared to others node-based test runners.

Today we won't talk about how to install, configure or approach the conception process of your tests, they have great documentation on the subject [here](https://docs.cypress.io/guides/component-testing/writing-your-first-component-test), but rather talk about a few of the pitfalls you might get into when getting started with Cypress Component Testing.

## Wrapping components to provide their external dependencies <a name="wrapping-components-to-provide-their-external-dependencies"></a>

Components might need external dependencies, context, props, or anything really to work properly, this is a recurrent problem for all test runners and cypress has its own way of dealing with it. Let's have an easy to understand example:

This is a simple button which will toogle a darkMode context set somewhere else in your application, it calls the hook `useDarkMode` which is defined in another folder

DarkModeSelector.tsx

```jsx
import { useDarkMode } from "../utils/useDarkMode";

export const DarkModeSelector = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  return (
    <button onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? "Switch to lightmode" : "Switch to darkmode"}
    </button>
  );
};
```

useDarkMode.tsx

```jsx
import { createContext, useContext } from "react";

const DarkModeContext = createContext(undefined);

export const DarkModeProvider = ({
  children,
  value: { darkMode, setDarkMode },
}) => (
  <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
    {children}
  </DarkModeContext.Provider>
);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};
```

If you tried to mount this component as is, you'd get this error: `useDarkMode must be used within a DarkModeProvider`, because DarkModeSelector tries to use a context that hasn't been defined prior to its mounting.

The easiest, most simple way to fix that is to define a wrapper and then wrap our component in the mount function

DarkModeSelector.cy.jsx

```jsx
const DarkModeWrapper = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
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

describe("<DarkModeSelector />", () => {
  it("mounts with a wrapper", () => {
    cy.mount(
      <DarkModeWrapper>
        <DarkModeSelector />
      </DarkModeWrapper>
    );
    cy.contains("Switch to darkmode");
  });
});
```

Good ! Now your test is passing and your component mounts.

Now you might want to pass an initial value to your context, so you can pass a setting set somewhere else in your application:

We can add an initialValue to the props of the wrapper

DarkModeSelector.cy.jsx

```jsx
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
});
```

Right now we're only checking that the component is reacting properly to changes to the dark mode context, but how do you test that the button calls `setDarkMode` properly ?
Cypress has an utility called "spy", you can find more info [here](https://docs.cypress.io/guides/guides/stubs-spies-and-clocks#Spies) and [here](https://docs.cypress.io/api/commands/spy), it allows you to capture and then assert that a function was called. Let's see how we can use it in component tests together with our wrapper:

DarkModeSelector.cy.jsx

```jsx
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
  it("mounts with a wrapper and a spy", () => {
    const [setDarkModeSpy, DarkModeWrapper] = initDarkModeWrapper();
    cy.mount(
      <DarkModeWrapper initialValue={true}>
        <DarkModeSelector />
      </DarkModeWrapper>
    );
    cy.contains("Switch to lightmode");
  });
});
```

Here we define a function which will define a spy, a wrapper that calls the spy and return them both. Right now it just tests that the component mounts with this wrapper but we can add more tests that will expect the spy to have been called with a certain value:

```jsx
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
```

```jsx
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
```

And now we can be fairly confident that when we click on the button, the context will be updated with the new value !

## Applying this concept to entire pages<a name="applying-this-concept-to-entire-pages"></a>

One of the advantages of Cypress Component Testing compared to E2E testing is its speed, it allows you to mount components and test them very quickly. In React, pages are components as well, so what's stopping you from testing pages just as we tested components in the last section ? It might get a little more complicated, but the same principles apply. Let's have an example:

Most app have routing, localization, a css framework, and data fetching. So let's use react-i18next, react-router, talwindcss and react-query.

You can find an example application with all of the files here, I'm not going to go into details of the implementation but it handles dark mode, translations and a few API calls so we can demonstrate what we need to make it work.

Let's start with the simple mount test and see what happens

ProductsByCategoryPage.cy.jsx

```jsx
import { ProductsByCategoryPage } from "../../src/pages/ProductsByCategoryPage";

describe("<ProductsByCategoryPage />", () => {
  it("mounts", () => {
    cy.mount(<ProductsByCategoryPage />);
  });
});
```

Result:

> Error: useLoaderData must be used within a data router

We get a lot of errors related to hooks not used withing context providers, as seen in the last section. We could build wrappers like before, or we could try another approach ! Let's build a custom mount command:
You can find more info/examples about custom mount commands [here](https://docs.cypress.io/guides/component-testing/custom-mount-react)
cypress/support/component.jsx

```jsx
Cypress.Commands.add("mountApplication", (component, options = {}) => {
  return mount(<ApplicationStub>{component}</ApplicationStub>, options);
});
```

Cypress already imports a custome mount function `import { mount } from "cypress/react18";`, so we're going to use it for our own mount command. Note that you need to rename `component.js` to `component.jsx` otherwise cypress will fail because there is jsx code in the file.

We can also define some options we might want to pass to the tests down the line:

cypress/support/component.jsx

```jsx
const mountApplicationDefaultOptions = {
  viewport: [1920, 1080],
  applicationStubProps: {
    darkMode: false,
    lang: "en",
    loader: () => {},
  },
};

Cypress.Commands.add("mountApplication", (component, options) => {
  const consolidatedOptions = {
    ...mountApplicationDefaultOptions,
    ...options,
  };
  cy.viewport(...consolidatedOptions.viewport);
  return mount(
    <ApplicationStub {...consolidatedOptions.applicationStubProps}>
      {component}
    </ApplicationStub>
  );
});
```

In our ApplicationStub component, we import and use every provider and css file we need to make sure the app mounts and works properly. As it is a React component the possibilities are endless

cypress/support/ApplicationStub.jsx

```jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { App } from "../../src/App";
import "../../src/i18n";
import "../../src/index.css";

export const ApplicationStub = ({ children, darkMode, lang, loader }) => {
  const router = createMemoryRouter([
    {
      path: "/",
      element: <App darkModeParameter={darkMode} />,
      children: [
        { path: "/", element: children },
        {
          path: "/:category",
          element: children,
          loader,
        },
      ],
    },
    ,
  ]);
  const { i18n } = useTranslation();
  if (lang) {
    i18n.changeLanguage(lang);
  }
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};
```

Now we can easily mount our whole page and pass default arguments like dark mode or language

ProductsByCategoryPage.cs.jsx

```jsx
import {
  loader,
  ProductsByCategoryPage,
} from "../../src/pages/ProductsByCategoryPage";

describe("<ProductsByCategoryPage />", () => {
  it("mounts", () => {
    cy.mountApplication(<ProductsByCategoryPage />, {
      applicationStubProps: { loader },
    });
    cy.contains("Switch");
  });
  it("mounts with darkMode", () => {
    cy.mountApplication(<ProductsByCategoryPage />, {
      applicationStubProps: { darkMode: true, loader },
    });
    cy.get("body").should("have.class", "bg-gray-800");
  });
  it("mounts with french language", () => {
    cy.mountApplication(<ProductsByCategoryPage />, {
      applicationStubProps: { lang: "fr", loader },
    });
    cy.contains("Passer au darkmode");
  });
});
```

You might have noted that the page calls the API during its tests, it might be fine for you but this could break your components test if the API fails and testing both your web app and your API is supposed to be done during E2E tests. So we'll add a way to stub those API calls to make sure these tests are only impacted by the webapp. To do that we're going to use Cypress' [intercept](https://docs.cypress.io/api/commands/intercept):

You could use those intercepts directly in the tests

```jsx
it("intercepts /products/categories calls", () => {
  cy.intercept("GET", "/products/categories", {
    statusCode: 200,
    body: ["electronics", "jewelery", "men's clothing", "women's clothing"],
  });
  cy.mountApplication(<ProductsByCategoryPage />, {
    applicationStubProps: { loader },
  });
});
```

But it might get quite repetitive with big pages, you could add it to the `beforeEach` handler as well

```jsx
describe("<ProductsByCategoryPage />", () => {
  beforeEach(() => {
    cy.intercept("GET", "/products/categories", {
      statusCode: 200,
      body: ["electronics", "jewelery", "men's clothing", "women's clothing"],
    });
    cy.intercept("GET", "/products", {
      statusCode: 200,
      body: [
        {
          id: 1,
          title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
          price: 109.95,
          description:
            "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
          category: "men's clothing",
          image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
          rating: { rate: 3.9, count: 120 },
        },
        ... // there might be a lot of products to stub
        {
          id: 20,
          title: "DANVOUY Womens T Shirt Casual Cotton Short",
          price: 12.99,
          description:
            "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.",
          category: "women's clothing",
          image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
          rating: { rate: 3.6, count: 145 },
        },
      ],
    });
  });
```

Or you can create json fixture files in `cypress/fixtures` and use them to declare your intercepts

```jsx
describe("<ProductsByCategoryPage />", () => {
  beforeEach(() => {
    cy.intercept("GET", "/products/categories", {
      statusCode: 200,
      body: ["electronics", "jewelery", "men's clothing", "women's clothing"],
    });
    cy.intercept("GET", "/products", {
      statusCode: 200,
      fixture: "products.json",
    });
  });
  it("intercepts all the calls", () => {
    cy.mountApplication(<ProductsByCategoryPage />, {
      applicationStubProps: { loader },
    });
  });
});
```

I hope this article was helpful, I tried to compile some of the hurdles I went through while learning Cypress Component Testing. The example app is not perfect but should help get an idea of how to test components and whole pages with this tool.

I want to thanks the Cypress Team for helping me understanding this, you can join the discussions on [Discord](https://discord.com/invite/cMjUZg7) and all of the documentation [here](https://docs.cypress.io/) 

You can find me on [Github](https://github.com/Ked57) and on [Twitter](https://twitter.com/ClementFassot)