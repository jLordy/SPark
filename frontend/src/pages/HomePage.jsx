import { useEffect } from "react";
import { useUserStore } from "../store/useUserStore"
import { PlusCircleIcon, RefreshCwIcon } from "lucide-react";
import UserCard from "../components/UserCard";
import LoginPage from "./LoginPage";
function HomePage() {
    const {users, loading, error, fetchUsers} = useUserStore();

    useEffect(() => {
        fetchUsers()
    }, []);
    console.log("users", users)
    return (

        <main className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <button className="btn btn-primary">
                    <PlusCircleIcon className="size-5 mr-2"/>
                    Add User
                </button>
                <button className="btn btn-ghost btn-circle" onClick={fetchUsers}>
                    <RefreshCwIcon className="size-5 mr-2"/>
                </button>
            </div>
            
            {error && <div className="alert alert-error mb-8">{error}</div>}
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loading loading-spinner loading-lg"/>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <UserCard key={user.id} user={user}/>
                    ))}
                </div>
            )}
        </main>
    )
}

export default HomePage