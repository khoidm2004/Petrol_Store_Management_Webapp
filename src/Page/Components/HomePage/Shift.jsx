import { useEffect, useState } from 'react';
import useShiftStore from '../../../store/shiftStore.js';
import useProductStore from "../../../store/productStore.js";
import usePumpStore from "../../../store/pumpStore.js";
import useStaffStore from "../../../store/staffStore.js";
import { AiOutlineClose } from "react-icons/ai";
import { TbEyeEdit } from "react-icons/tb";
import { FaRegMinusSquare } from "react-icons/fa";
import 'chart.js/auto'; 
import './staff.css';
import Popup from "../Popup/Popup";
import { timeConverter } from '../../../utils/timeConverter.js';
import { interactivity } from '@chakra-ui/react';

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
        startTime: '',
        endTime: '',
        pumpList:{},
        employeeList: {},
        productList: {}
    });

    useEffect(() => {   
        fetchProduct();
        fetchShift();
        fetchPump();
        fetchStaff();
    }, [fetchShift]);

    const handleEdit = (shift) => {
        setSelectedShift(shift);
    };

    const saveChanges = async () => {
        if (selectedShift) {
            if (!selectedShift.startTime || !selectedShift.endTime ||
            Object.keys(selectedShift.employeeList).length === 0 ||
            Object.keys(selectedShift.productList).length === 0
            ) {
                setPopup({
                  show: true,
                  title: "Thông báo",
                  message: "Vui lòng điền đẩy đủ thông tin của ca.",
                });
                return;
              }
            
            const start = new Date(selectedShift.startTime);
            const end = new Date(selectedShift.endTime);

            const differenceInHours = (end - start) / (1000 * 60 * 60);

            if (differenceInHours < 2) {
                setPopup({
                    show: true,
                    title: "Thông báo",
                    message: "Thời gian tối thiểu kết thúc sau 2 tiếng sau khi bắt đầu.",
                });
                return;
            }

            try {
                const status = await modifyShift(selectedShift);
                setSelectedShift(null);
            } catch (error) {
                console.error('Save error:', error);
            }
        }
    };


    const handleAddShift = async () => {
        if (!newShift.startTime || !newShift.endTime || 
        Object.keys(newShift.employeeList).length === 0 ||
        Object.keys(newShift.productList).length === 0) {
            setPopup({
              show: true,
              title: "Thông báo",
              message: "Vui lòng điền đầy đủ thông tin của ca.",
            });
            return;
          }
        
        const start = new Date(newShift.startTime);
        const end = new Date(newShift.endTime);

        const differenceInHours = (end - start) / (1000 * 60 * 60);

        if (differenceInHours < 2) {
            setPopup({
                show: true,
                title: "Thông báo",
                message: "Thời gian tối thiểu kết thúc sau 2 tiếng sau khi bắt đầu.",
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
                startTime: '',
                endTime: '',
                pumpList:{},
                employeeList: {},
                productList: {}
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
    
    const handleRemoveEmployee = (key) => {
        const newEmployeeList = { ...selectedShift.employeeList };
        delete newEmployeeList[key];

        // Re-index the employees
        const reIndexedEmployeeList = {};
        Object.values(newEmployeeList).forEach((employee, index) => {
            const newKey = `Staff${index + 1}`;
            reIndexedEmployeeList[newKey] = employee;
        });

        setSelectedShift(prevShift => ({
            ...prevShift,
            employeeList: reIndexedEmployeeList
        }));
    };

    const handleRemoveProduct = (key) => {
        const newProductList = { ...selectedShift.productList };
        delete newProductList[key];

        // Re-index the employees
        const reIndexedProductList = {};
        Object.values(newProductList).forEach((product, index) => {
            const newKey = `Product${index + 1}`;
            reIndexedProductList[newKey] = product;
        });

        setSelectedShift(prevShift => ({
            ...prevShift,
            productList: reIndexedProductList
        }));
    };

    const handleRemoveNewEmployee = (key) => {
        const newEmployeeList = { ...newShift.employeeList };
        delete newEmployeeList[key];

        const reIndexedEmployeeList = {};
        Object.values(newEmployeeList).forEach((employee, index) => {
            const newKey = `Staff${index + 1}`;
            reIndexedEmployeeList[newKey] = employee;
        });

        setNewShift(prevShift => ({
            ...prevShift,
            employeeList: reIndexedEmployeeList
        }));
    };

    const handleRemoveNewProduct = (key) => {
        const newProductList = { ...newShift.productList };
        delete newProductList[key];

        const reIndexedProductList = {};
        Object.values(newProductList).forEach((product, index) => {
            const newKey = `Product${index + 1}`;
            reIndexedProductList[newKey] = product;
        });

        setNewShift(prevShift => ({
            ...prevShift,
            productList: reIndexedProductList
        }));
    };

    const [showOverlay, setShowOverlay] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowOverlay(false);
      }, 2000);
  
      return () => clearTimeout(timer);
    }, []);
    
    const [searchQuery, setSearchQuery] = useState("");
    const filteredShifts = shifts.filter((shift) => {
        const filteredEmployees = Object.values(shift.employeeList).some((employee) => {
            return employee.fullName.toLowerCase().includes(searchQuery.toLowerCase());
        });
        return filteredEmployees;
    });
    
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(10);

    const indexOfLastStaff = currentPage * perPage;
    const indexOfFirstStaff = indexOfLastStaff - perPage;
    const displayedStaff =  filteredShifts.slice(indexOfFirstStaff, indexOfLastStaff);

    const totalPages = Math.ceil(filteredShifts.length / perPage);

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
                    <div className="loader">
                        <svg className="circular" viewBox="25 25 50 50">
                            <circle className="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
                        </svg>
                    </div>
                </div>}
            <header className='header_staff'>
                <p>THÔNG TIN CA BÁN HÀNG</p>
                <div className="search-container">
                    <input type="text" placeholder="Search..." className="search-input" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button type="button" className='push' onClick={() => setAddingShift(true)}>THÊM</button>
            </header>
            <div>
                <div className="box_shift">
                    <table className='firsttable_shift'>
                        <thead>
                            <tr className='titleOneline'>
                                <th>STT</th>
                                <th>Ca bán hàng</th>
                                <th>Nhân viên phụ trách</th>
                                <th className='view_chitiet'>Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedStaff.length > 0 ? displayedStaff.map((shift, index) => (
                                <tr className='col' id='mainstate' key={shift.ShiftId}>
                                   <td>{indexOfFirstStaff + index + 1}</td>
                                   <td>{timeConverter(Date.parse(shift.startTime)).date} : {timeConverter(Date.parse(shift.startTime)).time}
                                    <br></br> {timeConverter(Date.parse(shift.endTime)).date} : {timeConverter(Date.parse(shift.endTime)).time}
                                    </td>
                                    <td>{Object.values(shift.employeeList).map(pump => pump.fullName).join(' - ')}</td>
                                    <td className="icon_editview">
                                        <TbEyeEdit className="icon_menu" onClick={() => handleEdit(shift)} />
                                    </td>
                                </tr>
                            )): (
                                <tr>
                                    <td colSpan={6} className="no-data">Chưa tồn tại ca bán hàng</td>
                                </tr>
                            )}
                            </tbody>
                            <tfoot>
                            {displayedStaff.length > 0 && (
                                <tr>
                                    <td colSpan={6} className="noLine">
                                        <div className="pagination">
                                        <p>
                                            <span>Đang hiển thị {indexOfFirstStaff + 1} đến {Math.min(indexOfLastStaff, shifts.length)} của {shifts.length} Ca Bán Hảng </span>
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
                                    </td>
                                </tr>
                                )}
                            </tfoot>
                    </table>
                </div>
                
                {selectedShift && (
                        <>
                            <div className="overlay" onClick={() => setSelectedShift(null)}></div>
                            <div className='viewShift' value="">
                                <AiOutlineClose onClick={() => setSelectedShift(null)} className="close_icon" />
                                <h2>Ca Bán Hàng</h2>
                                <div className='Row'>
                                    <label htmlFor="">Thời gian bắt đầu
                                        <input type="datetime-local" className="time" value={selectedShift.startTime} onChange={(e) => setSelectedShift({ ...selectedShift, startTime: e.target.value })} /><hr />
                                    </label>
                                    <label htmlFor="">Thời gian kết thúc
                                        <input type="datetime-local" className="time" value={selectedShift.endTime} onChange={(e) => setSelectedShift({ ...selectedShift, endTime: e.target.value })} /><br />
                                    </label>
                                </div>
                                <hr />
                                <div>
                                    <h5>NHÂN VIÊN</h5>
                                    <div className='Staff'>
                                        {Object.entries(selectedShift.employeeList).map(([key, staffs]) => (
                                            <div key={key} className='product-item'>
                                                <p className="title_shift"> {staffs.fullName} - {staffs.email} </p>
                                                <FaRegMinusSquare className="push_icon" onClick={() => handleRemoveEmployee(key)} />
                                            </div>
                                        ))}
                                        {staff.length > 0 && Object.values(selectedShift.employeeList).length < staff.length && (
                                            <div className='product-item'>
                                                <select
                                                    value=""
                                                    onChange={(e) => {
                                                        const selectedStaff = staff.find(p => p.email === e.target.value);
                                                        const employeeCount = Object.keys(selectedShift.employeeList).length;
                                                        const newKey = `Staff${employeeCount + 1}`;

                                                        setSelectedShift(prevShift => ({
                                                            ...prevShift,
                                                            employeeList: {
                                                                ...prevShift.employeeList,
                                                                [newKey]: {
                                                                    email: selectedStaff.email,
                                                                    fullName: selectedStaff.fullName,
                                                                }
                                                            }
                                                        }));
                                                    }}>
                                                    <option value="">Thêm Nhân Viên</option>
                                                    {staff.map((newStaff) => (
                                                        !Object.values(selectedShift.employeeList).some(s => s.email === newStaff.email) && (
                                                            <option key={newStaff.email} value={newStaff.email}>
                                                                {newStaff.fullName} - {newStaff.email}
                                                            </option>
                                                        )
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <hr />
                                <div className='Row'>
                                        <h5>MẶT HÀNG</h5>
                                        <div className='Staff'>
                                        {Object.entries(selectedShift.productList).map(([key, product]) => (
                                        <div key={key} className='product-item'>
                                            <p className="title_shift">{product.productCode} - {product.productName}</p>
                                            <div>
                                                    {product.pumpList && Object.entries(product.pumpList).map(([pumpKey, pumpEntry], index) => (
                                                        <div key={index} className='pump-item'>
                                                            <p className="title_shift">{pumpEntry.pumpCode} - {pumpEntry.pumpName}</p>
                                                            <input 
                                                                type="number" 
                                                                value={pumpEntry.firstMeterReadingByLitre || ''} 
                                                                placeholder='Số công tơ (L)' 
                                                                onChange={(e) => {
                                                                    const newValue = e.target.value;
                                                                    setSelectedShift(prevShift => ({
                                                                        ...prevShift,
                                                                        productList: {
                                                                            ...prevShift.productList,
                                                                            [key]: {
                                                                                ...prevShift.productList[key],
                                                                                pumpList: {
                                                                                    ...prevShift.productList[key]?.pumpList,
                                                                                    [pumpKey]: {
                                                                                        ...prevShift.productList[key]?.pumpList?.[pumpKey],
                                                                                        firstMeterReadingByLitre: newValue
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }));
                                                                }} 
                                                            />
                                                            <input 
                                                                type="number" 
                                                                value={pumpEntry.firstMeterReadingByMoney || ''} 
                                                                placeholder='Số công tơ (M)' 
                                                                onChange={(e) => {
                                                                    const newValue = e.target.value;
                                                                    setSelectedShift(prevShift => ({
                                                                        ...prevShift,
                                                                        productList: {
                                                                            ...prevShift.productList,
                                                                            [key]: {
                                                                                ...prevShift.productList[key],
                                                                                pumpList: {
                                                                                    ...prevShift.productList[key]?.pumpList,
                                                                                    [pumpKey]: {
                                                                                        ...prevShift.productList[key]?.pumpList?.[pumpKey],
                                                                                        firstMeterReadingByMoney: newValue
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }));
                                                                }} 
                                                            />
                                                            <br />
                                                        </div>
                                                    ))}
                                                    {Object.entries(product.pumpList).length === 0 && <div>Chưa có Vòi bơm tương ứng với mặt hàng</div>}
                                                </div>
                                                <FaRegMinusSquare className="push_icon" onClick={() => handleRemoveProduct(key)} />
                                            </div>
                                        ))}
                                    {product.length > 0 && Object.values(selectedShift.productList).length < product.length &&
                                        <div className='product-item'>
                                            <select
                                                value=""
                                                onChange={(e) => {
                                                    const selectedProduct = product.find(p => parseInt(p.productCode) === parseInt(e.target.value));
                                                    const employeeCount = Object.keys(selectedShift.productList).length;

                                                     // Lấy danh sách vòi bơm tương ứng với sản phẩm
                                                    const selectedPumps = pumps.filter(pump => parseInt(pump.product.productCode) === parseInt(selectedProduct.productCode));

                                                    // Tạo một đối tượng pumpList với pumpCode và pumpName
                                                    const initialPumpList = selectedPumps.reduce((acc, pump, index) => {
                                                        acc[`pump${index + 1}`] = {
                                                            firstMeterReadingByLitre: '',
                                                            firstMeterReadingByMoney: '',
                                                            pumpCode: pump.pumpCode,
                                                            pumpName: pump.pumpName
                                                        };
                                                        return acc;
                                                    }, {});

                                                    const newKey = `Product${employeeCount + 1}`;
                                                    setSelectedShift(prevShift => ({
                                                        ...prevShift,
                                                        productList: {
                                                            ...prevShift.productList,
                                                            [newKey]: {
                                                                productCode: selectedProduct.productCode,
                                                                productName: selectedProduct.productName,
                                                                productPrice: selectedProduct.productPrice,
                                                                pumpList: initialPumpList  // Initialize empty pumpList
                                                            }
                                                        }
                                                    }));
                                                }}>
                                                <option value="">Thêm Mặt Hàng</option>
                                                {product.map(newProduct => (
                                                    !Object.values(selectedShift.productList).some(s => parseInt(s.productCode) === parseInt(newProduct.productCode)) &&
                                                    <option key={newProduct.productCode} value={newProduct.productCode}>
                                                        {newProduct.productCode} - {newProduct.productName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
}
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
                <h2>Thêm Ca Mới</h2>
                <div className='Row'>
                    <label htmlFor="startTime">Thời gian bắt đầu
                        <input type="datetime-local" id="startTime" value={newShift.startTime} onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })} />
                    </label>
                    <label htmlFor="endTime">Thời gian kết thúc
                        <input type="datetime-local" id="endTime" value={newShift.endTime} onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })} />
                    </label>
                </div>
                <hr />
                <div>
                    <h5>NHÂN VIÊN</h5>
                    <div className='Staff'>
                        {Object.entries(newShift.employeeList).map(([key, staffs]) => (
                            <div key={key} className='product-item'>
                                <p className="title_shift">{staffs.fullName} - {staffs.email}</p>
                                <FaRegMinusSquare className="push_icon" onClick={() => handleRemoveNewEmployee(key)} />
                            </div>
                        ))}
                        {staff.length > 0 && Object.values(newShift.employeeList).length < staff.length &&
                            <div className='product-item'>
                                <select
                                    value=""
                                    onChange={(e) => {
                                        const selectedStaff = staff.find(p => p.email === e.target.value);
                                        const employeeCount = Object.keys(newShift.employeeList).length;
                                        const newKey = `Staff${employeeCount + 1}`;
                                        setNewShift(prevShift => ({
                                            ...prevShift,
                                            employeeList: {
                                                ...prevShift.employeeList,
                                                [newKey]: {
                                                    email: selectedStaff.email,
                                                    fullName: selectedStaff.fullName,
                                                }
                                            }
                                        }));
                                    }}>
                                    <option value="">Thêm Nhân Viên</option>
                                    {staff.map((newStaff) => (
                                        !Object.values(newShift.employeeList).some(s => s.email === newStaff.email) &&
                                        <option key={newStaff.email} value={newStaff.email}>
                                            {newStaff.fullName} - {newStaff.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        }
                    </div>
                </div>
            <hr />
            <div className='Row'>
                <div className='Row'>
                    <h5>MẶT HÀNG</h5>
                    <h5>VÒI BƠM</h5>
                </div>
                <div className='Staff'>
                {Object.entries(newShift.productList).map(([key, product]) => (
                    <div key={key} className='product-item'>
                        <p className="title_shift">{product.productCode} - {product.productName}</p>
                        <div>
                            {pumps.filter(pump => parseInt(pump.product.productCode) === parseInt(product.productCode)).length > 0 ?
                                (pumps.filter(pump => parseInt(pump.product.productCode) === parseInt(product.productCode)).map((pumpEntry, index) => (
                                    <div key={index} className='pump-item'>
                                        <p className="title_shift">{pumpEntry.pumpCode} - {pumpEntry.pumpName}</p>
                                        <input
                                            type="number"
                                            value={newShift.productList[key]?.pumpList[`pump${index + 1}`]?.firstMeterReadingByLitre || ''}
                                            placeholder='Số công tơ (L)'
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                setNewShift(prevShift => ({
                                                    ...prevShift,
                                                    productList: {
                                                        ...prevShift.productList,
                                                        [key]: {
                                                            ...prevShift.productList[key],
                                                            pumpList: {
                                                                ...prevShift.productList[key]?.pumpList,
                                                                [`pump${index + 1}`]: {
                                                                    ...prevShift.productList[key]?.pumpList?.[`pump${index + 1}`],
                                                                    firstMeterReadingByLitre: newValue,
                                                                    pumpCode: pumpEntry.pumpCode,
                                                                    pumpName: pumpEntry.pumpName
                                                                }
                                                            }
                                                        }
                                                    }
                                                }));
                                            }} />
                                        <input
                                            type="number"
                                            value={newShift.productList[key]?.pumpList[`pump${index + 1}`]?.firstMeterReadingByMoney || ''}
                                            placeholder='Số công tơ (M)'
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                setNewShift(prevShift => ({
                                                    ...prevShift,
                                                    productList: {
                                                        ...prevShift.productList,
                                                        [key]: {
                                                            ...prevShift.productList[key],
                                                            pumpList: {
                                                                ...prevShift.productList[key]?.pumpList,
                                                                [`pump${index + 1}`]: {
                                                                    ...prevShift.productList[key]?.pumpList?.[`pump${index + 1}`],
                                                                    firstMeterReadingByMoney: newValue,
                                                                    pumpCode: pumpEntry.pumpCode,
                                                                    pumpName: pumpEntry.pumpName
                                                                }
                                                            }
                                                        }
                                                    }
                                                }));
                                            }} />
                                        <br />
                                    </div>
                                ))) : (
                                    <div>Chưa có Vòi bơm tương ứng với mặt hàng</div>
                                )
                            }
                        </div>
                        <FaRegMinusSquare className="push_icon" onClick={() => handleRemoveNewProduct(key)} />
                    </div>
                ))}
                {product.length > 0 && Object.values(newShift.productList).length < product.length &&
                    <div className='product-item'>
                        <select
                            value=""
                            onChange={(e) => {
                                const selectedProduct = product.find(p => parseInt(p.productCode) === parseInt(e.target.value));
                                const employeeCount = Object.keys(newShift.productList).length;
                                const newKey = `Product${employeeCount + 1}`;

                                // Lấy danh sách vòi bơm tương ứng với sản phẩm
                                const selectedPumps = pumps.filter(pump => parseInt(pump.product.productCode) === parseInt(selectedProduct.productCode));

                                // Tạo một đối tượng pumpList với pumpCode và pumpName
                                const initialPumpList = selectedPumps.reduce((acc, pump, index) => {
                                    acc[`pump${index + 1}`] = {
                                        firstMeterReadingByLitre: '',
                                        firstMeterReadingByMoney: '',
                                        pumpCode: pump.pumpCode,
                                        pumpName: pump.pumpName
                                    };
                                    return acc;
                                }, {});

                                // Cập nhật newShift với sản phẩm và danh sách vòi bơm tương ứng
                                setNewShift(prevShift => ({
                                    ...prevShift,
                                    productList: {
                                        ...prevShift.productList,
                                        [newKey]: {
                                            productCode: selectedProduct.productCode,
                                            productName: selectedProduct.productName,
                                            productPrice: selectedProduct.productPrice,
                                            pumpList: initialPumpList // Thêm danh sách vòi bơm vào sản phẩm
                                        }
                                    }
                                }));
                            }}>
                            <option value="">Thêm Mặt Hàng</option>
                            {product.map((newProduct) => (
                                !Object.values(newShift.productList).some(s => parseInt(s.productCode) === parseInt(newProduct.productCode)) &&
                                <option key={newProduct.productCode} value={newProduct.productCode}>
                                    {newProduct.productCode} - {newProduct.productName}
                                </option>
                            ))}
                        </select>
                    </div>
                }
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