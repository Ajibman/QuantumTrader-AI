import { initFirebaseMirror } from './core/firebase.js';

initFirebaseMirror(appState);

export function initFirebaseMirror(state) {
  const db = firebase.firestore(); // or firebase.database()

  // Listen to changes from Firebase
  db.collection('nonSensitiveState').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added' || change.type === 'modified') {
        state.updateFromMirror(change.doc.data());
      }
    });
  });

  // Mirror local changes to Firebase
  state.onChange(newState => {
    db.collection('nonSensitiveState').doc('mirrorDoc').set(newState);
  });
}
