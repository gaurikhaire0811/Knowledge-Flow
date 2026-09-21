

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in
    useEffect(() => {

        const checkLogin = async () => {

            try {

                const response = await fetch(
                    "https://knowledge-flow-hqul.onrender.com/api/profile",
                    {
                        credentials: "include"
                    }
                );

                if (response.ok) {

                    const data = await response.json();
                    setUser(data);

                } else {

                    // User is not logged in
                    setUser(null);

                }

            } catch (error) {

                console.log("Profile error:", error);
                setUser(null);

            } finally {

                setLoading(false);

            }
        };

        checkLogin();

    }, []);


    // Logout
    const logout = async () => {

        try {

            const response = await fetch(
                "https://knowledge-flow-hqul.onrender.com/api/logout",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (response.ok) {

                setUser(null);
                alert("Logged out successfully!");

            }

        } catch (error) {

            console.log("Logout error:", error);

        }
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                logout,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    return useContext(AuthContext);
}