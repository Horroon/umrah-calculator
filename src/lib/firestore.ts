import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, where, onSnapshot, serverTimestamp, getDoc, setDoc, type Unsubscribe,
} from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import type { Hotel, Flight, VisaTier } from "@/types";

export function subscribeToHotels(userId: string, cb: (hotels: Hotel[]) => void): Unsubscribe {
  const q = query(collection(firebaseDb(), "hotels"), where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    const hotels = snap.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      // Backward compat: old docs stored shuttleSurcharge (number); derive shuttle boolean
      if (typeof data.shuttle === "undefined" && typeof data.shuttleSurcharge === "number") {
        data.shuttle = (data.shuttleSurcharge as number) > 0;
      }
      return { ...data, id: d.id } as Hotel;
    });
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

export function subscribeToFlights(userId: string, cb: (flights: Flight[]) => void): Unsubscribe {
  const q = query(collection(firebaseDb(), "flights"), where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    const flights = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Flight));
    cb(flights);
  });
}

export async function addFlight(userId: string, data: Omit<Flight, "id" | "userId" | "createdAt">) {
  await addDoc(collection(firebaseDb(), "flights"), { ...data, userId, createdAt: serverTimestamp() });
}

export async function updateFlight(id: string, data: Partial<Omit<Flight, "id" | "userId" | "createdAt">>) {
  await updateDoc(doc(firebaseDb(), "flights", id), data as Record<string, unknown>);
}

export async function deleteFlight(id: string) {
  await deleteDoc(doc(firebaseDb(), "flights", id));
}

export async function loadVisaTiers(userId: string): Promise<VisaTier[] | null> {
  const snap = await getDoc(doc(firebaseDb(), "userSettings", userId));
  if (!snap.exists()) return null;
  const tiers = snap.data()?.visaTiers;
  return Array.isArray(tiers) ? (tiers as VisaTier[]) : null;
}

export async function saveVisaTiers(userId: string, tiers: VisaTier[]): Promise<void> {
  await setDoc(doc(firebaseDb(), "userSettings", userId), { visaTiers: tiers }, { merge: true });
}

export async function loadCustomRates(userId: string): Promise<Partial<Record<string, number>> | null> {
  const snap = await getDoc(doc(firebaseDb(), "userSettings", userId));
  if (!snap.exists()) return null;
  const rates = snap.data()?.customRates;
  return rates && typeof rates === "object" ? (rates as Partial<Record<string, number>>) : null;
}

export async function saveCustomRates(userId: string, rates: Partial<Record<string, number>>): Promise<void> {
  await setDoc(doc(firebaseDb(), "userSettings", userId), { customRates: rates }, { merge: true });
}
