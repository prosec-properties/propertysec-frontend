import { create } from "zustand";
import localForage from "localforage";
import { persist, createJSONStorage as createStore } from "zustand/middleware";
import { ICategory } from "@/interface/category";
import { IUser } from "@/interface/user";
import { IState } from "@/interface/location";

export interface ILocalStore {
  user?: IUser;
  //   chats: Chat[];
  categories?: ICategory[];
  //   subscription: Subscription[];
  loading: boolean;
  setUser: (user: IUser) => void;
  updateUser: (user: Partial<IUser>) => void;
  //   setChats: (chats: Chat[]) => void;
  setCategories: (categories: ICategory[]) => void;
  //   setSubscription: (subscription: Subscription[]) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useLocalStore = create(
  persist<ILocalStore>(
    (set, get) => ({
      user: undefined,
      //   chats: [],
      categories: [],
      //   subscription: [],
      loading: true,
      setUser: (user: IUser) => set({ user }),
      updateUser: (user: Partial<IUser>) =>
        set({ user: { ...get().user, ...(user as any) } }),
      //   setChats: (chats: Chat[]) => set({ chats }),
      setCategories: (categories: ICategory[]) => set({ categories }),
      //   setSubscription: (subscription: Subscription[]) => set({ subscription }),
      setLoading: (loading: boolean) => set({ loading }),
      clear: () =>
        set({
          user: undefined,
          //   chats: [],
          loading: true,
        }),
    }),

    {
      name: "prosec-async-store",
      storage: createStore(() => localForage as any),
    }
  )
);

interface INigeriaLocation {
  states: IState[];
  setStates: (states: IState[]) => void;
}

export const useNigerianLocation = create(
  persist<INigeriaLocation>(
    (set) => ({
      states: [],
      setStates: (states: IState[]) => set({ states }),
    }),
    {
      name: "nigerian-location",
      storage: createStore(() => localForage as any),
    }
  )
);

// const LoanInfoSchema = z
//   .object({
//     amount: z.string().min(1, { message: "Amount is required" }),
//     duration: z.string().min(1, { message: "Duration is required" }),
//     fullName: z.string().min(1, { message: "Full name is required" }),
//     email: z.string().email({ message: "Invalid email address" }),
//     stateOfOrigin: z
//       .string()
//       .min(1, { message: "State of origin is required" }),
//     nationality: z.string().min(1, { message: "National is required" }),
//     homeAddress: z.string().min(1, { message: "Home address is required" }),
//     religion: z.string().min(1, { message: "Religion is required" }),
//     nextOfKin: z.string().min(1, { message: "Next of kin is required" }),
//   })
//   .and(phoneNumberSchema());


