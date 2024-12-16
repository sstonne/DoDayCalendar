// URL에서 현재 날짜 가져오기
const urlParams = new URLSearchParams(window.location.search);
const currentDate = urlParams.get("date");

if (!currentDate) {
    alert("날짜가 설정되지 않았습니다. 캘린더 페이지로 돌아감");
    window.location.href = "index.html";
}

// 데이터 저장소
const data = {
    tasks: [], // To-Do List 데이터
    categories: {} // 카테고리 데이터
};

// LocalStorage에서 데이터 로드
const loadDayData = () => {
    const calendarData = JSON.parse(localStorage.getItem("calendarData")) || {};
    const dayData = calendarData[currentDate] || { mood: "", completionRate: 0, tasks: [] };

    // LocalStorage에서 로드된 데이터를 data.tasks에 반영
    document.getElementById("moodSelector").value = dayData.mood || "";
    data.tasks = dayData.tasks ? [...dayData.tasks] : []; // 이전 데이터를 정확히 설정
    renderTasks();
    updateCompletionRate();

    console.log("Data loaded for date:", currentDate, dayData); // 디버깅 로그
};

// LocalStorage에 데이터 저장
const saveDayData = () => {
    const calendarData = JSON.parse(localStorage.getItem("calendarData")) || {};
    const mood = document.getElementById("moodSelector").value;
    const totalTasks = data.tasks.length;
    const completedTasks = data.tasks.filter((task) => task.completed).length;
    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // 현재 날짜의 데이터 업데이트
    calendarData[currentDate] = { mood, completionRate, tasks: [...data.tasks] }; // 정확히 덮어쓰기
    localStorage.setItem("calendarData", JSON.stringify(calendarData));

    console.log("Data saved for date:", currentDate, calendarData[currentDate]); // 디버깅
};


const createEditModal = (task, index) => {
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("edit-modal");

    modalContainer.innerHTML = `
        <div class="modal-content">
            <h3>Edit Task</h3>
            <label>Task:</label>
            <input type="text" id="editTaskName" value="${task.text}" />
            
            <label>Time:</label>
            <input type="time" id="editTaskTime" value="${task.time ? task.time : ''}" />
            
            <label>Category:</label>
            <input type="text" id="editTaskCategory" value="${task.category}" />

            <div class="modal-buttons">
                <button id="closeEdit">Cancel</button>
                <button id="saveEdit">Save</button>
            </div>
        </div>
    `;

 
    document.body.appendChild(modalContainer);

    document.getElementById("closeEdit").addEventListener("click", () => {
        modalContainer.remove();
    });

    
    document.getElementById("saveEdit").addEventListener("click", () => {
        saveEditedTask(index);
        modalContainer.remove();
    });
};


const saveEditedTask = (index) => {
    const updatedText = document.getElementById("editTaskName").value.trim();
    const updatedTime = document.getElementById("editTaskTime").value;
    const updatedCategory = document.getElementById("editTaskCategory").value.trim();

    if (!updatedText) {
        alert("일정을 작성해주세요!");
        return;
    }

    data.tasks[index].text = updatedText;
    data.tasks[index].time = updatedTime ? updatedTime : null;
    data.tasks[index].category = updatedCategory;

    saveDayData();
    renderTasks();
};
 
const renderTasks = () => {
    const categoriesContainer = document.getElementById("categories");
    categoriesContainer.innerHTML = "";

    const categorizedTasks = {};

    data.tasks.forEach((task) => {
        if (!categorizedTasks[task.category]) {
            categorizedTasks[task.category] = [];
        }
        categorizedTasks[task.category].push(task);
    });

    Object.keys(categorizedTasks).forEach((category) => {
        const list = document.createElement("ul");
        list.id = `list-${category}`;
        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category");
        categoryDiv.innerHTML = `<h2>${category}</h2>`;
        categoryDiv.appendChild(list);

        categorizedTasks[category].forEach((task, index) => {
            const listItem = document.createElement("li");
            listItem.classList.add("todo-item");

            const taskLeft = document.createElement("div");
            taskLeft.classList.add("todo-left");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.addEventListener("change", () => {
                task.completed = checkbox.checked;
                updateCompletionRate();
                saveDayData();
                renderTasks();
            });

            const taskText = document.createElement("span");
            taskText.classList.add("todo-text");
            if (task.completed) taskText.classList.add("completed");
            taskText.innerText = task.text;

            // 시간 라벨 
            const timeLabel = document.createElement("span");
            timeLabel.classList.add("time-label");
            timeLabel.innerText = task.time && task.time !== "null" ? task.time : "";

            // 수정 버튼 
            const editButton = document.createElement("img");
            editButton.src = "2115153_edit.png"; 
            editButton.alt = "Edit";
            editButton.classList.add("edit-button");
            editButton.style.cursor = "pointer";
            editButton.style.width = "16px";
            editButton.style.height = "16px";
            editButton.addEventListener("click", () => {
                editTaskModal(task, index); 
            });

            // 삭제 버튼
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
            deleteButton.innerHTML = '<img src="2115153_trash.png" alt="Delete" style="width:15px; height:15px;">';
            deleteButton.addEventListener("click", () => {
                // 전체 tasks 배열에서 정확한 인덱스를 찾기
                const taskIndex = data.tasks.findIndex(t => t.text === task.text && t.time === task.time && t.category === task.category);
                if (taskIndex !== -1) {
                    data.tasks.splice(taskIndex, 1); // 해당 인덱스 삭제
                    renderTasks(); // 다시 렌더링
                    updateCompletionRate(); // 완료율 업데이트
                    saveDayData(); // 데이터 저장
                }
            });

            taskLeft.appendChild(checkbox);
            taskLeft.appendChild(taskText);

            listItem.appendChild(taskLeft);
            listItem.appendChild(timeLabel);
            listItem.appendChild(editButton); 
            listItem.appendChild(deleteButton); 

            list.appendChild(listItem);
        });

        categoriesContainer.appendChild(categoryDiv);
    });
};

