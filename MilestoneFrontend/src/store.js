import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from './reducers';
import thunk from 'redux-thunk';

const loggerMiddleware = createLogger();
const middleware = applyMiddleware(thunkMiddleware, loggerMiddleware);

// export default function configureStore(preloadedState) {
//   return createStore(
//     reducers,
//     preloadedState,
//     applyMiddleware(
//       thunkMiddleware,
//       loggerMiddleware
//     )
//   )
// }

export default createStore(reducer, middleware) 
