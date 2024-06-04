import { useEffect, useState } from 'react';
import usePumpStore from "../../../store/pumpStore.js";
import useTankStore from "../../../store/tankStore.js";
import useProductStore from "../../../store/productStore.js";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Doughnut } from "react-chartjs-2";
import 'chart.js/auto';
import './staff.css';

export const Pump = () => {
    const pumps = usePumpStore((state) => state.pumps);
    const fetchPump = usePumpStore((state) => state.fetchPump);
    const addPump = usePumpStore((state) => state.addPump);
    const modifyPump = usePumpStore((state) => state.modifyPump);

    const { product, fetchProduct} = useProductStore();
    const { tanks, fetchTank} = useTankStore();
    const [openEmail, setOpenEmail] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [addingStaff, setAddingStaff] = useState(false);
    const [newStaff, setNewStaff] = useState({
        tankId: "",
        pumpCode: "",
        pumpName: "",
        pumpStatus: "On use",
        product: {
            productName: "null",
            productCode: "null",
        },
        tank: {
            tankName: "null",
            tankCode: "null",
        },
    });

    const toggleSubMenu = (email) => {
        if (openEmail === email) {
            setOpenEmail(null); 
        } else {
            setOpenEmail(email);  
        }
    };

    useEffect(() => {
        fetchPump();
    }, [fetchPump]);
    
    useEffect(() => {
        fetchTank();
    }, [fetchTank]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleView = (staffMember) => {
        setSelectedStaff(staffMember);
        setEditMode(false);
    };

    const handleEdit = (staffMember) => {
        setSelectedStaff(staffMember);
        setEditMode(true);
    };

    const saveChanges = async () => {
        if (editMode && selectedStaff) {
            try {
                console.log(selectedStaff)
                await modifyPump(selectedStaff); 
                setEditMode(false);
                setSelectedStaff(null);
            } catch (error) {
                console.error('Save error:', error);
            }
        }
    };

    const handleAddStaff = async () => {
        try {
            console.log(newStaff);
            await addPump(newStaff);
            setNewStaff({
                pumpId: "",
                pumpCode: "",
                pumpName: "",
                pumpStatus: "On use",
                product: {
                    productName: "",
                    productCode: "",
                },
                tank: {
                    tankName: "",
                    tankCode: "",
                },
            });
            setAddingStaff(false);
        } catch (error) {
            // console.error('Add staff error:', error);
        }
    };

    const data = {
        labels: ['Red','blue'],
        datasets: [{
          label: 'My First Dataset',
          data: [300, 70],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
          ],
          hoverOffset: 10
        }]
    };

    const workingStaff = pumps.filter(staffMember => staffMember.pumpStatus === "On use");
    const notWorkingStaff = pumps.filter(staffMember => staffMember.pumpStatus === "Not On use");

    return (
        <div  className='Staff'>
            <header>
                <p>THÔNG TIN VÒI BƠM</p>
                <div className="search-container">
                    <FaMagnifyingGlass className="search-icon" />
                    <input type="text" placeholder="Search..." className="search-input" />
                </div>
                <button type="button" className='push' onClick={() => setAddingStaff(true)}>THÊM</button>
            </header>
            <div className='Staffs'>
                <table className='firsttable'>
                    <thead>
                        <tr className='titleOneline'>
                            <th colSpan={2}>Đang Kinh doanh</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workingStaff.map((staffMember) => (
                            <tr key={staffMember.pumpCode} className='col' id='mainstate'>
                                <td>{staffMember.pumpName}</td>
                                <td className='iconmenu'>
                                    <IoEllipsisVerticalOutline onClick={() => toggleSubMenu(staffMember.pumpCode)} />
                                    {openEmail === staffMember.pumpCode && (
                                        <table id='secondarystate'>
                                            <tbody>
                                                <tr className='box'><td onClick={() => handleView(staffMember)}>VIEW</td></tr>
                                                <tr className='box'><td onClick={() => handleEdit(staffMember)}>EDIT</td></tr>
                                            </tbody>
                                        </table>)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedStaff && (
                    <div className='viewStaff'>
                        <AiOutlineClose onClick={() => setSelectedStaff(null)} className="close-icon" />
                        <input type="text" value={selectedStaff.pumpName} onChange={(e) => setSelectedStaff({...selectedStaff, pumpName: e.target.value})} readOnly={!editMode} /><br/>
                        <input type="text" value={selectedStaff.pumpCode} readOnly /><br/>
                        <select value={selectedStaff.pumpStatus} onChange={(e) => setSelectedStaff({...selectedStaff, pumpStatus: e.target.value})} disabled={!editMode}>
                            <option value="On use">On use</option>
                            <option value="Not On use">Not On use</option>
                        </select>
                        <select onChange={(e) => setNewStaff({...newStaff, product: {...newStaff.product, productCode: e.target.value}})} disabled={!editMode}>
                            {product.map((productMem) =>(
                            <option key={productMem.productCode} value={productMem.productCode}>{productMem.productName}</option>
                            ))}
                        </select>
                        <select onChange={(e) => setNewStaff({...newStaff, tank: {...newStaff.tank, tankCode: e.target.value}})} disabled={!editMode}>
                            {tanks.map((productMem) =>(
                            <option key={productMem.tankCode} value={productMem.tankCode}>{productMem.tankName}</option>
                            ))}
                        </select>
                        {editMode && (
                            <button className="send" onClick={saveChanges}>OK</button>
                        )}
                    </div>
                )}
                {addingStaff && (
                    <div className='addStaff'>
                        <h2>Thêm Vòi Bơm Mới</h2>
                        <AiOutlineClose onClick={() => setAddingStaff(false)} className="close-icon" />
                        <input type="text" placeholder="Pump Name" value={newStaff.pumpName} onChange={(e) => setNewStaff({...newStaff, pumpName: e.target.value})} /><br/>
                        <input type="text" placeholder="Pump Code" value={newStaff.pumpCode} onChange={(e) => setNewStaff({...newStaff, pumpCode: e.target.value})} /><br/>
                        <select value={newStaff.pumpStatus} onChange={(e) => setNewStaff({...newStaff, pumpStatus: e.target.value})}>
                            <option value="On use">On use</option>
                            <option value="Not On use">Not On use</option>
                        </select>

                        <select onChange={(e) => setNewStaff({...newStaff, product: {...newStaff.product, productCode: e.target.value, productName: product.find(p => p.productCode === e.target.value).productName}})}>
                            {product.map((productMem) =>(
                            <option value={productMem.productCode}>{productMem.productName}</option>
                            ))}
                        </select>

                        <select onChange={(e) => setNewStaff({...newStaff, tank: {...newStaff.tank, tankCode: e.target.value, tankName: product.find(p => p.tankCode === e.target.value).tankName}})}>
                            {tanks.map((productMem) =>(
                            <option value={productMem.tankCode}>{productMem.tankName}</option>
                            ))}
                        </select>

                        <button className="send" onClick={handleAddStaff}>THÊM</button>
                    </div>
                )}

                <div className='chart-container'>
                    <Doughnut
                        data={data}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: ''
                                }
                            }
                        }}
                    />
                <table className='secondtable'>
                    <thead className='titleOffline'>
                        <tr >
                            <th colSpan={2}>Đã nghỉ việc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notWorkingStaff.map((staffMember) => (
                            <tr key={staffMember.pumpCode} className='col' id='mainstate'>
                                <td>{staffMember.pumpName}</td>
                                <td className='iconmenu'>
                                    <IoEllipsisVerticalOutline className ="icon_secondarystate" onClick={() => toggleSubMenu(staffMember.pumpCode)}/>
                                        {openEmail === staffMember.pumpCode && (
                                            <table id='secondarystate'>
                                                <tbody>
                                                    <tr className='box'><td onClick={() => handleView(staffMember)}>VIEW</td></tr>
                                                    <tr className='box'><td onClick={() => handleEdit(staffMember)}>EDIT</td></tr>
                                                </tbody>
                                            </table>)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    )
}

export default Pump;
