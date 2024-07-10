import { useEffect, useState } from "react";
import useProductStore from "../../../store/productStore.js";
import { AiOutlineClose } from "react-icons/ai";
import { Doughnut } from "react-chartjs-2";
import { TbEyeEdit } from "react-icons/tb";
import "chart.js/auto";
import Popup from "../Popup/Popup";
import "./staff.css";

const Product = () => {
  const product = useProductStore((state) => state.product);
  const fetchProduct = useProductStore((state) => state.fetchProduct);
  const modifyProduct = useProductStore((state) => state.modifyProduct);
  const addProduct = useProductStore((state) => state.addProduct);

  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    status: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);

  const [newProduct, setNewProduct] = useState({
    productId: "",
    productCode: 0,
    productName: "",
    productPrice: 0,
    productColor: "",
    productStatus: "ON SALE",
  });
  const [viewMode, setViewMode] = useState("fullSale");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleEdit = (ProductMember) => {
    setSelectedProduct(ProductMember);
  };

  const saveChanges = async () => {
    if (selectedProduct) {
      try {
        await modifyProduct(selectedProduct);
        setSelectedProduct(null);
      } catch (error) {
        console.error("Save error:", error);
      }
    }
  };

  const handleAddProduct = async () => {
    if (
      !newProduct.productCode ||
      !newProduct.productName ||
      !newProduct.productPrice ||
      !newProduct.productPrice
    ) {
      setPopup({
        show: true,
        title: "Lỗi",
        message: "Vui lòng nhập đầy đủ thông tin nhân viên.",
        status: "error",
      });
      return;
    }

    try {
      const result = await addProduct(newProduct);
      setPopup({
        show: true,
        title: result.Title,
        message: result.Message,
        status: result.Status,
      });
      setNewProduct({
        productId: "",
        productCode: 0,
        productName: "",
        productPrice: 0,
        productColor: "",
        productStatus: "ON SALE",
      });
      setAddingProduct(false);
    } catch (error) {
      console.error("Add Product error:", error);
    }
  };

  const firstNumber = product.filter(
    (staffMember) => staffMember.productStatus === "ON SALE"
  ).length;
  const secondNumber = product.filter(
    (staffMember) => staffMember.productStatus === "NOT ON SALE"
  ).length;

  const data = {
    labels: ["Đang kinh doanh", "Ngừng kinh doanh"],
    datasets: [
      {
        label: "Mặt hàng",
        data: [firstNumber, secondNumber],
        backgroundColor: ["Green", "Red"],
        hoverOffset: 10,
      },
    ],
  };

  const workingProduct = product.filter(
    (ProductMember) => ProductMember.productStatus === "ON SALE"
  );
  const notWorkingProduct = product.filter(
    (ProductMember) => ProductMember.productStatus === "NOT ON SALE"
  );

  const filteredStaff = (
    viewMode === "fullSale"
      ? product
      : viewMode === "sale"
      ? workingProduct
      : notWorkingProduct
  )
    .filter(
      (ProductMember) =>
        ProductMember.productCode.toString().includes(searchQuery) ||
        ProductMember.productName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      return a.productCode - b.productCode;
    });

  const indexOfLastStaff = currentPage * perPage;
  const indexOfFirstStaff = indexOfLastStaff - perPage;
  const displayedStaff = filteredStaff.slice(
    indexOfFirstStaff,
    indexOfLastStaff
  );

  const totalPages = Math.ceil(filteredStaff.length / perPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const closePopup = () => {
    setPopup({ show: false, title: "", message: "", status: "" });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="revenue">
      {/* {showOverlay && (
        <div className="overlay">
          <div className="loader">
            <svg className="circular" viewBox="25 25 50 50">
              <circle
                className="path"
                cx="50"
                cy="50"
                r="20"
                fill="none"
                strokeWidth="2"
                strokeMiterlimit="10"
              />
            </svg>
          </div>
        </div>
      )} */}

      <header className="header_staff">
        <p>THÔNG TIN MẶT HÀNG</p>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
        <div className="box_staff">
          <table className="firsttable">
            <thead>
              <tr className="titleOneline">
                <th className="center_sum">STT</th>
                <th>Mã mặt hàng</th>

                <th>
                  <select
                    onChange={(e) => setViewMode(e.target.value)}
                    value={viewMode}
                  >
                    <option value="fullSale">Tất cả mặt hàng</option>
                    <option value="sale">Đang kinh doanh</option>
                    <option value="notSale">Ngừng kinh doanh</option>
                  </select>
                </th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {displayedStaff.length > 0 ? (
                displayedStaff.map((ProductMember, index) => (
                  <tr 
                    key={ProductMember.productId}
                  >
                    <td className="center_sum">{indexOfFirstStaff + index + 1}</td>
                    <td>{ProductMember.productCode}</td>
                    <td>
                       {ProductMember.productName}
                    </td>
                    <td className="icon_editview">
                      <TbEyeEdit
                        className="icon_menu"
                        onClick={() => handleEdit(ProductMember)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="center_sum">
                    {searchQuery
                      ? "Không tìm thấy thông tin mặt hàng."
                      : "Chưa có thông tin mặt hàng."}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="4" className="noLine">
                  {displayedStaff.length > 0 && (
                    <div className="pagination">
                      <p>
                        <span>
                          Đang hiển thị {indexOfFirstStaff + 1} đến{" "}
                          {Math.min(indexOfLastStaff, filteredStaff.length)} trên{" "}
                          {filteredStaff.length} mặt hàng
                        </span>
                      </p>
                      <ul className="pagination-list">
                        <li
                          className={`pagination-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Trước
                          </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => (
                          <li
                            key={index}
                            className={`pagination-item ${
                              currentPage === index + 1 ? "active" : ""
                            }`}
                          >
                            <button onClick={() => handlePageChange(index + 1)}>
                              {index + 1}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`pagination-item ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                        >
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Sau
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {selectedProduct && (
          <>
            <div
              className="overlay"
              onClick={() => setSelectedProduct(null)}
            ></div>
            <div className="viewStaff">
              <h2>MẶT HÀNG</h2>
              <AiOutlineClose
                onClick={() => setSelectedProduct(null)}
                className="close-icon"
              />
              <label>
                {" "}
                Tên
                <input
                  type="text"
                  value={selectedProduct.productName}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      productName: e.target.value,
                    })
                  }
                />
              </label>
              <br />
              <label>
                {" "}
                Mã
                <input
                  type="number"
                  value={parseInt(selectedProduct.productCode)}
                  readOnly
                />
              </label>
              <br />
              <label>
                {" "}
                Giá
                <input
                  type="number"
                  value={selectedProduct.productPrice}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      productPrice: parseInt(e.target.value),
                    })
                  }
                />
              </label>
              <br />
              <label>
                {" "}
                Màu
                <input
                  type="text"
                  placeholder="Tên màu"
                  value={selectedProduct.productColor}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      productColor: e.target.value,
                    })
                  }
                />
              </label>
              <br />
              <label>
                {" "}
                Trạng thái
                <select
                  value={selectedProduct.productStatus}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      productStatus: e.target.value,
                    })
                  }
                >
                  <option value="ON SALE">Đang kinh doanh</option>
                  <option value="NOT ON SALE">Ngừng kinh doanh</option>
                </select>
              </label>
              <button className="send" onClick={saveChanges}>
                OK
              </button>
            </div>
          </>
        )}
        {addingProduct && (
          <>
            <div
              className="overlay"
              onClick={() => setAddingProduct(false)}
            ></div>
            <div className="addStaff">
              <h2>Thêm Mặt Hàng Mới</h2>
              <AiOutlineClose
                onClick={() => setAddingProduct(false)}
                className="close-icon"
              />
              <label>
                {" "}
                Tên
                <input
                  type="text"
                  value={newProduct.productName}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      productName: e.target.value,
                    })
                  }
                />
              </label>
              <br />
              <label>
                {" "}
                Mã
                <input
                  type="number"
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      productCode: parseInt(e.target.value),
                    })
                  }
                />
              </label>
              <br />
              <label>
                {" "}
                Giá
                <input
                  type="number"
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      productPrice: parseInt(e.target.value),
                    })
                  }
                />
              </label>
              <br />
              <label>
                {" "}
                Màu
                <input
                  type="text"
                  placeholder="Tên màu"
                  value={newProduct.productColor}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      productColor: e.target.value,
                    })
                  }
                />
              </label>
              <br />
              <label>
                {" "}
                Trạng thái
                <select
                  value={newProduct.productStatus}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      productStatus: e.target.value,
                    })
                  }
                >
                  <option value="ON SALE">Đang kinh doanh</option>
                  <option value="NOT ON SALE">Ngừng kinh doanh</option>
                </select>
              </label>
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
                  text: "MẶT HÀNG",
                },
              },
            }}
          />
        </div>
      </div>
      {popup.show && (
        <Popup
          title={popup.title}
          message={popup.message}
          status={popup.status}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default Product;
