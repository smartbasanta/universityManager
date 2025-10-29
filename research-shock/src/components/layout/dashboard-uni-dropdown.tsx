"use client";

const UniversityProfileDropdown = () => {
  return (
    <div className="dropdown-container">
      <div
        id="university-profile"
        className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-gray-100 transition-all"
      >
        <div className="text-[#0d141c]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M239.73,208H224V96a16,16,0,0,0-16-16H164a4,4,0,0,0-4,4V208H144V32.41a16.43,16.43,0,0,0-6.16-13,16,16,0,0,0-18.72-.69L39.12,72A16,16,0,0,0,32,85.34V208H16.27A8.18,8.18,0,0,0,8,215.47,8,8,0,0,0,16,224H240a8,8,0,0,0,8-8.53A8.18,8.18,0,0,0,239.73,208ZM76,184a8,8,0,0,1-8.53,8A8.18,8.18,0,0,1,60,183.72V168.27A8.19,8.19,0,0,1,67.47,160,8,8,0,0,1,76,168Zm0-56a8,8,0,0,1-8.53,8A8.19,8.19,0,0,1,60,127.72V112.27A8.19,8.19,0,0,1,67.47,104,8,8,0,0,1,76,112Zm40,56a8,8,0,0,1-8.53,8a8.18,8.18,0,0,1-7.47-8.26V168.27a8.19,8.19,0,0,1,7.47-8.26,8,8,0,0,1,8.53,8Zm0-56a8,8,0,0,1-8.53,8a8.19,8.19,0,0,1-7.47-8.26V112.27a8.19,8.19,0,0,1,7.47-8.26,8,8,0,0,1,8.53,8Z"></path>
          </svg>
        </div>
        <div className="text-primary text-sm font-medium leading-normal flex-grow">
          University Profile
        </div>
        <div id="university-arrow" className="rotate-icon text-gray-400">
          <i className="fas fa-chevron-down text-sm"></i>
        </div>
      </div>

      {/* First-level dropdown (General, Undergrad, Grad) */}
      <div id="categories-dropdown" className="dropdown-content">
        {/* General Category */}
        <div className="dropdown-container">
          <div
            id="general-category"
            className="flex items-center gap-3 px-4 py-2 pl-10 cursor-pointer hover:bg-gray-100 transition-all"
          >
            <div className="text-primary">
              <i className="fas fa-chart-bar text-xl"></i>
            </div>
            <div className="text-primary text-sm font-medium leading-normal flex-grow">
              General
            </div>
            <div id="general-arrow" className="rotate-icon text-gray-400">
              <i className="fas fa-chevron-down text-sm"></i>
            </div>
          </div>

          {/* General Subcategories */}
          <div id="general-subcategories" className="dropdown-content">
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-info-circle text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Profile and About
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-heart text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                PE and Wellness
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-users text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Student body
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-users text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                College Life
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-football-ball text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Sport and Athletes
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-star text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Reviews
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-users text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Notable Alumni
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-flask text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Research Opportunities
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-briefcase text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Entrepreneur Opportunities
              </div>
            </div>
          </div>
        </div>

        {/* Undergrad Category */}
        <div className="dropdown-container">
          <div
            id="undergrad-category"
            className="flex items-center gap-3 px-4 py-2 pl-10 cursor-pointer hover:bg-gray-100 transition-all"
          >
            <div className="text-primary">
              <i className="fas fa-user-graduate text-xl"></i>
            </div>
            <div className="text-primary text-sm font-medium leading-normal flex-grow">
              Undergrad
            </div>
            <div id="undergrad-arrow" className="rotate-icon text-gray-400">
              <i className="fas fa-chevron-down text-sm"></i>
            </div>
          </div>

          {/* Undergrad Subcategories */}
          <div id="undergrad-subcategories" className="dropdown-content">
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-chart-pie text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Report Card
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-trophy text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Rankings
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-check-circle text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Admission and Acceptance
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-question-circle text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Will you get in?
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-dollar-sign text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Tuition and Cost
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-book-open text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Academics
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-graduation-cap text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Graduation Rate and Income
              </div>
            </div>
          </div>
        </div>

        {/* Grad Category */}
        <div className="dropdown-container">
          <div
            id="grad-category"
            className="flex items-center gap-3 px-4 py-2 pl-10 cursor-pointer hover:bg-gray-100 transition-all"
          >
            <div className="text-primary">
              <i className="fas fa-user-graduate text-xl"></i>
            </div>
            <div className="text-primary text-sm font-medium leading-normal flex-grow">
              Grad
            </div>
            <div id="grad-arrow" className="rotate-icon text-gray-400">
              <i className="fas fa-chevron-down text-sm"></i>
            </div>
          </div>

          {/* Grad Subcategories */}
          <div id="grad-subcategories" className="dropdown-content">
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-chart-pie text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Report Card
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-trophy text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Rankings
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-check-circle text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Admission and Acceptance
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-question-circle text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Will you get in?
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-dollar-sign text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Tuition and Cost
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-book-open text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Academics
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-laptop text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Distance Learning
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 pl-16 cursor-pointer hover:bg-gray-100 transition-all">
              <div className="text-primary">
                <i className="fas fa-graduation-cap text-xl"></i>
              </div>
              <div className="text-primary text-sm font-medium leading-normal">
                Graduation Rate and Income
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityProfileDropdown;
