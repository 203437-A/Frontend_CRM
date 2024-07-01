import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LayoutWithSidebar from '../layouts/LayoutWithSidebar';
import Home from "./Home";
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Login from "../features/login/Login";
import Profile from "../features/profile/Profile";
import Employee from "../features/employeeManagement/components/EmployeeList/Employee";
import Client from '../features/clientManagement/components/ClientList/Client';
import ClientCategory from '../features/clientManagement/components/ClientCategoryList/ClientCategory';
import Device from '../features/deviceManagement/components/DeviceList/Device';
import Project from '../features/projectManagement/components/ProjectList/Project';
import ProjectTasks from '../features/projectManagement/components/ProjectTask/ProjectTask';
import ServicePage from '../features/servicePageManagement/components/ServicePage/ServicePage';
import Calendar from '../features/calendarManagement/components/Calendar/Calendar';


export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                </Route>
                <Route element={<LayoutWithSidebar />}>
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/client" element={<Client />} />
                        <Route path="/client/categories" element={<ClientCategory />} />
                        <Route path="/device" element={<Device />} />
                        <Route path="/project" element={<Project />} />
                        <Route path="/project/:projectId/tasks" element={<ProjectTasks />} />
                        <Route path="/service-pages" element={<ServicePage />} />
                        <Route path="/calendar" element={<Calendar />} />
                    </Route>
                    <Route element={<PrivateRoute requireStaff={true} />}>
                        <Route path="/employee" element={<Employee />} />
                    </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}
