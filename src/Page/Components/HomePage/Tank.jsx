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

    const product = useProductStore((state) => state.product); // Corrected state key for products
    const fetchProduct = useProductStore((state) => state.fetchProduct);

    const [openEmail, setOpenEmail] = useState(null);
    const [selectedTank, setSelectedTank] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [addingTank, setAddingTank] = useState(false);
    const tankId = Math.floor(100000 + Math.random() * 900000);
    
    const [newTank, setNewTank] = useState({
    id:"",
    tankId,
    tankCode: "",
    tankName: "",
    tankStatus: "On use",
    product: {
      productName: "",
      productCode: "",
    },
   });
    

    while(tanks.filter(TankMember => TankMember.tankId === tankId)){
        const tankId = Math.floor(100000 + Math.random() * 900000);
    }

    const toggleSubMenu = (email) => {
        setOpenEmail(openEmail === email ? null : email);
    };

    useEffect(() => {
        fetchTank();
        fetchProduct();
    }, [fetchTank, fetchProduct]);

    useEffect(() => {
        if (product.length > 0) {
          setNewTank({
            ...newTank,
            product: {
              productName: product[0].productName,
              productCode: product[0].productCode,
            },
          });
        }
      }, [product]);

    const handleView = (TankMember) => {
        setSelectedTank(TankMember);
        setEditMode(false);
    };

    const handleEdit = (TankMember) => {
        setSelectedTank(TankMember);
        setEditMode(true);
    };

    const saveChanges = async () => {
        if (editMode && selectedTank) {
            try {
                console.log(selectedTank);
                await modifyTank(selectedTank);
                setEditMode(false);
                setSelectedTank(null);
            } catch (error) {
                console.error('Save error:', error);
            }
        }
    };

    const handleAddTank = async () => {
        try {
            console.log(newTank);
            await addTank(newTank);
            setNewTank({
                id:"",
                tankId,
                tankCode: "",
                tankName: "",
                tankVolume: "",
                tankStatus: "On use",
                product: product.length > 0 ? {
                    productName: product[0].productName,
                    productCode: product[0].productCode
                } : { productName: "", productCode: "" }
            });
            setAddingTank(false);
        } catch (error) {
            console.error('Add Tank error:', error);
        }
    };

    const firstNumber = tanks.filter(TankMember => TankMember.tankStatus === "On use").length;
    const secondNumber = tanks.filter(TankMember => TankMember.tankStatus === "Not On use").length;
    const data = {
        labels: ['Đang kinh doanh', 'Ngừng kinh doanh'],
        datasets: [{
            label: 'Bể',
            data: [firstNumber, secondNumber],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
            ],
            hoverOffset: 10
        }]
    };

    const workingTank = tanks.filter(TankMember => TankMember.tankStatus === "On use");
    const notWorkingTank = tanks.filter(TankMember => TankMember.tankStatus === "Not On use");

    return (
        <div className='Staff'>
            <header>
                <p>THÔNG TIN BỂ</p>
                <div className="search-container">
                    <FaMagnifyingGlass className="search-icon" />
                    <input type="text" placeholder="Search..." className="search-input" />
                </div>
                <button type="button" className='push' onClick={() => setAddingTank(true)}>THÊM</button>
            </header>
            <div className='Staffs'>
                <table className='firsttable'>
                    <thead>
                        <tr className='titleOneline'>
                            <th colSpan={2}>Đang Kinh doanh</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workingTank.map((TankMember) => (
                            <tr key={TankMember.tankCode} className='col' id='mainstate'>
                                <td>{TankMember.tankName}</td>
                                <td className='iconmenu'>
                                    <IoEllipsisVerticalOutline onClick={() => toggleSubMenu(TankMember.tankCode)} />
                                    {openEmail === TankMember.tankCode && (
                                        <table id='secondarystate'>
                                            <tbody>
                                                <tr className='box'><td onClick={() => handleView(TankMember)}>VIEW</td></tr>
                                                <tr className='box'><td onClick={() => handleEdit(TankMember)}>EDIT</td></tr>
                                            </tbody>
                                        </table>)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedTank && (
                    <div className='viewStaff'>
                        <AiOutlineClose onClick={() => setSelectedTank(null)} className="close-icon" />
                        <input type="text" value={selectedTank.tankName} onChange={(e) => setSelectedTank({ ...selectedTank, tankName: e.target.value })} readOnly={!editMode} /><br />
                        <input type="text" value={selectedTank.tankCode} readOnly /><br />
                        <input type="text" value={selectedTank.tankVolume} onChange={(e) => setSelectedTank({ ...selectedTank, tankVolume: e.target.value })} readOnly={!editMode} /><br />
                        <select value={selectedTank.tankStatus} onChange={(e) => setSelectedTank({ ...selectedTank, tankStatus: e.target.value })} disabled={!editMode}>
                            <option value="On use">On use</option>
                            <option value="Not On use">Not On use</option>
                        </select>
                        <select
                            value={selectedTank.product.productCode}
                            onChange={(e) => {
                                const selectedProduct = product.find(p => p.productCode === e.target.value);
                                setSelectedTank({
                                    ...selectedTank,
                                    product: {
                                        productCode: selectedProduct.productCode,
                                        productName: selectedProduct.productName
                                    }
                                });
                            }}
                            disabled={!editMode}
                        >
                            {product.map((product) => (
                                <option key={product.productCode} value={product.productCode}>{product.productName}</option>
                            ))}
                        </select>
                        {editMode && (
                            <button className="send" onClick={saveChanges}>OK</button>
                        )}
                    </div>
                )}
                {addingTank && (
                    <div className='addStaff'>
                        <h2>Thêm Bể Mới</h2>
                        <AiOutlineClose onClick={() => setAddingTank(false)} className="close-icon" />
                        <input type="text" placeholder="Tank Name" value={newTank.tankName} onChange={(e) => setNewTank({ ...newTank, tankName: e.target.value })} /><br />
                        <input type="text" placeholder="Tank Code" value={newTank.tankCode} onChange={(e) => setNewTank({ ...newTank, tankCode: e.target.value })} /><br />
                        <input type="text" placeholder="Tank Volume" value={newTank.tankVolume} onChange={(e) => setNewTank({ ...newTank, tankVolume: e.target.value })} /><br />
                        <select value={newTank.tankStatus} onChange={(e) => setNewTank({ ...newTank, tankStatus: e.target.value })}>
                            <option value="On use">On use</option>
                            <option value="Not On use">Not On use</option>
                        </select>
                        <select  onChange={(e) => {
                            const selectedProduct = product.find(p => p.productCode === e.target.value);
                            setNewTank({
                                ...newTank,
                                product: {
                                    productCode: selectedProduct.productCode,
                                    productName: selectedProduct.productName,
                                }
                            });
                        }}>
                            {product.map((product) => (
                                <option key={product.productCode} value={product.productCode}>{product.productName}</option>
                            ))}
                        </select>
                        <button className="send" onClick={handleAddTank}>THÊM</button>
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
                            <tr>
                                <th colSpan={2}>Đã nghỉ việc</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notWorkingTank.map((TankMember) => (
                                <tr key={TankMember.tankCode} className='col' id='mainstate'>
                                    <td>{TankMember.tankName}</td>
                                    <td className='iconmenu'>
                                        <IoEllipsisVerticalOutline className="icon_secondarystate" onClick={() => toggleSubMenu(TankMember.tankCode)} />
                                        {openEmail === TankMember.tankCode && (
                                            <table id='secondarystate'>
                                                <tbody>
                                                    <tr className='box'><td onClick={() => handleView(TankMember)}>VIEW</td></tr>
                                                    <tr className='box'><td onClick={() => handleEdit(TankMember)}>EDIT</td></tr>
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
    );
}

export default Tank;
