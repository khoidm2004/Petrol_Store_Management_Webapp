import { useEffect, useState } from 'react';
import useTankStore from "../../../store/tankStore.js";
import useProductStore from "../../../store/productStore.js";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Doughnut } from "react-chartjs-2";
import 'chart.js/auto';
import './staff.css';

export const Tank = () => {
    const tanks = useTankStore((state) => state.tanks);
    const fetchTank = useTankStore((state) => state.fetchTank);
    const addTank = useTankStore((state) => state.addTank);
    const modifyTank = useTankStore((state) => state.modifyTank);

    const { product, fetchProduct} = useProductStore();
    const [openEmail, setOpenEmail] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [addingStaff, setAddingStaff] = useState(false);
    const [newStaff, setNewStaff] = useState({
        tankId: "",
        tankCode: "",
        tankName: "",
        tankStatus: "On use",
        product: {
            productName: "null",
            productCode: "null",
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
                // console.log(selectedStaff)
                await modifyTank(selectedStaff); 
                setEditMode(false);
                setSelectedStaff(null);
            } catch (error) {
                console.error('Save error:', error);
            }
        }
    };

    const handleAddStaff = async () => {
        try {
            // console.log(newStaff);
            await addTank(newStaff);
            setNewStaff({
                tankId: "",
                tankCode: "",
                tankName: "",
                tankStatus: "On use",
                product: {
                    productName: "",
                    productCode: "",
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

    const workingStaff = tanks.filter(staffMember => staffMember.tankStatus === "On use");
    const notWorkingStaff = tanks.filter(staffMember => staffMember.tankStatus === "Not On use");

    return (
        <div  className='Staff'>
            <header>
                <p>THÔNG TIN BỂ</p>
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
                            <tr key={staffMember.tankCode} className='col' id='mainstate'>
                                <td>{staffMember.tankName}</td>
                                <td className='iconmenu'>
                                    <IoEllipsisVerticalOutline onClick={() => toggleSubMenu(staffMember.tankCode)} />
                                    {openEmail === staffMember.tankCode && (
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
                        <input type="text" value={selectedStaff.tankName} onChange={(e) => setSelectedStaff({...selectedStaff, tankName: e.target.value})} readOnly={!editMode} /><br/>
                        <input type="text" value={selectedStaff.tankCode} readOnly /><br/>
                        <input type="text" value={selectedStaff.tankVolume} onChange={(e) => setSelectedStaff({...selectedStaff, tankVolume: e.target.value})} readOnly={!editMode} /><br/>
                        <select value={selectedStaff.tankStatus} onChange={(e) => setSelectedStaff({...selectedStaff, tankStatus: e.target.value})} disabled={!editMode}>
                            <option value="On use">On use</option>
                            <option value="Not On use">Not On use</option>
                        </select>
                        <select onChange={(e) => setNewStaff({...newStaff, product: {...newStaff.product, productCode: e.target.value}})} disabled={!editMode}>
                            {product.map((productMem) =>(
                            <option key={productMem.productCode} value={productMem.productCode}>{productMem.productName}</option>
                            ))}
                        </select>
                        {editMode && (
                            <button className="send" onClick={saveChanges}>OK</button>
                        )}
                    </div>
                )}
                {addingStaff && (
                    <div className='addStaff'>
                        <h2>Thêm Bể Mới</h2>
                        <AiOutlineClose onClick={() => setAddingStaff(false)} className="close-icon" />
                        <input type="text" placeholder="Tank Name" value={newStaff.tankName} onChange={(e) => setNewStaff({...newStaff, tankName: e.target.value})} /><br/>
                        <input type="text" placeholder="Tank Code" value={newStaff.tankCode} onChange={(e) => setNewStaff({...newStaff, tankCode: e.target.value})} /><br/>
                        <input type="text" placeholder="Tank Volume" value={newStaff.tankVolume} onChange={(e) => setNewStaff({...newStaff, tankVolume: e.target.value})} /><br/>
                        <select value={newStaff.tankStatus} onChange={(e) => setNewStaff({...newStaff, tankStatus: e.target.value})}>
                            <option value="On use">On use</option>
                            <option value="Not On use">Not On use</option>
                        </select>
                        <select onChange={(e) => setNewStaff({...newStaff, product: {...newStaff.product, productCode: e.target.value, productName: product.find(p => p.productCode === e.target.value).productName}})}>
                            {product.map((productMem) =>(
                            <option value={productMem.productCode}>{productMem.productName}</option>
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
                            <tr key={staffMember.tankCode} className='col' id='mainstate'>
                                <td>{staffMember.tankName}</td>
                                <td className='iconmenu'>
                                    <IoEllipsisVerticalOutline className ="icon_secondarystate" onClick={() => toggleSubMenu(staffMember.tankCode)}/>
                                        {openEmail === staffMember.tankCode && (
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

export default Tank;
