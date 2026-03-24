import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 rtl">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-yellow-500 mb-4">404</h1>
        <p className="text-2xl text-gray-300 mb-8">الصفحة غير موجودة</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors duration-200"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
