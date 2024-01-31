import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    onIdTokenChanged,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { readable, writable, type Subscriber } from 'svelte/store';
import {
    getFirestore,
    increment,
    onSnapshot,
    writeBatch
} from 'firebase/firestore';
import {
    collection,
    deleteDoc,
    doc,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { PUBLIC_FIREBASE_CONFIG } from '$env/static/public';

const firebase_config = JSON.parse(PUBLIC_FIREBASE_CONFIG);

// initialize and login

const firebaseApp = initializeApp(firebase_config);

const auth = getAuth();

export async function loginWithGoogle() {
    return await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function logout() {
    return await signOut(auth);
}

export const user = readable<UserType | null>(
    null,
    (set: Subscriber<UserType | null>) =>
        onIdTokenChanged(auth, (_user: User | null) => {
            if (!_user) {
                set(null);
                return;
            }
            const { displayName, photoURL, uid, email } = _user;
            set({ displayName, photoURL, uid, email });
        })
);

// firestore

const db = getFirestore(firebaseApp);

// Todos

export const getTodos = (uid: string) => writable<Todo[] | null>(
    null,
    (set: Subscriber<Todo[] | null>) =>
        onSnapshot(
            query(
                collection(db, 'todos'),
                where('uid', '==', uid),
                orderBy('createdAt')
            ), (q) => {
                set(q.empty
                    ? []
                    : q.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Todo[]
                );
            })
);

export const addTodo = async (uid: string, text: string) => {

    const userRef = doc(db, 'users/' + uid);
    const todoRef = doc(collection(db, 'todos'));


    const batch = writeBatch(db);

    batch.set(userRef, { todoCount: increment(1) });

    batch.set(todoRef, {
        uid,
        text,
        complete: false,
        createdAt: serverTimestamp()
    });

    batch.commit();
}

export const updateTodo = (id: string, newStatus: boolean) => {
    updateDoc(doc(db, 'todos', id), { complete: newStatus });
}

export const deleteTodo = (id: string) => {
    deleteDoc(doc(db, 'todos', id));
}

