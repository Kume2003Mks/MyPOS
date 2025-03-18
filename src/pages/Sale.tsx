import { useEffect, useState } from "react";
import Database from "@tauri-apps/plugin-sql";
import { Role } from "../types/type";

const Sale: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const db = await Database.load("sqlite:database.db");
        const result: Role[] = await db.select("SELECT * FROM roles");
        setRoles(result);
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError("Failed to fetch roles.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div>
      <h2>Roles List</h2>

      {loading && <p>Loading roles...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <ul>
          {roles.map((role) => (
            <li key={role.id}>
              <strong>{role.name}</strong>: {role.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sale;
