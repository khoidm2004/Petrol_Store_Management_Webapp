import { useEffect, useState } from 'react';
import useShiftStore from '../../../store/shiftStore.js';
import useProductStore from "../../../store/productStore.js";
import usePumpStore from "../../../store/pumpStore.js";
import useStaffStore from "../../../store/staffStore.js";
import { AiOutlineClose } from "react-icons/ai";
import { TbEyeEdit } from "react-icons/tb";
import { CgAddR } from "react-icons/cg";
import { FaRegMinusSquare } from "react-icons/fa";
import 'chart.js/auto'; 
import './Staff.css';
import Popup from "../Popup/Popup";
import { timeConverter } from '../../../utils/timeConverter.js';

export const Shift = () => {
    const shifts = useShiftStore((state) => state.shifts);
    const fetchShift = useShiftStore((state) => state.fetchShift);
    const addShift = useShiftStore((state) => state.addShift);
    const modifyShift = useShiftStore((state) => state.modifyShift);

    const { product, fetchProduct } = useProductStore();
    const { staff, fetchStaff } = useStaffStore();
    const { pumps, fetchPump } = usePumpStore();
    const [selectedShift, setSelectedShift] = useState(null);
    const [addingShift, setAddingShift] = useState(false);
    const [popup, setPopup] = useState({ show: false, title: "", message: "" });
    const [newShift, setNewShift] = useState({
        startTime: new Date(),
        endTime: new Date(),
        pumpList:{
            "Pump1": { pumpName: "", pumpCode: parseInt(""), firstMeterReadingByMoney: NaN, firstMeterReadingByLitre: NaN }},
        employeeList:  {
            "Staff1": { fullName: "", email: ""}},
        productList: {
            "Product1": { productName: "", productCode: "", productPrice: "" }}
    });

    useEffect(() => {
        fetchProduct();
        fetchShift();
        fetchPump();
        fetchStaff();
    }, [fetchProduct, fetchShift, fetchPump, fetchStaff]);

    useEffect(() => {
        if (pumps.length > 0) {
            setNewShift((prevShift) => ({
                ...prevShift,
                pumpList: {
                    "Pump1": { pumpName: pumps[0].pumpName, pumpCode: pumps[0].pumpCode, firstMeterReadingByMoney: NaN, firstMeterReadingByLitre: NaN }
                }
            }));
        }
    }, [pumps]);

    useEffect(() => {
        if (product.length > 0) {
            setNewShift((prevShift) => ({
                ...prevShift,
                productList: {
                    "Product1": { productName: product[0].productName, productCode: product[0].productCode, productPrice: product[0].productPrice }
                }
            }));
        }
    }, [product]);

    useEffect(() => {
        if (staff.length > 0) {
            setNewShift((prevShift) => ({
                ...prevShift,
                employeeList: {
                    "Staff1": { fullName: staff[0].fullName, email: staff[0].email }
                }
            }));
        }
    }, [staff]);

    const handleEdit = (shift) => {
        setSelectedShift(shift);
    };

    const saveChanges = async () => {
        if (selectedShift) {
            try {
                const status = await modifyShift(selectedShift);
                setSelectedShift(null);
            } catch (error) {
                console.error('Save error:', error);
            }
        }
    };

    const handleAddShift = async () => {
        if (!newShift.startTime || !newShift.endTime) {
            setPopup({
              show: true,
              title: "Lỗi",
              message: "Vui lòng chọn ngày tháng của ca.",
            });
            return;
          }

        try {
            const result = await addShift(newShift);
            setPopup({
                show: true,
                title: 'Thông báo',
                message: result.Message,
              });
            setNewShift({
                startTime: new Date(),
                endTime: new Date(),
                pumpList: pumps.length > 0 ? {
                    "Pump1": { pumpName: pumps[0].pumpName, pumpCode:  pumps[0].pumpCode, firstMeterReadingByMoney: NaN, firstMeterReadingByLitre: NaN}
                } : {"Pump1": { pumpName: "", pumpCode: "", firstMeterReadingByMoney: NaN, firstMeterReadingByLitre: NaN }},
                employeeList: staff.length > 0 ? {
                    "Staff1": { fullName: staff[0].fullName, email: staff[0].email }
                } : {"Staff1": { fullName: "", email: ""}},
                productList: product.length > 0 ? {
                    "Product1": { productName: product[0].productName, productCode: product[0].productCode, productPrice: product[0].productPrice}
                } : {"Product1": { productName: "", productCode: "", productPrice: "" }}
            });
            setAddingShift(false);
        } catch (error) {
            setPopup({
                show: true,
                title: 'Thông báo',
                message: error,
              });
        }
    };

    const handleAddEmployee = () => {
        const newKey = `Staff${Object.keys(selectedShift.employeeList).length + 1}`;
        setSelectedShift(prevShift => ({
            ...prevShift,
            employeeList: {
                ...prevShift.employeeList,
                [newKey]: staff.length > 0 ? 
                { fullName: staff[0].fullName, email:  staff[0].email }
                 : { fullName: "", email: ""},
            }
        }));
    };

    const handleRemoveEmployee = (index) => {
        const { [index]: _, ...newEmployeeList } = selectedShift.employeeList;
        setSelectedShift(prevShift => ({
            ...prevShift,
            employeeList: newEmployeeList
        }));
    };

    const handleAddNewEmployee = () => {
        const newKey = `Staff${Object.keys(newShift.employeeList).length + 1}`;
        setNewShift(prevShift => ({
            ...prevShift,
            employeeList: {
                ...prevShift.employeeList,
                [newKey]: staff.length > 0 ? 
                { fullName: staff[0].fullName, email:  staff[0].email}
                 : { fullName: "", email: ""},
            }
        }));
    };

    const handleRemoveNewEmployee = (index) => {
        const { [index]: _, ...newEmployeeList } = newShift.employeeList;
        setNewShift(prevShift => ({
            ...prevShift,
            employeeList: newEmployeeList
        }));
    };

    const handleAddProduct = () => {
        const newKey = `Product${Object.keys(selectedShift.productList).length + 1}`;
        setSelectedShift(prevShift => ({
            ...prevShift,
            productList: {
                ...prevShift.productList,
                [newKey]: product.length > 0 ? 
                { productName: product[0].productName, productCode: product[0].productCode, productPrice: product[0].productPrice}
                : { productName: "", productCode: "", productPrice: "" }
            }
        }));
    };

    const handleRemoveProduct = (key) => {
        const { [key]: _, ...newProductList } = selectedShift.productList;
        setSelectedShift(prevShift => ({
            ...prevShift,
            productList: newProductList
        }));
    };

    const handleAddNewProduct = () => {
        const newKey = `Product${Object.keys(newShift.productList).length + 1}`;
        setNewShift(prevShift => ({
            ...prevShift,
            productList: {
                ...prevShift.productList,
                [newKey]: product.length > 0 ? 
                { productName: product[0].productName, productCode: product[0].productCode, productPrice: product[0].productPrice}
                : { productName: "", productCode: "", productPrice: "" }
            }
        }));
    };

    const handleRemoveNewProduct = (key) => {
        const { [key]: _, ...newProductList } = newShift.productList;
        setNewShift(prevShift => ({
            ...prevShift,
            productList: newProductList
        }));
    };

    const handleAddPump = () => {
        const newKey = `Pump${Object.keys(selectedShift.pumpList).length + 1}`;
        setSelectedShift(prevShift => ({
            ...prevShift,
            pumpList: {
                ...prevShift.pumpList,
                [newKey]: pumps.length > 0 ? 
                    { pumpName: pumps[0].pumpName, pumpCode:  pumps[0].pumpCode, firstMeterReadingByMoney: NaN, firstMeterReadingByLitre: NaN}
                 :  { pumpName: "", pumpCode: "", firstMeterReadingByMoney: NaN, firstMeterReadingByLitre: NaN},
            }
        }));
    };

    const handleRemovePump = (key) => {
        const { [key]: _, ...newPumpList } = selectedShift.pumpList;
        setSelectedShift(prevShift => ({
            ...prevShift,
            pumpList: newPumpList
        }));
    };

    const handleAddNewPump = () => {
        const newKey = `Pump${Object.keys(newShift.pumpList).length + 1}`;
        setNewShift(prevShift => ({
            ...prevShift,
            pumpList: {
                ...prevShift.pumpList,
                [newKey]:pumps.length > 0 ? 
                 { pumpName: pumps[0].pumpName, pumpCode:  pumps[0].pumpCode, firstMeterReadingByMoney:NaN, firstMeterReadingByLitre:NaN }
                 : { pumpName: "", pumpCode: "", firstMeterReadingByMoney: NaN, firstMeterReadingByLitre: NaN },
        }}));
    };

    const handleRemoveNewPump = (key) => {
        const { [key]: _, ...newPumpList } = newShift.pumpList;
        setNewShift(prevShift => ({
            ...prevShift,
            pumpList: newPumpList
        }));
    };

    const [showOverlay, setShowOverlay] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowOverlay(false);
      }, 2000);
  
      return () => clearTimeout(timer);
    }, []);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(10);
    const indexOfLastStaff = currentPage * perPage;
    const indexOfFirstStaff = indexOfLastStaff - perPage;
    const displayedStaff =  shifts.slice(indexOfFirstStaff, indexOfLastStaff);

    const totalPages = Math.ceil(shifts.length / perPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
      };
    
      const closePopup = () => {
        setPopup({ show: false, title: "", message: "" });
      };
    return (
        <div className='revenue'>
            {showOverlay && 
                <div className="overlay">
                    <div class="loader">
                        <svg class="circular" viewBox="25 25 50 50">
                            <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
                        </svg>
                    </div>
                </div>}
            <header className='header_staff'>
                <p>THÔNG TIN CA BÁN HÀNG</p>
                <button type="button" className='push' onClick={() => setAddingShift(true)}>THÊM</button>
            </header>
            <div>
                <div className="box_shift">
                    <table className='firsttable_shift'>
                        <thead>
                            <tr className='titleOneline'>
                                <th>STT</th>
                                <th>Nhân viên</th>
                                <th>Vòi bơm</th>
                                <th>Mặt hàng</th>
                                <th>Thời gian làm</th>
                                <th className='view_chitiet'>Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shifts.length > 0 ? shifts.map((shift, index) => (
                                <tr className='col' id='mainstate' key={shift.id}>
                                   <td>{indexOfFirstStaff + index + 1}</td>
                                    <td>{Object.values(shift.employeeList).map(pump => pump.fullName).join(' - ')}</td>
                                    <td>{Object.values(shift.pumpList).map(pump => pump.pumpName).join(' - ')}</td>
                                    <td>{Object.values(shift.productList).map(product => product.productName).join(' - ')}</td>
                                    <td>{timeConverter(Date.parse(shift.startTime)).date} : {timeConverter(Date.parse(shift.startTime)).time}
                                    <br></br> {timeConverter(Date.parse(shift.endTime)).date} : {timeConverter(Date.parse(shift.endTime)).time}

                                    </td>
                                    <td className="icon_editview">
                                        <TbEyeEdit className="icon_menu" onClick={() => handleEdit(shift)} />
                                    </td>
                                </tr>
                            )): (
                                <tr>
                                    <td colSpan={6} className="no-data">Chưa tồn tại ca bán hàng</td>
                                </tr>
                            )}
                            <tr>
                                <td colSpan={6}>
                                {displayedStaff.length > 0 && (
                                    <div className="pagination">
                                    <p>
                                        <span>Showing &nbsp;</span> <span>{indexOfFirstStaff + 1}&nbsp;</span><span>to&nbsp;</span><span>{Math.min(indexOfLastStaff, shifts.length)}&nbsp;</span> <span>of&nbsp;</span> <span>{shifts.length}&nbsp;</span> entries
                                    </p>
                                    <ul className="pagination-list">
                                        <li className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                                        </li>
                                        {Array.from({ length: totalPages }, (_, index) => (
                                            <li key={index} className={`pagination-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                            <button onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                                            </li>
                                        ))}
                                        <li className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                                        </li>
                                        </ul>
                                    </div>
                                )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {selectedShift && (
                    <>
                        <div className="overlay" onClick={() => setSelectedShift(null)}></div>
                        <div className='viewShift' value="">
                        <AiOutlineClose onClick={() => setSelectedShift(null)} className="close_icon" />
                        <h2>Ca Bán Hàng </h2>
                            <label htmlFor="">Thời gian bắt đầu</label>
                        <input type="datetime-local" className="time"  value={selectedShift.startTime} onChange={(e) => setSelectedShift({ ...selectedShift, startTime: e.target.value })}/><hr />
                            <label htmlFor="">Thời gian kết thúc</label>
                        <input type="datetime-local" className="time"  value={selectedShift.endTime} onChange={(e) => setSelectedShift({ ...selectedShift, endTime: e.target.value })}/><br />
                        <hr />
                            <div>
                                <h5>NHÂN VIÊN <CgAddR className='pull_icon' onClick={handleAddEmployee} /></h5>
                                <div className='Staff'>
                                    {Object.entries(selectedShift.employeeList).map(([key, employee]) => (
                                        <div key={key} className='product-item'>
                                            <select
                                                value={employee.email}
                                                onChange={(e) => {
                                                    const selectedStaff = staff.find(p => p.email === e.target.value);
                                                    setSelectedShift({
                                                        ...selectedShift,
                                                        employeeList: {
                                                            ...selectedShift.employeeList,
                                                            [key]: {
                                                                ...selectedShift.employeeList[key],
                                                                email: selectedStaff.email,
                                                                fullName: selectedStaff.fullName,
                                                            }
                                                        }
                                                    });
                                                }}>
                                                <optgroup label="Gmail - Name">
                                                    {staff.map((newStaff) => (
                                                            <option key={newStaff.email} value={newStaff.email}>
                                                                    {newStaff.email} - {newStaff.fullName} 
                                                            </option>
                                                    ))}
                                                 </optgroup>
                                            </select>
                                            <FaRegMinusSquare className="push_icon" onClick={() => handleRemoveEmployee(key)}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <hr />
                            <div>
                                <h5>MẶT HÀNG <CgAddR className='pull_icon' onClick={handleAddProduct} /> </h5>
                                <div className='Staff'>
                                    {Object.entries(selectedShift.productList).map(([key, products]) => (
                                        <div key={key} className='product-item'>
                                            <select
                                                value={products.productCode}
                                                onChange={(e) => {
                                                    const selectedProduct = product.find(p => p.productCode === e.target.value);
                                                    setSelectedShift({
                                                        ...selectedShift,
                                                        productList: {
                                                            ...selectedShift.productList,
                                                            [key]: {
                                                                ...selectedShift.productList[key],
                                                                productCode: selectedProduct.productCode,
                                                                productName: selectedProduct.productName,
                                                                productPrice: selectedProduct.productPrice
                                                            }
                                                        }
                                                    });
                                                }}>
                                                <optgroup label='Mã Mặt Hàng - Tên Mặt Hàng - Gía Mặt Hàng'>
                                                {product.map((newproduct) => (
                                                    <option key={newproduct.productCode} value={newproduct.productCode}>
                                                        {newproduct.productCode} - {newproduct.productName} - {newproduct.productPrice}
                                                    </option>
                                                ))}
                                                </optgroup>
                                            </select>
                                            <FaRegMinusSquare className="push_icon" onClick={() => handleRemoveProduct(key)}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <hr />
                            <div>
                                <h5>VÒI BƠM <CgAddR className='pull_icon' onClick={handleAddPump} /> </h5>
                                <div className='Staff'>
                                    {Object.entries(selectedShift.pumpList).map(([key, pump]) => (
                                        <div key={key} className='pump-item'>
                                            <select
                                                value={pump.pumpCode}
                                                onChange={(e) => {
                                                    const selectedPump = pumps.find(p => p.pumpCode === e.target.value);
                                                    setSelectedShift({
                                                        ...selectedShift,
                                                        pumpList: {
                                                            ...selectedShift.pumpList,
                                                            [key]: {
                                                                ...selectedShift.pumpList[key],
                                                                pumpCode: selectedPump.pumpCode,
                                                                pumpName: selectedPump.pumpName,
                                                                firstMeterReadingByMoney: selectedPump.firstMeterReadingByMoney,
                                                                firstMeterReadingByLitre: selectedPump.firstMeterReadingByLitre,
                                                            }
                                                        }
                                                    });
                                                }}>
                                                <optgroup label='Mã Vòi Bơm - Tên Vòi Bơm'>
                                                    {pumps.map((newpump) => (
                                                        <option key={newpump.pumpCode} value={newpump.pumpCode}>
                                                            {newpump.pumpName} - {newpump.pumpCode}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            </select>
                                            <input type="number" placeholder='firstMeterReadingByLitre' value={pump.firstMeterReadingByLitre} onChange={(e) => setSelectedShift({
                                                ...selectedShift,
                                                pumpList: {
                                                    ...selectedShift.pumpList,
                                                    [key]: {
                                                        ...selectedShift.pumpList[key],
                                                        firstMeterReadingByLitre: e.target.value
                                                    }
                                                }
                                            })} />
                                            <input type="number" placeholder="firstMeterReadingByMoney"value={pump.firstMeterReadingByMoney} onChange={(e) => setSelectedShift({
                                                ...selectedShift,
                                                pumpList: {
                                                    ...selectedShift.pumpList,
                                                    [key]: {
                                                        ...selectedShift.pumpList[key],
                                                        firstMeterReadingByMoney: e.target.value
                                                    }
                                                }
                                            })} />
                                            <FaRegMinusSquare className="push_icon" onClick={() => handleRemovePump(key)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="send" onClick={saveChanges}>LƯU</button>
                    </div>
                    </>
                )}
                {addingShift && (
                    <>  
                        <div className="overlay" onClick={() => setAddingShift(false)}></div>
                        <div className='addShift'>
                        <AiOutlineClose onClick={() => setAddingShift(false)} className="close_icon" />
                        <h2>Thêm Ca Mới </h2>
                            <label htmlFor="">Thời gian bắt đầu</label>
                        <input type="datetime-local" placeholder="Start Time" value={newShift.startTime} onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })} /><br></br>
                            <label htmlFor="">Thời gian kết thúc</label>
                        <input type="datetime-local" placeholder="End Time" value={newShift.endTime} onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })} /><br />

                        <div>
                            <h5>NHÂN VIÊN <CgAddR className='pull_icon' onClick={handleAddNewEmployee} /></h5>
                            <div className='Staff'>
                                {Object.entries(newShift.employeeList).map(([key, staffs]) => (
                                    <div key={key} className='product-item'>
                                        <select
                                            value={staffs.email}
                                            onChange={(e) => {
                                                const selectedStaff = staff.find(p => p.email === e.target.value);
                                                setNewShift({
                                                    ...newShift,
                                                    employeeList: {
                                                        ...newShift.employeeList,
                                                        [key]: {
                                                            ...newShift.employeeList[key],
                                                            email: selectedStaff.email,
                                                            fullName: selectedStaff.fullName,
                                                        }
                                                    }
                                                });
                                            }}>
                                            <optgroup label="Gmail - Name">
                                                {staff.map((newStaff) => (
                                                        <option key={newStaff.email} value={newStaff.email}>
                                                                {newStaff.email} - {newStaff.fullName} 
                                                        </option>
                                                ))}
                                            </optgroup>
                                        </select>
                                        <FaRegMinusSquare className="push_icon" onClick={() => handleRemoveNewEmployee(key)} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h5>MẶT HÀNG <CgAddR className='pull_icon' onClick={handleAddNewProduct} /></h5>
                            <div className='Staff'>
                                {Object.entries(newShift.productList).map(([key, products]) => (
                                    <div key={key} className='product-item'>
                                        <select
                                            value={products.productCode}
                                            onChange={(e) => {
                                                const selectedProduct = product.find(p => p.productCode === e.target.value);
                                                setNewShift({
                                                    ...newShift,
                                                    productList: {
                                                        ...newShift.productList,
                                                        [key]: {
                                                            ...newShift.productList[key],
                                                            productCode: selectedProduct.productCode,
                                                            productName: selectedProduct.productName,
                                                            productPrice: selectedProduct.productPrice
                                                        }
                                                    }
                                                });
                                            }}>
                                            <optgroup label='Mã Mặt Hàng - Tên Mặt Hàng - Gía Mặt Hàng'>
                                                {product.map((newproduct) => (
                                                    <option key={newproduct.productCode} value={newproduct.productCode}>
                                                        {newproduct.productCode} - {newproduct.productName} - {newproduct.productPrice}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        </select>
                                        <FaRegMinusSquare className="push_icon" onClick={() => handleRemoveNewProduct(key)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h5>VÒI BƠM <CgAddR className='pull_icon' onClick={handleAddNewPump} /></h5>
                            <div className='Staff'>
                                {Object.entries(newShift.pumpList).map(([key, pump]) => (
                                    <div key={key} className='pump-item'>
                                        <select
                                            value={pump.pumpCode}
                                            onChange={(e) => {
                                                const selectedPump = pumps.find(p => p.pumpCode === e.target.value);
                                                setNewShift({
                                                    ...newShift,
                                                    pumpList: {
                                                        ...newShift.pumpList,
                                                        [key]: {
                                                            ...newShift.pumpList[key],
                                                            pumpCode: selectedPump.pumpCode,
                                                            pumpName: selectedPump.pumpName,
                                                            firstMeterReadingByMoney: selectedPump.firstMeterReadingByMoney,
                                                            firstMeterReadingByLitre: selectedPump.firstMeterReadingByLitre,
                                                        }
                                                    }
                                                });
                                            }}>
                                            <optgroup label='Mã Vòi Bơm - Tên Vòi Bơm'>
                                                {pumps.map((newpump) => (
                                                    <option key={newpump.pumpCode} value={newpump.pumpCode}>
                                                        {newpump.pumpName} - {newpump.pumpCode}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        </select>
                                        <input type="number" value={pump.firstMeterReadingByLitre} placeholder='firstMeterReadingByLitre ' onChange={(e) => setNewShift({
                                            ...newShift,
                                            pumpList: {
                                                ...newShift.pumpList,
                                                [key]: {
                                                    ...newShift.pumpList[key],
                                                    firstMeterReadingByLitre: e.target.value
                                                }
                                            }
                                        })} />
                                        <input type="number" value={pump.firstMeterReadingByMoney} placeholder="firstMeterReadingByMoney" onChange={(e) => setNewShift({
                                            ...newShift,
                                            pumpList: {
                                                ...newShift.pumpList,
                                                [key]: {
                                                    ...newShift.pumpList[key],
                                                    firstMeterReadingByMoney: e.target.value
                                                }
                                            }
                                        })} />
                                        <FaRegMinusSquare className="push_icon" onClick={() => handleRemoveNewPump(key)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="send" onClick={handleAddShift}>THÊM</button>
                    </div>
                    </>
                )}
            </div>
            {popup.show && (
                <Popup
                title={popup.title}
                message={popup.message}
                onClose={closePopup}
                />
            )}
        </div>
    );
}

export default Shift;
