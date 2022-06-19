// React Context - Consuming Multiple Contexts
// To keep context re-rendering fast, React needs to make each context consumer a separate node in the tree.
// If two or more context values are often used together, you might want to consider creating your own render prop component that provides both.
// source: https://reactjs.org/docs/context.html#consuming-multiple-contexts

// ReactContextProvider a component that will call from App.js to set global state in app root

import React, { useEffect, useState } from 'react';
import { FilterContext } from './ReactContext';

const ReactContextProvider = (props) => {
   // GET LOCAL STORAGE DATA
  const [filterDefault, setFilterDefault] = useState([]);
  const [filterValue, setFilterValue] = useState([]);

  // useEffect(() => {
  //   console.log('ReactContextProvider', filterValue);
  // }, [filterValue])

  return (
    <FilterContext.Provider value={{
      filterDefault: filterDefault,
      setFilterDefault: (value) => setFilterDefault(value),
      filterValue: filterValue,
      setFilterValue: (value) => setFilterValue(value)
    }}>
      {props.children}
    </FilterContext.Provider>
  );
}

export default ReactContextProvider;
