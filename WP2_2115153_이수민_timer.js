const timerInput = document.getElementById("timerInput");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const timeDisplay = document.getElementById("timeDisplay");
const circle = document.querySelector(".circle");

let timerInterval = null;
let remainingTime = 0; // 남은 시간(초)
let totalTime = 0; // 총 타이머 시간(초)
let isPaused = false; // 일시정지 상태 확인 변수

// 타이머 초기화 함수
const resetTimer = () => {
    clearInterval(timerInterval);
    timerInterval = null;
    remainingTime = 0;
    totalTime = 0;
    isPaused = false; // 일시정지 상태 초기화
    circle.style.background = `conic-gradient(transparent 0%, transparent 100%)`; // 투명하게 초기화
    timeDisplay.textContent = "00:00"; // 시간 초기화
    startButton.disabled = false;
    stopButton.disabled = true;
    stopButton.textContent = "Stop"; // 버튼 텍스트 초기화
};

// 타이머 시작 함수
const startTimer = () => {
    const inputMinutes = parseInt(timerInput.value);

    // 유효성 검사
    if (!Number.isInteger(inputMinutes) || inputMinutes <= 0) {
        alert("Please enter a valid positive time in minutes.");
        return;
    }

    // 타이머 재설정 및 초기화
    if (!isPaused) { // 일시정지 상태가 아닐 경우에만 초기화
        resetTimer();
        remainingTime = inputMinutes * 60; // 입력된 시간(분)을 초로 변환
        totalTime = remainingTime;
    }

    isPaused = false; // 일시정지 해제

    // Start 버튼을 눌렀을 때 컬러를 꽉 채움
    circle.style.background = `conic-gradient(#DCD0D0 0% 100%, transparent 0%)`;

    startButton.disabled = true; // Start 버튼 비활성화
    stopButton.disabled = false; // Stop 버튼 활성화
    stopButton.textContent = "Stop"; // Stop 버튼 텍스트 초기화

    // 타이머 작동
    timerInterval = setInterval(() => {
        remainingTime -= 0.01;

        if (remainingTime < 0) remainingTime = 0;

        // 시간 표시
        const minutes = Math.floor(remainingTime / 60);
        const seconds = Math.floor(remainingTime % 60);
        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;

        // 원형 애니메이션 업데이트
        const percentage = (remainingTime / totalTime) * 100;
        circle.style.background = `conic-gradient(#DCD0D0 0% ${percentage}%, transparent ${percentage}% 100%)`;

        // 타이머 종료 시
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            alert("집중 시간 종료! 일어나서 스트레칭 하세요 :)");
            resetTimer();
        }
    }, 10); //부드러운 애니메이션 구현
};

// 타이머 정지 함수
const stopTimer = () => {
    if (!isPaused) { // Stop 상태로 전환
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = true;
        stopButton.textContent = "Restart"; // 버튼 텍스트를 Restart로 변경
    } else { // Restart 상태: 타이머 재시작
        startTimer();
        stopButton.textContent = "Stop"; // 버튼 텍스트를 Stop으로 변경
    }
};

// 이벤트 리스너
startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);

// 초기 상태 설정
resetTimer();
