const MobileMenu = () => {
  return (
    <div className="flex flex-col" style={{ width: "130px", height: "150px" }}>
      <a
        href="#"
        aria-current="page"
        className="px-4 py-2 text-sm text-center font-medium shadow-sm text-gray-500 bg-white rounded-tl-xl rounded-tr-xl hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
      >
        위키목록
      </a>
      <a
        href="#"
        aria-current="page"
        className="px-4 py-2 text-sm text-center font-medium shadow-sm text-gray-500 bg-white hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
      >
        자유게시판
      </a>
      <a
        href="#"
        aria-current="page"
        className="px-4 py-2 text-sm text-center font-medium shadow-sm text-gray-500 bg-white hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
      >
        알림
      </a>
      <a
        href="#"
        aria-current="page"
        className="px-4 py-2 text-sm text-center font-medium shadow-sm text-gray-500 bg-white rounded-bl-xl rounded-br-xl hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
      >
        마이페이지
      </a>
    </div>
  );
};
export default MobileMenu;
