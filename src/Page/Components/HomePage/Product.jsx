
import { useEffect, useState } from "react";
import useProductStore from "../../../store/productStore.js";
import { AiOutlineClose } from "react-icons/ai";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Doughnut } from "react-chartjs-2";
import { TbEyeEdit } from "react-icons/tb";
import 'chart.js/auto';
import './Staff.css';

export const Product = () => {
  const { product, fetchProduct, modifyProduct, addProduct } =
    useProductStore();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productId: "",
    productCode: "",
    productName: "",
    productPrice: "",
    productColor: "",
    productStatus: "On sale",
  });


  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleEdit = (ProductMember) => {
    setSelectedProduct(ProductMember);
  };

  const saveChanges = async () => {
    if (selectedProduct) {
      try {
        console.log(selectedProduct);
        await modifyProduct(selectedProduct, showToast);
        setSelectedProduct(null);
      } catch (error) {
        console.error("Save error:", error);
      }
    }
  };

  const handleAddProduct = () => {
    try {
      addProduct(newProduct);
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
    labels: ["Đang kinh doanh", "Ngừng kinh doanh"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 70],
        backgroundColor: ["Green", "Red"],
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

  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="Staff">
      {showOverlay && 
       <div className="overlay">
        <div class="loader">
          <svg class="circular" viewBox="25 25 50 50">
            <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
          </svg>
        </div>
      </div>}

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
              <th>Đang hoạt động</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {workingProduct.map((ProductMember) => (
              <tr key={ProductMember.productId} className="col" id="mainstate">
                <td>{ProductMember.productName}</td>
                <td className="icon_editview">
                  <TbEyeEdit className="icon_menu"
                    onClick={() => handleEdit(ProductMember)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedProduct && (
          <>  
            <div className="overlay" onClick={() => setSelectedProduct(null)}></div>
            <div className="viewStaff">
            <AiOutlineClose
              onClick={() => setSelectedProduct(null)}
              className="close-icon"
            />
            <input
              type="text"
              placeholder="Product Name"
              value={selectedProduct.productName}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  productName: e.target.value,
                })
              }
            />
            <br />
            <input  placeholder="Product Code" type="text" value={selectedProduct.productCode} readOnly />
            <br />
            <input
              type="text"
              placeholder="Product Price"
              value={selectedProduct.productPrice}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  productPrice: e.target.value,
                })
              }
            />
            <br />
            <input
              type="text"
              placeholder="Product Color"
              value={selectedProduct.productColor}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  productColor: e.target.value,
                })
              }
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
            >
              <option value="On sale">On sale</option>
              <option value="Not on sale">Not on sale</option>
            </select>
              <button className="send" onClick={saveChanges}>
                OK
              </button>
          </div>
          </>
        )}
        {addingProduct && (
          <>
            <div className="overlay" onClick={() => setAddingProduct(false)}></div>
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
          </>
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

          {/* <table className="secondtable">
            <thead className="titleOffline">
              <tr>
                <th colSpan={2}>Ngừng hoạt động</th>
              </tr>
            </thead>
            <tbody>
              {notWorkingProduct.map((ProductMember) => (
                <tr key={ProductMember.productId}
                  className="col"
                  id="mainstate"
                >
                  <td>{ProductMember.productName}</td>
                  <td className="icon_editview">
                    <IoEllipsisVerticalOutline
                      className="icon_menu"
                      onClick={() => toggleSubMenu(ProductMember.productCode)}
                    />
                    {openCode === ProductMember.productCode && (
                      <table className="secondarystate">
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
          </table> */}
        </div>
      </div>
    </div>
  );
};

export default Product;
