/////////////////////////////////////////
/// Pre-baked Components & Packages
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components
import App from './App';
import registerServiceWorker from './registerServiceWorker';

/////////////////////////////////////////
/// Images & Styles
import './index.css';

/////////////////////////////////////////
/// Code

render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,

	document.getElementById('root')
);
registerServiceWorker();
