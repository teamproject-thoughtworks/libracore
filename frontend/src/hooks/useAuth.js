import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated, selectUserRole, logout } from "../store/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  const signOut = () => dispatch(logout());

  return {
    user,
    isAuthenticated,
    role,
    isAdmin: role === "admin",
    isStudent: role === "student",
    signOut,
  };
};
