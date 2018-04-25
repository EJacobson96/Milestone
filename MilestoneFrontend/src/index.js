/////////////////////////////////////////
/// Pre-baked Components & Packages
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

/////////////////////////////////////////
/// Standard Components
import App from './App';
import store from './store';
import registerServiceWorker from './registerServiceWorker';

/////////////////////////////////////////
/// Images & Styles
import './css/index.css';

/////////////////////////////////////////
/// Code

render(
	<BrowserRouter>
		<Provider store={store} > 
			<App />
		</Provider>
	</BrowserRouter>,

	document.getElementById('root')
);
registerServiceWorker();
