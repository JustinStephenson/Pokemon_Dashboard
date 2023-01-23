import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { App } from './components/App';

const calculateVh = () => {
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Initial calculation
calculateVh();
// Re-calculate on resize
window.addEventListener('resize', calculateVh);
// Re-calculate on device orientation change
window.addEventListener('orientationchange', calculateVh);

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<Provider store={store}>
		<App />
	</Provider>
);
