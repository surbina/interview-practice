import * as React from 'react';

export default function Hooks() {
  return(
    <>
      <h1>
        Hooks
      </h1>
      <ol>
        <li>Build a useInterval hook. See Documentation [here](https://github.com/streamich/react-use/blob/master/docs/useInterval.md)</li>
        <Demo />
        <li>Build a useDebounce hook. See Documentation [here](https://github.com/streamich/react-use/blob/master/docs/useDebounce.md)</li>
        <DemoD />
      </ol>
    </>
  )
}

// second try, 15 minutes

// useInterval

const Demo = () => {
  const [count, setCount] = React.useState(0);
  const [delay, setDelay] = React.useState(1000);
  const [isRunning, toggleIsRunning] = React.useReducer(state => !state, true)

  useInterval(
    () => {
      setCount(count + 1);
    },
    isRunning ? delay : null
  );

  return (
    <div>
      <div>
        delay: <input value={delay} onChange={event => setDelay(Number(event.target.value))} />
      </div>
      <h1>count: {count}</h1>
      <div>
        <button onClick={toggleIsRunning}>{isRunning ? 'stop' : 'start'}</button>
      </div>
    </div>
  );
};

function useInterval(fn, delay) {
  const fnRef = React.useRef(null);

  React.useEffect(function updateFnRef() {
    fnRef.current = fn;
  }, [fn]);

  React.useEffect(function set() {
    if (delay === null) {
      return;
    }

    function tick() {
      fnRef.current()
    }

    const intervalId = window.setInterval(tick, delay)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [delay])
}

// useDebounce

const DemoD = () => {
  const [state, setState] = React.useState('Typing stopped');
  const [val, setVal] = React.useState('');
  const [debouncedValue, setDebouncedValue] = React.useState('');

  const [, cancel] = useDebounce(
    () => {
      setState('Typing stopped');
      setDebouncedValue(val);
    },
    2000,
    [val]
  );

  return (
    <div>
      <input
        type="text"
        value={val}
        placeholder="Debounced input"
        onChange={({ currentTarget }) => {
          setState('Waiting for typing to stop...');
          setVal(currentTarget.value);
        }}
      />
      <div>{state}</div>
      <div>
        Debounced value: {debouncedValue}
        <button onClick={cancel}>Cancel debounce</button>
      </div>
    </div>
  );
};

function useDebounce(fn, ms, deps) {
  const fnRef = React.useRef();
  const isReadyRef = React.useRef(false);
  const timeoutIdRef = React.useRef(null);

  React.useEffect(function updateFnRef() {
    fnRef.current = fn;
  }, [fn]);

  React.useEffect(function set() {
    function execute() {
      fnRef.current();
      isReadyRef.current = true;
    }

    isReadyRef.current = false;
    timeoutIdRef.current = window.setTimeout(execute, ms);

    return () => {
      timeoutIdRef.current !== null && window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, [ms, ...deps]);

  const isReady = React.useCallback(() => {
    return isReadyRef.current;
  }, []);

  const cancel = React.useCallback(() => {
    timeoutIdRef.current !== null && window.clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = null;
    isReadyRef.current = null;
  }, []);

  return [isReady, cancel]
}

/* First attempt to solve this. This is as far as I got in 1 hour.
const Demo = () => {
  const [count, setCount] = React.useState(0);
  const [delay, setDelay] = React.useState(1000);
  const [isRunning, setIsRunning] = React.useState(true);

  const toggleIsRunning = () => setIsRunning(s => !s)

  // const callback = React.useCallback(function increaseCount() {
  //   console.log('increase count')
  //   setCount(count + 1);
  // }, []);
  const callback = function increaseCount() {
    console.log('increase count')
    setCount(count + 1);
  }

  useInterval(
    callback,
    isRunning ? delay : null
  );

  return (
    <div>
      <div>
        delay: <input value={delay} onChange={event => setDelay(Number(event.target.value))} />
      </div>
      <h1>count: {count}</h1>
      <div>
        <button onClick={toggleIsRunning}>{isRunning ? 'stop' : 'start'}</button>
      </div>
    </div>
  );
};

function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  React.useEffect(() => {
    savedCallback.current = callback;
  });

  React.useEffect(() => {
    if (delay === null) {
      return 
    }

    function tick() {
      savedCallback.current();
    }

    const intervalId = window.setInterval(tick, delay)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [callback, delay]);
}


const DemoD = () => {
  const [state, setState] = React.useState('Typing stopped');
  const [val, setVal] = React.useState('');
  const [debouncedValue, setDebouncedValue] = React.useState('');

  const [, cancel] = useDebounce(
    () => {
      setState('Typing stopped');
      setDebouncedValue(val);
    },
    2000,
    [val]
  );

  return (
    <div>
      <input
        type="text"
        value={val}
        placeholder="Debounced input"
        onChange={({ currentTarget }) => {
          setState('Waiting for typing to stop...');
          setVal(currentTarget.value);
        }}
      />
      <div>{state}</div>
      <div>
        Debounced value: {debouncedValue}
        <button onClick={cancel}>Cancel debounce</button>
      </div>
    </div>
  );
};

function useDebounce(fn, ms, deps) {
  const [isReady, setIsReady] = React.useState(false); // false, true, null
  const timeoutIdRef = React.useRef(null)

  const clearTimeout = React.useCallback(() => {
    timeoutIdRef.current !== null && window.clearTimeout(timeoutIdRef.current)
  }, [])

  React.useEffect(() => {
    if (isReady === null) {
      return
    }

    const tick = () => {
      fn()
      setIsReady(true)
    };

    setIsReady(false)
    timeoutIdRef.current = window.setTimeout(tick, ms)

    return clearTimeout;
  }, [fn, ms, ...deps]);

  return [
    () => isReady,
    () => {
      clearTimeout();
      setIsReady(null);
    }
  ];
}
*/
