import PageStyles from "../assets/styles/page.module.scss";
import ElementStyles from "../assets/styles/styles.module.scss";

import { useState } from "react";
import { useNavigate } from "react-router";
import SearchBar from "../components/SearchBar/Searchbar";

const Products = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <div className={PageStyles.menu}>
        <SearchBar 
        onChange={e => setSearch(e.target.value)} 
        value={search}
        placeholder="ค้นหา" />
        <button className={ElementStyles['button-primary']} onClick={() => navigate("/add-product")}>เพิ่มสินค้า</button>
      </div>
      <section className={PageStyles['page-content']}>
        <h1>{search}</h1>
        <table className={PageStyles.table}>
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
