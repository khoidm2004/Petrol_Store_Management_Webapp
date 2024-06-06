import { useEffect, useState } from "react";
import useProductStore from "../../../store/productStore.js";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import "./staff.css";

export const Product = () => {
  const { product, fetchProduct, modifyProduct, addProduct } =
    useProductStore();
  const [openCode, setOpenCode] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productId: "",
    productCode: "",
    productName: "",
    productPrice: "",
    productColor: "",
    productStatus: "On sale",
  });

  const toggleSubMenu = (Code) => {
    if (openCode === Code) {
      setOpenCode(null);
    } else {
      setOpenCode(Code);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleView = (ProductMember) => {
    setSelectedProduct(ProductMember);
    setEditMode(false);
  };

  const handleEdit = (ProductMember) => {
    setSelectedProduct(ProductMember);
    setEditMode(true);
  };

  const saveChanges = async () => {
    if (editMode && selectedProduct) {
      try {
        console.log(selectedProduct);
        await modifyProduct(selectedProduct, showToast);
        setEditMode(false);
        setSelectedProduct(null);
      } catch (error) {
        console.error("Save error:", error);
      }
    }
  };

  const handleAddProduct = async () => {
    try {
      await addProduct(newProduct, showToast);
      setNewProduct({
        productId: "",
        productCode: "",
        productName: "",
        productPrice: "",
        productColor: "",
        productStatus: "On sale",
      });
      setAddingProduct(false);
    } catch (error) {
      console.error("Add Product error:", error);
    }
  };

  const data = {
    labels: ["Red", "blue"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 70],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
        hoverOffset: 10,
      },
    ],
  };

  const workingProduct = product.filter(
    (ProductMember) => ProductMember.productStatus === "On sale"
  );
  const notWorkingProduct = product.filter(
    (ProductMember) => ProductMember.productStatus === "Not on sale"
  );

  return (
    <div className="Staff">
      <header>
        <p>THÔNG TIN MẶT HÀNG</p>
        <div className="search-container">
          <FaMagnifyingGlass className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
        <button
          type="button"
          className="push"
          onClick={() => setAddingProduct(true)}
        >
          THÊM
        </button>
      </header>
      <div className="Staffs">
        <table className="firsttable">
          <thead>
            <tr className="titleOneline">
              <th colSpan={2}>Đang hoạt động</th>
            </tr>
          </thead>
          <tbody>
            {workingProduct.map((ProductMember) => (
              <tr key={ProductMember.productId} className="col" id="mainstate">
                <td>{ProductMember.productName}</td>
                <td className="iconmenu">
                  <IoEllipsisVerticalOutline
                    onClick={() => toggleSubMenu(ProductMember.productCode)}
                  />
                  {openCode === ProductMember.productCode && (
                    <table id="secondarystate">
                      <tbody>
                        <tr className="box">
                          <td onClick={() => handleView(ProductMember)}>
                            VIEW
                          </td>
                        </tr>
                        <tr className="box">
                          <td onClick={() => handleEdit(ProductMember)}>
                            EDIT
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedProduct && (
          <div className="viewStaff">
            <AiOutlineClose
              onClick={() => setSelectedProduct(null)}
              className="close-icon"
            />
            <input
              type="text"
              value={selectedProduct.productName}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  productName: e.target.value,
                })
              }
              readOnly={!editMode}
            />
            <br />
            <input type="text" value={selectedProduct.productCode} readOnly />
            <br />
            <input
              type="text"
              value={selectedProduct.productPrice}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  productPrice: e.target.value,
                })
              }
              readOnly={!editMode}
            />
            <br />
            <input
              type="text"
              value={selectedProduct.productColor}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  productColor: e.target.value,
                })
              }
              readOnly={!editMode}
            />
            <br />
            <select
              value={selectedProduct.productStatus}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  productStatus: e.target.value,
                })
              }
              disabled={!editMode}
            >
              <option value="On sale">On sale</option>
              <option value="Not on sale">Not on sale</option>
            </select>
            {editMode && (
              <button className="send" onClick={saveChanges}>
                OK
              </button>
            )}
          </div>
        )}
        {addingProduct && (
          <div className="addStaff">
            <h2>Thêm Mặt Hàng Mới</h2>
            <AiOutlineClose
              onClick={() => setAddingProduct(false)}
              className="close-icon"
            />
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.productName}
              onChange={(e) =>
                setNewProduct({ ...newProduct, productName: e.target.value })
              }
            />
            <br />
            <input
              type="text"
              placeholder="Product Code"
              value={newProduct.productCode}
              onChange={(e) =>
                setNewProduct({ ...newProduct, productCode: e.target.value })
              }
            />
            <br />
            <input
              type="text"
              placeholder="Product Price"
              value={newProduct.productPrice}
              onChange={(e) =>
                setNewProduct({ ...newProduct, productPrice: e.target.value })
              }
            />
            <br />
            <input
              type="text"
              placeholder="Product Color"
              value={newProduct.productColor}
              onChange={(e) =>
                setNewProduct({ ...newProduct, productColor: e.target.value })
              }
            />
            <br />
            <select
              value={newProduct.productStatus}
              onChange={(e) =>
                setNewProduct({ ...newProduct, productStatus: e.target.value })
              }
            >
              <option value="On sale">On sale</option>
              <option value="Not on sale">Not on sale</option>
            </select>
            <button className="send" onClick={handleAddProduct}>
              THÊM
            </button>
          </div>
        )}

        <div className="chart-container">
          <Doughnut
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: "",
                },
              },
            }}
          />
          <table className="secondtable">
            <thead className="titleOffline">
              <tr>
                <th colSpan={2}>Ngừng hoạt động</th>
              </tr>
            </thead>
            <tbody>
              {notWorkingProduct.map((ProductMember) => (
                <tr
                  key={ProductMember.productId}
                  className="col"
                  id="mainstate"
                >
                  <td>{ProductMember.productName}</td>
                  <td className="iconmenu">
                    <IoEllipsisVerticalOutline
                      className="icon_secondarystate"
                      onClick={() => toggleSubMenu(ProductMember.productCode)}
                    />
                    {openCode === ProductMember.productCode && (
                      <table id="secondarystate">
                        <tbody>
                          <tr className="box">
                            <td onClick={() => handleView(ProductMember)}>
                              VIEW
                            </td>
                          </tr>
                          <tr className="box">
                            <td onClick={() => handleEdit(ProductMember)}>
                              EDIT
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Product;
