import { useAuth } from "../hooks/useAuth"

const History = () => {
  const { logout } = useAuth();
  return (
    <div>
      History
      <hr />
      <button onClick={logout}>Logout</button>

    </div>
  )
}

export default History
