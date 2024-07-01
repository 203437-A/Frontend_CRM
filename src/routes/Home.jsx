import { Navigate } from "react-router-dom";
export default function Home(){
    return(
        <div>
            {!localStorage.getItem('token') && <Navigate to={'/login'}/>}
            {localStorage.getItem('token') && <Navigate to={'/profile'}/>}
        </div>
    );
}