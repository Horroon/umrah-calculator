import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, where, onSnapshot, serverTimestamp, type Unsubscribe,
} from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import type { Hotel } from "@/types";

export function subscribeToHotels(userId: string, cb: (hotels: Hotel[]) => void): Unsubscribe {
  const q = query(collection(firebaseDb(), "hotels"), where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    const hotels = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Hotel));
    cb(hotels);
  });
}

export async function addHotel(userId: string, data: Omit<Hotel, "id" | "userId" | "createdAt">) {
  await addDoc(collection(firebaseDb(), "hotels"), { ...data, userId, createdAt: serverTimestamp() });
}

export async function updateHotel(id: string, data: Partial<Omit<Hotel, "id" | "userId" | "createdAt">>) {
  await updateDoc(doc(firebaseDb(), "hotels", id), data as Record<string, unknown>);
}

export async function deleteHotel(id: string) {
  await deleteDoc(doc(firebaseDb(), "hotels", id));
}
