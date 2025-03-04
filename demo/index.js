import React from 'react';

import {createRoot} from 'react-dom/client';

import Demo from './Demo';

const root = createRoot(document.getElementById('react-demo-entry-point'));

root.render(<Demo />);
