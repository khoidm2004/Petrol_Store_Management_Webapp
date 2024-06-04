import { useEffect, useState } from 'react';
import useStaffStore from "../../store/staffStore.js";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import useShowToast from '../../hooks/useShowToast.js';
import { AiOutlineClose } from "react-icons/ai";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Doughnut } from "react-chartjs-2";
import 'chart.js/auto';
import '../CSS/staff.css';

export const Staff = () => {
    const { staff, fetchStaff, modifyStaff, addStaff } = useStaffStore();
    const [openEmail, setOpenEmail] = useState(null);
    const showToast = useShowToast(); 
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [addingStaff, setAddingStaff] = useState(false);
    const [newStaff, setNewStaff] = useState({
        fullName: "",
        email: "",
        phoneNum: "",
        workingStatus: "isWorking"
    });

    const toggleSubMenu = (email) => {
        if (openEmail === email) {
            setOpenEmail(null); 
        } else {
            setOpenEmail(email);  
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

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
                await modifyStaff(selectedStaff, showToast); 
                setEditMode(false);
                setSelectedStaff(null);
            } catch (error) {
                console.error('Save error:', error);
            }
        }
    };

    const handleAddStaff = async () => {
        try {
            await addStaff(newStaff, showToast);
            setNewStaff({
                fullName: "",
                email: "",
                phoneNum: "",
                workingStatus: "isWorking"
            });
            setAddingStaff(false);
        } catch (error) {
            console.error('Add staff error:', error);
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

    const workingStaff = staff.filter(staffMember => staffMember.workingStatus === "isWorking");
    const notWorkingStaff = staff.filter(staffMember => staffMember.workingStatus === "notWorking");

    return (
        <div  className='Staff'>
            <header>
                <p>THÔNG TIN NHÂN VIÊN</p>
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
                            <th colSpan={2}>Đang làm việc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workingStaff.map((staffMember) => (
                            <tr key={staffMember.StaffId} className='col' id='mainstate'>
                                <td>{staffMember.fullName}</td>
                                <td className='iconmenu'>
                                    <IoEllipsisVerticalOutline onClick={() => toggleSubMenu(staffMember.email)} />
                                    {openEmail === staffMember.email && (
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
                        <input type="text" value={selectedStaff.fullName} onChange={(e) => setSelectedStaff({...selectedStaff, fullName: e.target.value})} readOnly={!editMode} /><br/>
                        <input type="text" value={selectedStaff.email} readOnly /><br/>
                        <input type="text" value={selectedStaff.phoneNum} onChange={(e) => setSelectedStaff({...selectedStaff, phoneNum: e.target.value})} readOnly={!editMode} /><br/>
                        <select value={selectedStaff.workingStatus} onChange={(e) => setSelectedStaff({...selectedStaff, workingStatus: e.target.value})} disabled={!editMode}>
                            <option value="isWorking">isWorking</option>
                            <option value="notWorking">notWorking</option>
                        </select>
                        {editMode && (
                            <button className="send" onClick={saveChanges}>OK</button>
                        )}
                    </div>
                )}
                {addingStaff && (
                    <div className='addStaff'>
                        <h2>Thêm Nhân Viên Mới</h2>
                        <AiOutlineClose onClick={() => setAddingStaff(false)} className="close-icon" />
                        <input type="text" placeholder="Full Name" value={newStaff.fullName} onChange={(e) => setNewStaff({...newStaff, fullName: e.target.value})} /><br/>
                        <input type="text" placeholder="Email" value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} /><br/>
                        <input type="text" placeholder="Phone Number" value={newStaff.phoneNum} onChange={(e) => setNewStaff({...newStaff, phoneNum: e.target.value})} /><br/>
                        <select value={newStaff.workingStatus} onChange={(e) => setNewStaff({...newStaff, workingStatus: e.target.value})}>
                            <option value="isWorking">isWorking</option>
                            <option value="notWorking">notWorking</option>
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
                            <tr key={staffMember.StaffId} className='col' id='mainstate'>
                                <td>{staffMember.fullName}</td>
                                <td className='iconmenu'>
                                    <IoEllipsisVerticalOutline className ="icon_secondarystate" onClick={() => toggleSubMenu(staffMember.email)}/>
                                        {openEmail === staffMember.email && (
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

export default Staff;
