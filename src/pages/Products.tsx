import Styles from "../assets/styles/page.module.scss";
import ElementStyles from "../assets/styles/styles.module.scss";

import { useState } from "react";
import { useNavigate } from "react-router";

const Products = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <div className={Styles.menu}>
        <input
          type="text"
          placeholder="ค้นหาสินค้า..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className={ElementStyles['button-primary']} onClick={() => navigate("/add-product")}>เพิ่มสินค้า</button>
      </div>
      <section>
        <table className={Styles.table}>
          <thead>
            <tr>
              <th>รหัสสินค้า</th>
              <th>ชื่อสินค้า</th>
              <th>ราคาต่อหน่วย</th>
              <th>จำนวน</th>
              <th>ราคารวม</th>
            </tr>
          </thead>
          <tbody>
            {/* โหลดข้อมูลจาก API และแสดงในตาราง */}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default Products;
