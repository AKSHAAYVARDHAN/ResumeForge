// Compatibility shim — the canonical Firebase config now lives in config/firebase.js
// Any file that still imports from 'src/firebase' continues to work.
export { auth, hasConfig, default } from './config/firebase';