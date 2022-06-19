// React Context - Consuming Multiple Contexts
// To keep context re-rendering fast, React needs to make each context consumer a separate node in the tree.
// If two or more context values are often used together, you might want to consider creating your own render prop component that provides both.
// source: https://reactjs.org/docs/context.html#consuming-multiple-contexts

// this is React Context init

import React from 'react';
const FilterContext = React.createContext();
export { FilterContext };