// 일정 수정 함수수
const editTaskModal = (task, index) => {
    const modal = document.createElement("div");
    modal.classList.add("edit-modal");
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Edit Task</h3>
            <label>Task:</label>
            <input type="text" id="editTaskName" value="${task.text}" />
            
            <label>Time:</label>
            <input type="time" id="editTaskTime" value="${task.time || ''}" />
            
            <label>Category:</label>
            <input type="text" id="editTaskCategory" value="${task.category}" />

            <div class="modal-buttons">
                <button id="closeEdit">Cancel</button>
                <button id="saveEdit">Save</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal); // 모달 추가

    // 이벤트 리스너
    document.getElementById("saveEdit").addEventListener("click", () => {
        // 변경된 데이터 저장
        task.text = document.getElementById("editTaskName").value.trim();
        task.time = document.getElementById("editTaskTime").value || null;
        task.category = document.getElementById("editTaskCategory").value.trim();

        // 저장 및 렌더링
        saveDayData();
        renderTasks();
        modal.remove();
    });

    document.getElementById("closeEdit").addEventListener("click", () => {
        modal.remove();
    });
};


// 완료율 계산
const updateCompletionRate = () => {
    const totalTasks = data.tasks.length;
    const completedTasks = data.tasks.filter((task) => task.completed).length;
    const rate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    document.getElementById("completionRate").innerText = `Completion Rate: ${rate}%`;
    saveDayData();
};

document.getElementById("moodSelector").addEventListener("change", () => {
    saveDayData(); // mood 값 변경 시 즉시 저장
});

// 일정 추가
document.getElementById("addButton").addEventListener("click", () => {
    const taskInput = document.getElementById("todoInput").value.trim();
    const enableTime = document.getElementById("enableTime").checked;
    const timeInput = document.getElementById("todoTime").value;
    const categoryInput = document.getElementById("categoryInput").value.trim();

    if (!taskInput) {
        alert("Please enter a task!");
        return;
    }

    const task = {
        text: taskInput,
        time: enableTime ? timeInput : null, // 시간 설정 여부
        category: categoryInput || "Uncategorized", // 카테고리
        completed: false
    };

    // 데이터에 추가
    data.tasks.push(task);

    // 정렬 수행 (시간 없는 일정은 맨 앞, 나머지는 시간 순서)
    data.tasks.sort((a, b) => {
        if (!a.time && !b.time) return 0; // 둘 다 시간이 없는 경우, 순서 유지
        if (!a.time) return -1; // 시간이 없는 일정은 앞으로
        if (!b.time) return 1;  // 시간이 없는 일정은 앞으로
        return a.time.localeCompare(b.time); // 시간이 있는 경우, 시간 순으로 정렬
    });

    renderTasks();
    updateCompletionRate();
    saveDayData();

});

const quotes = [
    "The best way to get started is to quit talking and begin doing. - Walt Disney",
    "Don't let yesterday take up too much of today. - Will Rogers",
    "You learn more from failure than from success. - Anonymous",
    "It's not whether you get knocked down, it's whether you get up. - Vince Lombardi",
    "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
    "As you sow, so shall you reap. - Proverbs", 
    "생각은 현실이 된다. - 나폴레옹 힐",
    "우리가 노력 없이 얻는 거의 유일한 것은 노년이다. - 글로리아 피처",
    "배우나 생각하지 않으면 공허하고, 생각하나 배우지 않으면 위험하다 - 공자"
];

// 명언을 랜덤으로 선택해서 표시
const displayRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById("quote").innerText = quotes[randomIndex];
};

// 페이지 로드 시 호출
displayRandomQuote();


// 초기화
loadDayData();
