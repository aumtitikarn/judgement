export type ThemePreference = "light" | "dark" | "system";

/** เก็บในเครื่องผู้ใช้เท่านั้น อยู่ใน namespace เดียวกับข้อมูลผู้ถาม */
export const THEME_STORAGE_KEY = "chandra-tarot:theme";

/**
 * ทำงานตอนเบราว์เซอร์ยัง parse HTML อยู่ ก่อนวาดเฟรมแรก จึงไม่เห็นธีมกะพริบ
 * ตั้ง data-theme เป็นค่าที่ตีความแล้ว (light หรือ dark) ไม่เคยเป็น system
 * ค่าตั้งต้นคือมืด เพราะคนส่วนใหญ่เปิดเว็บนี้ตอนกลางคืน
 */
export const THEME_INIT_SCRIPT = `(function(){try{var p=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(p!=="light"&&p!=="dark")p=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",p)}catch(e){}})()`;
