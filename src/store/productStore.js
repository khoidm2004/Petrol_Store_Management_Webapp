import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { create } from "zustand";
import { firestore } from "../firebase/firebase.js";

const useProductStore = create((set) => ({
  // Map data from array
  product: [],

  /* 
  const newProduct = {
    productId: string
    productCode: string
    name: string
    price: number
    status: string
  }
*/

  fetchProduct: async () => {
    const ProductCollection = collection(firestore, "product");
    const productSnapshot = await getDocs(ProductCollection);
    const productList = productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    set({ product: productList });
  },

  addProduct: async (newProduct, showToast) => {
    try {
      const productRef = collection(firestore, "product");
      const q = query(
        productRef,
        where("product_code", "==", newProduct.product_code)
      );
      const productQuerySnapshot = await getDocs(q);

      if (!productQuerySnapshot.empty) {
        showToast("Error", "Product code has been used", "error");
        return;
      }
      const docRef = addDoc(productRef, newProduct);
      set((state) => ({
        product: [...state.product, { id: docRef.id, ...newProduct }],
      }));
      showToast("Success", "Product has been added successfully");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  },

  //Able to modify everything except id
  modifyProduct: async (inputs, showToast) => {
    const { product_id, ...updatedProduct } = inputs;
    const productDocRef = doc(firestore, "product", product_id);

    try {
      await updateDoc(productDocRef, updatedProduct);

      set((state) => ({
        staff: state.product.map((item) =>
          item.product_id === product_id ? { ...item, ...updatedProduct } : item
        ),
      }));
      showToast("Success", "Product has been updated successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  },
}));

export default useProductStore;
