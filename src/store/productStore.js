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
          Title: "Lỗi",
          Message: "Mã sản phẩm đã được dùng",
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
        Title: "Thông báo",
        Message: "Thêm thành công",
        Status: "success",
        productId: productId,
      };
    } catch (error) {
      return {
        Title: "Lỗi",
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
        Title: "Thông báo",
        Message: "Chỉnh sửa thành công",
        Status: "success",
      };
    } catch (error) {
      return {
        Title: "Lỗi",
        Message: error.message,
        Status: "error",
      };
    }
  },

  // Search product using product Code || name
  searchProduct: async (inputs) => {
    try {
      const productRef = collection(firestore, "product");

      const qCode = query(productRef, where("productCode", "==", inputs));
      const qName = query(productRef, where("productName", "==", inputs));

      const productCodeQuerySnapshot = await getDocs(qCode);
      const productNameQuerySnapshot = await getDocs(qName);

      if (productCodeQuerySnapshot.empty && productNameQuerySnapshot.empty) {
        return {
          Title: "Lỗi",
          Message: "Không tìm thấy sản phẩm",
          Status: "error",
        };
      }

      if (!productCodeQuerySnapshot.empty) {
        const productList1 = productCodeQuerySnapshot.docs.map((doc) => ({
          productId: doc.id,
          ...doc.data(),
        }));

        set({ product: productList1 });
      }

      if (!productNameQuerySnapshot.empty) {
        const productList2 = productNameQuerySnapshot.docs.map((doc) => ({
          productId: doc.id,
          ...doc.data(),
        }));

        set({ product: productList2 });
      }
    } catch (error) {
      return { Title: "Lỗi", Message: error.message, Status: "error" };
    }
  },
}));

export default useProductStore;
