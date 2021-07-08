import * as preact from "preact";
import renderToString from "preact-render-to-string";
import * as hooks from "preact/hooks";
import usePromise from "react-promise-suspense";
import ssrPrepass from "preact-ssr-prepass";

const context = preact.createContext({ value: "value" });

const Provider = context.Provider

run().then(console.log)

async function run() {
  //await sequential() // ok
  await parallel() // not ok
}

async function sequential() {
  const res1 = await render(1)
  const res2 = await render(2) 
  console.log([res1, res2])
}

async function parallel() {
  const res = await Promise.all([
    render(1), 
    render(2), 
  ])
  console.log(res)
}

async function render(id: number) {
  const element = <Provider value={{ value: 'foo' }}>
      <Item id={id}/>
  </Provider>

  console.log('before prepass', id)
  await ssrPrepass(element)
  console.log('after prepass', id)

  console.log('before render', id)
  const string = renderToString(element)
  console.log('after render', id)

  return string;
}

function Item({ id }: {id: number }) {
  const value = usePromiseAndContext(id)
  return <>{value}</>
}

function usePromiseAndContext(id: number) {
  const contextValue = hooks.useContext(context)

  return usePromise(async () => {
    await new Promise((res, rej) => setTimeout(res))
    return contextValue.value
  }, [id]);
}
