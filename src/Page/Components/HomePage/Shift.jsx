import { useEffect, useState } from 'react';
import useShiftStore from '../../../store/shiftStore.js';
import useProductStore from "../../../store/productStore.js";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { FaMagnifyingGlass } from "react-icons/fa6";
import 'chart.js/auto'; 
import './staff.css';

import { timeConverter } from '../../../utils/timeConverter.js';
export const Shift = () => {
    const shifts = useShiftStore((state) => state.shifts);
    const fetchShift = useShiftStore((state) => state.fetchShift);
    const addShift = useShiftStore((state) => state.addShift);
    const modifyShift = useShiftStore((state) => state.modifyShift);

    const { product, fetchProduct } = useProductStore();
    const [openCode, setOpenCode] = useState(null);
    const [selectedShift, setSelectedShift] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [addingShift, setAddingShift] = useState(false);
    const time = timeConverter();
    const [newShift, setNewShift] = useState({
        startTime: "",
        endTime: "",
        pumpList: {
            "Pump1": { pumpName: "", pumpCode: "", firstMeterReadingByMoney: "", firstMeterReadingByLitre: "" }
        },
        employeeList: [],
        productList: {
            "Product1": { productName: "", productCode: "", productPrice: "" }
        },
    });

    console.log(product);
    console.log()
    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    useEffect(() => {
        fetchShift();
    }, [fetchShift]);

    const toggleSubMenu = (code) => {
        if (openCode === code) {
            setOpenCode(null); 
        } else {
            setOpenCode(code);  
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
                await modifyShift(selectedShift); 
                setEditMode(false);
                setSelectedShift(null);
            } catch (error) {
                console.error('Save error:', error);
            }
        }
    };

    const handleAddShift = async () => {
        try {
            await addShift(newShift);
            setNewShift({
                startTime: "",
                endTime: "",
                pumpList: {
                    "Pump1": { pumpName: "", pumpCode: "", firstMeterReadingByMoney: "", firstMeterReadingByLitre: "" }
                },
                employeeList: [],
                productList: {
                    "Product1": { productName: "", productCode: "", productPrice: "" }
                },
            });
            setAddingShift(false);
        } catch (error) {
            console.error('Add shift error:', error);
        }
    };

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
            <div className='Staffs'>
                <table className='firsttable'>
                    <thead>
                        <tr className='titleOneline'>
                            <th>Mã nhân viên</th>
                            <th>Mã vòi bơm</th>
                            <th>Mã mặt hàng</th>
                            <th colSpan={2}>Thời gian làm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shifts.map((shift) => (
                            <tr className='col' id='mainstate' key={shift.id}>
                                <td>{shift.employeeList.join(', ')}</td>
                                <td>{Object.values(shift.pumpList).map(pump => pump.pumpName).join(' - ')}</td>
                                <td>{Object.values(shift.productList).map(product => product.productName).join(' - ')}</td>
                                <td>{timeConverter(shift.startTime)} - {timeConverter(shift.endTime)}</td>
                                <td className='iconmenu'>
                                    <IoEllipsisVerticalOutline onClick={() => toggleSubMenu(shift.id)} />
                                    {openCode === shift.id && (
                                        <table id='secondarystate'>
                                            <tbody>
                                                <tr className='box'><td onClick={() => handleView(shift)}>VIEW</td></tr>
                                                <tr className='box'><td onClick={() => handleEdit(shift)}>EDIT</td></tr>
                                            </tbody>
                                        </table>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {selectedShift && (
                    <div className='viewShift'>
                        <AiOutlineClose onClick={() => setSelectedShift(null)} className="close-icon" />
                        <input type="text" className="time" value={selectedShift.startTime} onChange={(e) => setSelectedShift({ ...selectedShift, startTime: e.target.value })} readOnly={!editMode} /><hr />
                        <input type="text" className="time" value={selectedShift.endTime} onChange={(e) => setSelectedShift({ ...selectedShift, endTime: e.target.value })} readOnly={!editMode} /><br />
                        <div className='Staffs'>
                            <h2>NHÂN VIÊN</h2>
                            <div className='Staff'>
                                {Object.entries(selectedShift.pumpList).map(([key, pump]) => (
                                <div key={key}>
                                    <select value={pump.pumpName} onChange={(e) => {
                                        const newPumpList = { ...selectedShift.pumpList };
                                        newPumpList[key].pumpName = e.target.value;
                                        setSelectedShift({ ...selectedShift, pumpList: newPumpList });
                                    }} disabled={!editMode}>
                                        {pumpOptions.map(option => (
                                            <option key={option.code} value={option.name}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select><br />
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
                        <h2>Thêm Ca Mới</h2>
                        <AiOutlineClose onClick={() => setAddingShift(false)} className="close-icon" />
                        <input type="datetime-local" placeholder="Start Time" value={newShift.startTime} onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })} />
                        <input type="datetime-local" placeholder="End Time" value={newShift.endTime} onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })} /><br />
                        {Object.entries(newShift.pumpList).map(([key, pump]) => (
                            <div key={key}>
                                <input type="text" placeholder="Pump Name" value={pump.pumpName} onChange={(e) => {
                                    const newPumpList = { ...newShift.pumpList };
                                    newPumpList[key].pumpName = e.target.value;
                                    setNewShift({ ...newShift, pumpList: newPumpList });
                                }} /><br />
                                <input type="text" placeholder="Pump Code" value={pump.pumpCode} onChange={(e) => {
                                    const newPumpList = { ...newShift.pumpList };
                                    newPumpList[key].pumpCode = e.target.value;
                                    setNewShift({ ...newShift, pumpList: newPumpList });
                                }} /><br />
                                <input type="text" placeholder="First Meter Reading By Money" value={pump.firstMeterReadingByMoney} onChange={(e) => {
                                    const newPumpList = { ...newShift.pumpList };
                                    newPumpList[key].firstMeterReadingByMoney = e.target.value;
                                    setNewShift({ ...newShift, pumpList: newPumpList });
                                }} /><br />
                                <input type="text" placeholder="First Meter Reading By Litre" value={pump.firstMeterReadingByLitre} onChange={(e) => {
                                    const newPumpList = { ...newShift.pumpList };
                                    newPumpList[key].firstMeterReadingByLitre = e.target.value;
                                    setNewShift({ ...newShift, pumpList: newPumpList });
                                }} /><br />
                            </div>
                        ))}
                        {/* Add fields for employees and products here */}
                        <button className="send" onClick={handleAddShift}>THÊM</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Shift;
