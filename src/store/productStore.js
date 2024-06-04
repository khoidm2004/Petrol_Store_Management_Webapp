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
    
    console.log(productList);
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
      const docRef = addDoc(productRef, newProduct);
      set((state) => ({
        product: [...state.product, { id: docRef.id, ...newProduct }],
      }));
      return {
        Title: "Success",
        Message: "Adding Sucessfully",
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

  //Able to modify everything except id
  modifyProduct: async (inputs) => {
    try {
      const { productId, ...updatedProduct } = inputs;
      const productDocRef = doc(firestore, "product", productId);
      await updateDoc(productDocRef, updatedProduct);

      set((state) => ({
        product: state.product.map((item) =>
          item.productId === productId ? { ...item, ...updatedProduct } : item
        ),
      }));
      return {
        Title: "Success",
        Message: "Modifying Successfully",
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
