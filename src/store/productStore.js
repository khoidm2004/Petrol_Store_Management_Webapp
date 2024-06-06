import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { create } from "zustand";
import { firestore } from "../firebase/firebase.js";

const useProductStore = create((set) => ({
  // Map data from array
  product: [],

  /* 
  const newProduct = {
    productId: string
    productCode: number
    productName: string
    productPrice: number
    productStatus: string
    productColor: string
  }
*/

  fetchProduct: async () => {
    const ProductCollection = collection(firestore, "product");
    const productSnapshot = await getDocs(ProductCollection);
    const productList = productSnapshot.docs.map((doc) => ({
      productId: doc.id,
      ...doc.data(),
    }));

    set({ product: productList });
  },

  addProduct: async (newProduct) => {
    // Checking validity of productCode
    try {
      const productRef = collection(firestore, "product");
      const q = query(
        productRef,
        where("productCode", "==", newProduct.productCode)
      );
      const productQuerySnapshot = await getDocs(q);

      if (!productQuerySnapshot.empty) {
        return {
          Title: "Error",
          Message: "Product Code has been used",
          Status: "error",
        };
      }
      const docRef = await addDoc(productRef, newProduct);

      const productId = docRef.id;
      await updateDoc(doc(firestore, "product", productId), { productId });

      set((state) => ({
        product: [
          ...state.product,
          { id: productId, ...newProduct, productId },
        ],
      }));
      return {
        Title: "Success",
        Message: "Adding Sucessfully",
        Status: "success",
        productId: productId,
      };
    } catch (error) {
      return {
        Title: "Error",
        Message: error.message,
        Status: "error",
      };
    }
  },

  //Able to modify everything except id
  modifyProduct: async (inputs) => {
    try {
      const { productId, ...updatedProduct } = inputs;
      const productDocRef = doc(firestore, "product", productId);
      await updateDoc(productDocRef, updatedProduct);

      set((state) => ({
        product: state.product.map((item) =>
          item.productId === productId ? { ...item, ...inputs } : item
        ),
      }));
      return {
        Title: "Success",
        Message: "Modifying Sucessfully",
        Status: "success",
      };
    } catch (error) {
      return {
        Title: "Error",
        Message: error.message,
        Status: "error",
      };
    }
  },
}));

export default useProductStore;
