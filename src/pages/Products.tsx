import PageStyles from "../assets/styles/page.module.scss";
import ElementStyles from "../assets/styles/styles.module.scss";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SearchBar from "../components/SearchBar/Searchbar";

const useBarcodeScanner = (onScan: (barcode: string) => void) => {
  useEffect(() => {
    let barcode = "";
    let timeout: NodeJS.Timeout;

    const handleKeyPress = (e: KeyboardEvent) => {
      // สมมุติว่าเครื่องสแกนจบข้อมูลด้วย Enter (key === 'Enter')
      if (e.key === "Enter") {
        if (barcode) {
          onScan(barcode);
          barcode = "";
        }
        clearTimeout(timeout);
      } else {
        barcode += e.key;
        clearTimeout(timeout);
        // ถ้าไม่มี keypress เพิ่มภายใน 100ms ถือว่าเป็นการพิมพ์จากคีย์บอร์ดทั่วไป
        timeout = setTimeout(() => {
          barcode = "";
        }, 100);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [onScan]);
};


const Products = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [scannedCode, setScannedCode] = useState<string>("");

  useBarcodeScanner((code) => {
    setScannedCode(code);
  });


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
        <h1>{scannedCode}</h1>
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
