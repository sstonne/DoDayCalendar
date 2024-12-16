// WP2_2115153_이수민_calendar.js
// 현재 날짜와 월 데이터
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0: January, 11: December
const today = new Date();


// 캘린더 데이터 로드
const loadCalendarData = () => {
    return JSON.parse(localStorage.getItem("calendarData")) || {};
};

// 현재 월 표시
const updateMonthHeader = () => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const header = document.getElementById("currentMonth");
    header.innerText = `${monthNames[currentMonth]} ${currentYear}`;
};

const calculateMonthlyCompletionByRecordedDays = (calendarData) => {
    let sumCompletionRate = 0; // Completion Rate 총합
    let recordedDaysCount = 0; // 일정이 기록된 날의 수

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayData = calendarData[dateKey];

        if (dayData && dayData.tasks && dayData.tasks.length > 0) {
            // 일정이 기록된 날만 포함
            sumCompletionRate += dayData.completionRate || 0;
            recordedDaysCount++;
        }
    }

    // 평균 계산
    return recordedDaysCount > 0
        ? (sumCompletionRate / recordedDaysCount).toFixed(2)
        : 0; // 일정이 없으면 0%
};

const generateCalendar = () => {
    const calendarContainer = document.getElementById("calendar");
    calendarContainer.innerHTML = ""; // 초기화

    const calendarData = loadCalendarData();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // 빈 공간 채우기 (월 시작 요일 이전)
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("day");
        emptyDiv.style.visibility = "hidden";
        calendarContainer.appendChild(emptyDiv);
    }

    // 날짜 생성
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const mood = calendarData[dateKey]?.mood || "";
        const completionRate = calendarData[dateKey]?.completionRate || 0;

        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.innerText = day;

        // 오늘 날짜 강조
        if (
            currentYear === today.getFullYear() &&
            currentMonth === today.getMonth() &&
            day === today.getDate()
        ) {
            dayDiv.classList.add("today");
        }

        // 기분에 따른 색상 및 투명도
        if (mood === "😊") {
            dayDiv.style.backgroundColor = `rgba(245, 226, 124, ${completionRate / 100})`;
        } else if (mood === "🙂") {
            dayDiv.style.backgroundColor = `rgba(189, 216, 197, ${completionRate / 100})`; 
        } else if (mood === "😍") {
            dayDiv.style.backgroundColor = `rgba(239, 169, 200, ${completionRate / 100})`; 
        } else if (mood === "😑") {
            dayDiv.style.backgroundColor = `rgba(207, 208, 210, ${completionRate / 100})`; 
        } else if (mood === "😢") {
            dayDiv.style.backgroundColor = `rgba(200, 223, 228, ${completionRate / 100})`; 
        } else if (mood === "😭") {
            dayDiv.style.backgroundColor = `rgba(207, 210, 225, ${completionRate / 100})`;
        } else if (mood === "😱") {
            dayDiv.style.backgroundColor = `rgba(220, 186, 211, ${completionRate / 100})`;
        } else if (mood === "😕") {
            dayDiv.style.backgroundColor = `rgba(215, 205, 195, ${completionRate / 100})`; 
        } else if (mood === "😡") {
            dayDiv.style.backgroundColor = `rgba(218, 145, 138, ${completionRate / 100})`; 
        }

        // 날짜 클릭 이벤트
        dayDiv.addEventListener("click", () => {
            window.location.href = `./WP2_2115153_이수민_todo.html?date=${dateKey}`;
        });

        calendarContainer.appendChild(dayDiv);
    }

    // 월별 Completion Rate 계산 및 표시
    const monthlyCompletion = calculateMonthlyCompletionByRecordedDays(calendarData);
    const monthlyDiv = document.getElementById("monthlyCompletion");
    monthlyDiv.innerText = `This month's average completion rate: ${monthlyCompletion}%`;
};


// 이전 월로 이동
document.getElementById("prevMonth").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateMonthHeader();
    generateCalendar();
});

// 다음 월로 이동
document.getElementById("nextMonth").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateMonthHeader();
    generateCalendar();
});

// 이전 연도로 이동
document.getElementById("prevYear").addEventListener("click", () => {
    currentYear--;
    updateMonthHeader();
    generateCalendar();
});

// 다음 연도로 이동
document.getElementById("nextYear").addEventListener("click", () => {
    currentYear++;
    updateMonthHeader();
    generateCalendar();
});



// 초기 데이터 저장 함수
const initializeLocalStorage = (fetchedData) => {
    // 기존에 데이터가 없을 때만 저장
    if (!localStorage.getItem("calendarData")) {

        const emptyData = {}; // 초기 데이터 없음
        localStorage.setItem("calendarData", JSON.stringify(fetchedData));
    }
};

initializeLocalStorage();
updateMonthHeader();
generateCalendar();
