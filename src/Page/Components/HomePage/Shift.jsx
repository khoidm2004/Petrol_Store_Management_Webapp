import { useEffect, useState } from 'react';
import useShiftStore from '../../../store/shiftStore.js';
import useProductStore from "../../../store/productStore.js";
import usePumpStore from "../../../store/pumpStore.js";
import useStaffStore from "../../../store/staffStore.js";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { CgAddR } from "react-icons/cg";
import { FaRegMinusSquare } from "react-icons/fa";
import 'chart.js/auto'; 
import './Staff.css';

import { timeConverter } from '../../../utils/timeConverter.js';

export const Shift = () => {
    const shifts = useShiftStore((state) => state.shifts);
    const fetchShift = useShiftStore((state) => state.fetchShift);
    const addShift = useShiftStore((state) => state.addShift);
    const modifyShift = useShiftStore((state) => state.modifyShift);

    const { product, fetchProduct } = useProductStore();
    const { staff, fetchStaff } = useStaffStore();
    const { pumps, fetchPump } = usePumpStore();
    const [openCode, setOpenCode] = useState(null);
    const [selectedShift, setSelectedShift] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [addingShift, setAddingShift] = useState(false);
    const [newShift, setNewShift] = useState({
        startTime: new Date(),
        endTime: new Date(),
        pumpList:{
            "Pump1": { pumpName: "", pumpCode: "", firstMeterReadingByMoney: NaN, firstMeterReadingByLitre: NaN }},
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

    const toggleSubMenu = (id) => {
        if (openCode === id) {
            setOpenCode(null); 
        } else {
            setOpenCode(id);  
        }
    };

    const handleView = (shift) => {
        setSelectedShift(shift);
        setEditMode(false);
    };

    const handleEdit = (shift) => {
        setSelectedShift(shift);
        setEditMode(true);
    };

    const saveChanges = async () => {
        if (editMode && selectedShift) {
            try {
                console.log(selectedShift)
                const status = await modifyShift(selectedShift);
                console.log(status); 
                setEditMode(false);
                setSelectedShift(null);
            } catch (error) {
                console.error('Save error:', error);
            }
        }
    };

    const handleAddShift = async () => {
        try {
            console.log(newShift);
            var status = await addShift(newShift);
            console.log(status);
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
            console.error('Add shift error:', error);
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

    // console.log(timeConverter(Date.parse(shifts.endTime)));
    return (
        <div className='Staff'>
            <header>
                <p>THÔNG TIN CA BÁN HÀNG</p>
                <div className="search-container">
                    <FaMagnifyingGlass className="search-icon" />
                    <input type="text" placeholder="Search..." className="search-input" />
                </div>
                <button type="button" className='push' onClick={() => setAddingShift(true)}>THÊM</button>
            </header>
            <div className='Staff'>
                <table className='firsttable_shift'>
                    <thead>
                        <tr className='titleOneline'>
                            <th>Mã nhân viên</th>
                            <th>Mã vòi bơm</th>
                            <th>Mã mặt hàng</th>
                            <th colSpan={2}>Thời gian làm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shifts.length > 0 ? shifts.map((shift) => (
                            <tr className='col' id='mainstate' key={shift.id}>
                                <td>{Object.values(shift.employeeList).map(pump => pump.fullName).join(' - ')}</td>
                                <td>{Object.values(shift.pumpList).map(pump => pump.pumpName).join(' - ')}</td>
                                <td>{Object.values(shift.productList).map(product => product.productName).join(' - ')}</td>
                                <td>{timeConverter(Date.parse(shift.startTime)).date} : {timeConverter(Date.parse(shift.startTime)).time} -
                                    {timeConverter(Date.parse(shift.endTime)).date} : {timeConverter(Date.parse(shift.endTime)).time} -

                                </td>
                                <td className="icon_editview">
                                    <IoEllipsisVerticalOutline className="icon_menu" onClick={() => toggleSubMenu(shift)} />
                                    {openCode === shift && (
                                        <table className="secondarystate">
                                            <tbody>
                                                <tr className='box'><td onClick={() => handleView(shift)}>VIEW</td></tr>
                                                <tr className='box'><td onClick={() => handleEdit(shift)}>EDIT</td></tr>
                                            </tbody>
                                        </table>
                                    )}
                                </td>
                            </tr>
                        )): (
                            <tr>
                                <td colSpan={5}>Chưa tồn tại ca bán hàng</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {selectedShift && (
                    <div className='viewShift' value="">
                          <br></br>
                        <AiOutlineClose onClick={() => setSelectedShift(null)} className="close-icon" />
                            <label htmlFor="">Thời gian bắt đầu</label>
                        <input type="datetime-local" className="time"  value={selectedShift.startTime} onChange={(e) => setSelectedShift({ ...selectedShift, startTime: e.target.value })} readOnly={!editMode} /><hr />
                            <label htmlFor="">Thời gian kết thúc</label>
                        <input type="datetime-local" className="time"  value={selectedShift.endTime} onChange={(e) => setSelectedShift({ ...selectedShift, endTime: e.target.value })} readOnly={!editMode} /><br />
                        <hr />
                            <div className='Staffs'>
                                <h5>NHÂN VIÊN <CgAddR className='pull_icon' onClick={handleAddEmployee} style={{ display: editMode ? 'block' : 'none' }} /></h5>
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
                                                                fullName: selectedStaff.fullName,
                                                                email: selectedStaff.email,
                                                            }
                                                        }
                                                    });
                                                }}
                                                disabled={!editMode}>
                                                {staff.map((newStaff) => (
                                                    <option key={newStaff.email} value={newStaff.email}>
                                                        {newStaff.fullName} - {newStaff.email}
                                                    </option>
                                                ))}
                                            </select>
                                            <FaRegMinusSquare className="push_icon" onClick={() => handleRemoveEmployee(key)} style={{ display: editMode ? 'block' : 'none' }}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <hr />
                            <div className='Staffs'>
                                <h5>MẶT HÀNG <CgAddR className='pull_icon' onClick={handleAddProduct} style={{ display: editMode ? 'block' : 'none' }} /> </h5>
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
                                                }}
                                                disabled={!editMode}>
                                                {product.map((newproduct) => (
                                                    <option key={newproduct.productCode} value={newproduct.productCode}>
                                                        {newproduct.productName} - {newproduct.productPrice} - {newproduct.productCode}
                                                    </option>
                                                ))}
                                            </select>
                                            <FaRegMinusSquare className="push_icon" onClick={() => handleRemoveProduct(key)} style={{ display: editMode ? 'block' : 'none' }}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <hr />
                            <div className='Staffs'>
                                <h5>VÒI BƠM <CgAddR className='pull_icon' onClick={handleAddPump} style={{ display: editMode ? 'block' : 'none' }} /> </h5>
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
                                                }}
                                                disabled={!editMode}
                                            >
                                                {pumps.map((newpump) => (
                                                    <option key={newpump.pumpCode} value={newpump.pumpCode}>
                                                        {newpump.pumpName} - {newpump.pumpCode}
                                                    </option>
                                                ))}
                                            </select>
                                            <input type="number" value={pump.firstMeterReadingByLitre} onChange={(e) => setSelectedShift({
                                                ...selectedShift,
                                                pumpList: {
                                                    ...selectedShift.pumpList,
                                                    [key]: {
                                                        ...selectedShift.pumpList[key],
                                                        firstMeterReadingByLitre: e.target.value
                                                    }
                                                }
                                            })} disabled={!editMode} />
                                            <input type="number" value={pump.firstMeterReadingByMoney} onChange={(e) => setSelectedShift({
                                                ...selectedShift,
                                                pumpList: {
                                                    ...selectedShift.pumpList,
                                                    [key]: {
                                                        ...selectedShift.pumpList[key],
                                                        firstMeterReadingByMoney: e.target.value
                                                    }
                                                }
                                            })} disabled={!editMode} />
                                            <FaRegMinusSquare className="push_icon" onClick={() => handleRemovePump(key)} style={{ display: editMode ? 'block' : 'none' }}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                        {editMode && (
                            <button className="send" onClick={saveChanges}>OK</button>
                        )}
                    </div>
                )}
                {addingShift && (
                    <div className='addShift'>
                        <h2>Thêm Ca Mới </h2>
                        <AiOutlineClose onClick={() => setAddingShift(false)} className="close-icon" />
                            <label htmlFor="">Thời gian bắt đầu</label>
                        <input type="datetime-local" placeholder="Start Time" value={newShift.startTime} onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })} /><br></br>
                            <label htmlFor="">Thời gian kết thúc</label>
                        <input type="datetime-local" placeholder="End Time" value={newShift.endTime} onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })} /><br />

                        <div className='Staffs'>
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
                                            {staff.map((newStaff) => (
                                                <option key={newStaff.email} value={newStaff.email}>
                                                    {newStaff.email} - {newStaff.fullName}
                                                </option>
                                            ))}
                                        </select>
                                        <FaRegMinusSquare className="push_icon" onClick={() => handleRemoveNewEmployee(key)} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='Staffs'>
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
                                            {product.map((newproduct) => (
                                                <option key={newproduct.productCode} value={newproduct.productCode}>
                                                    {newproduct.productName} - {newproduct.productPrice} - {newproduct.productCode}
                                                </option>
                                            ))}
                                        </select>
                                        <FaRegMinusSquare className="push_icon" onClick={() => handleRemoveNewProduct(key)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='Staffs'>
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
                                            {pumps.map((newpump) => (
                                                <option key={newpump.pumpCode} value={newpump.pumpCode}>
                                                    {newpump.pumpName} - {newpump.pumpCode}
                                                </option>
                                            ))}
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
                )}
            </div>
        </div>
    );
}

export default Shift;
