import * as preact from "preact";
import renderToString from "preact-render-to-string";
import * as hooks from "preact/hooks";
import usePromise from "react-promise-suspense";
import ssrPrepass from "preact-ssr-prepass";

const context = preact.createContext({ value: "value" });

const Provider = context.Provider

Promise.all([
  render(1, content(1), { value: String(1) }), 
  render(2, content(2), { value: String(2) }), 
]).then(console.log);

async function render(id: number, content: preact.ComponentChildren, value: { value:string }) {
  const element = <Provider value={value}>
      {content}
  </Provider>

  await ssrPrepass(element);

  const string = renderToString(element);

  return string;
}

function content(id: number) {
  return (
    <div>
      <Item id={id} />
    </div>
  );
}

function Item({ id }: {id: number }) {
  const value = useLongAsync(id);
  return <div>{value}</div>;
}

function useLongAsync(id: number) {
  const contextValue = hooks.useContext(context);


  return usePromise(async () => {
    const wait = 1000 * 10 * Math.random();
    await new Promise((res, rej) => setTimeout(res, wait));
    return contextValue.value;
  }, [id]);
}
