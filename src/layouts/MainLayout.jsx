// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import ThemeToggle from '../features/Sales/components/ThemeToggle.jsx';

export default function MainLayout() {
  return (
    <div
      dir="rtl"
      style={{
        display   : 'flex',
        height    : '100vh',
        overflow  : 'hidden',
        background: 'var(--bg-root)',      // ✅ matches themes.js key
      }}
    >
      {/* Sidebar — fixed width, never shrinks */}
      <Sidebar />

      {/* Page content — fills all remaining space */}
      <main style={{
        flex      : 1,
        overflowY : 'auto',
        minWidth  : 0,                     // ✅ prevents flex blowout
        background: 'var(--bg-root)',
      }}>


      <div>
      <ThemeToggle />   {/* 👈 THIS MUST EXIST */}
      <Outlet />
    </div>

      </main>
    </div>
  );
}
//
// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Sidebar from '../components/Sidebar/Sidebar';
//
// export default function MainLayout() {
//   return (
//     <div
//       dir="rtl"
//       style={{
//         display        : 'flex',
//         height         : '100vh',
//         overflow       : 'hidden',
//         background     : 'var(--color-bg-main, #111827)',
//       }}
//     >
//       {/* ── Sidebar (always visible, fixed width) ── */}
//       <Sidebar />
//
//       {/* ── Page content fills remaining space ── */}
//       <div style={{ flex: 1, overflowY: 'auto' }}>
//         <Outlet />
//       </div>
//     </div>
//   );
// }
//
//
//
// // src/layouts/MainLayout.jsx
// // import React from 'react';
// // import { Outlet } from 'react-router-dom';
// // import Sidebar from '../components/Sidebar/Sidebar';
// //
// // const MainLayout = () => {
// //   return (
// //     <div
// //       style={{
// //         display: 'flex',
// //         flexDirection: 'row-reverse',   /* ← sidebar on RIGHT for Arabic RTL */
// //         height: '100vh',
// //         overflow: 'hidden',
// //         background: 'var(--bg-primary)',
// //       }}
// //     >
// //       <Sidebar />
// //       <main
// //         style={{
// //           flex: 1,
// //           overflowY: 'auto',
// //           height: '100vh',
// //         }}
// //       >
// //         <Outlet />
// //       </main>
// //     </div>
// //   );
// // };
// //
// // export default MainLayout;
//
