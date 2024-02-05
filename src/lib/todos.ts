// Todos

import {
    collection,
    doc,
    increment,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
    writeBatch
} from "firebase/firestore";

import { writable, type Subscriber } from "svelte/store";
import { db } from "./firebase";

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

export const getTotalTodos = () => writable<number>(0, (set: Subscriber<number>) =>
    onSnapshot(
        doc(db, '_counters/todos'),
        (q) => set(q.exists() ? q.data().count : 0)
    )
);

export const getTotalUserTodos = (uid: string) => writable<number>(0, (set: Subscriber<number>) =>
    onSnapshot(
        doc(db, `users/${uid}`),
        (q) => set(q.exists() ? q.data().todoCount : 0)
    )
);

export const addTodo = async (text: string, uid: string) => {

    const countRef = doc(db, '_counters/todos');
    const todoRef = doc(collection(db, 'todos'));

    const batch = writeBatch(db);

    batch.set(countRef, {
        count: increment(1),
        resourceRef: todoRef
    }, { merge: true });

    batch.set(todoRef, {
        uid,
        text,
        complete: false,
        createdAt: serverTimestamp()
    });

    // optional user count
    const userRef = doc(db, 'users/' + uid);
    batch.set(userRef, {
        todoCount: increment(1),
        resourceRef: todoRef
    }, { merge: true });

    batch.commit();
}

export const updateTodo = (id: string, newStatus: boolean) => {
    updateDoc(doc(db, 'todos', id), { complete: newStatus });
}

export const deleteTodo = (id: string, uid: string) => {

    const countRef = doc(db, '_counters/todos');
    const todoRef = doc(db, 'todos', id);

    const batch = writeBatch(db);

    batch.set(countRef, {
        count: increment(-1),
        resourceRef: todoRef
    }, { merge: true });

    // optional user count
    const userRef = doc(db, 'users/' + uid);
    batch.set(userRef, {
        todoCount: increment(-1),
        resourceRef: todoRef
    }, { merge: true });

    batch.delete(todoRef);

    batch.commit();
}

