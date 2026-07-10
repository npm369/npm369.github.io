const courseId = window.COURSE_ID;
const activeCourse = window.COURSE_PAGES[courseId];
const hasStreams = !!activeCourse?.streams;
const hasClassChoices = !!activeCourse?.classChoices;
const streamStorageKey = `powermind_stream_${courseId}`;
const classChoiceStorageKey = `powermind_class_choice_${courseId}`;
let selectedStream = hasStreams ? localStorage.getItem(streamStorageKey) : "";
let selectedClassChoice = hasClassChoices ? localStorage.getItem(classChoiceStorageKey) : "";

if (!activeCourse) {
  document.body.innerHTML = '<div class="wrap"><div class="card"><h2>Course not found</h2><p class="subtext">This course page is not configured yet.</p></div></div>';
  throw new Error(`Unknown course id: ${courseId}`);
}

document.title = activeCourse.title;
document.documentElement.style.setProperty("--accent", activeCourse.style.accent);
document.documentElement.style.setProperty("--accent-2", activeCourse.style.accent2);
document.documentElement.style.setProperty("--accent-3", activeCourse.style.accent3);

document.body.innerHTML = `
<section class="hero" style="background:${activeCourse.style.gradient}">
  <h1>${activeCourse.title}</h1>
  <p>${activeCourse.description}</p>
  <div class="badge-row">
    ${activeCourse.badges.map(badge => `<span class="badge">${badge}</span>`).join("")}
  </div>
</section>

<div class="wrap">
  <div id="home">
    <div class="card">
      <h2>✨ Course Overview</h2>
      <p class="subtext" style="margin-bottom:0">${activeCourse.description} Every subject is organized separately so students can navigate concepts, revise efficiently, and prepare confidently through chapter tests, subject tests, mock tests, and a final assessment.</p>
    </div>

    ${hasStreams ? `
    <div class="card" id="streamSelectorCard">
      <h2>🎓 Choose Stream</h2>
      <div class="stream-warning">Warning: Choose carefully. Once you select Science, Commerce, or Humanities, your stream will be locked on this device and cannot be changed from this page.</div>
      <p class="subtext" id="streamStatusText">Select one stream to load the correct subjects.</p>
      <div class="grid" id="streamGrid"></div>
    </div>` : ""}

    ${hasClassChoices ? `
    <div class="card" id="classChoiceCard">
      <h2>Choose Your Class</h2>
      <div class="stream-warning">Warning: Choose carefully. Once you select Class 1, 2, 3, 4, 5, 6, 7, or 8, your class will be locked on this device and cannot be changed from this page.</div>
      <p class="subtext" id="classChoiceStatusText">Select one class to open its dedicated learning page.</p>
      <div class="grid" id="classChoiceGrid"></div>
    </div>` : ""}

    <div class="card">
      <h2>📘 Subjects</h2>
      <p class="subtext">Select a subject to view its chapters and video lessons</p>
      <div class="grid" id="subjectGrid"></div>
    </div>

    <div class="card">
      <h2>📝 Tests</h2>
      <p class="subtext">Practice and assessment sections for this course</p>
      <div class="grid">
        <div class="item test-item" onclick="openChapterTestSubjects()"><span class="icon">📘</span><div class="label">Chapter Tests</div><div class="sub">Chapter-wise practice</div></div>
        <div class="item test-item" onclick="openSubjectTestSubjects()"><span class="icon">🎯</span><div class="label">Subject Tests</div><div class="sub">20 / 40 / 70 marks</div></div>
        <div class="item test-item" onclick="openMockTests()"><span class="icon">🧪</span><div class="label">Mock Tests</div><div class="sub">Exam simulation</div></div>
        <div class="item test-item" onclick="openFinalTest()"><span class="icon">🏆</span><div class="label">Final Test</div><div class="sub">Full course revision</div></div>
      </div>
    </div>
  </div>

  <div id="viewer" class="card" style="display:none">
    <button class="back-btn" onclick="goHome()">⬅ Back to Subjects</button>
    <div class="breadcrumb">Subjects &nbsp;›&nbsp; <b id="viewerSubjectName"></b></div>
    <div class="viewer-shell">
      <aside class="sidebar"><h3>Chapters</h3><div id="chapterList"></div></aside>
      <main class="content-panel"><h2 id="chapterTitle"></h2><p class="subtext" id="chapterDesc"></p><div class="video-list" id="videoList"></div></main>
    </div>
  </div>

  <div id="ctSubjects" class="card" style="display:none">
    <button class="back-btn" onclick="goHome()">⬅ Back</button>
    <h2>📘 Chapter Tests — Select Subject</h2>
    <p class="subtext">Pick a subject to see chapter-wise tests</p>
    <div class="grid" id="ctSubjectGrid"></div>
  </div>

  <div id="ctChapters" class="card" style="display:none">
    <button class="back-btn" onclick="openChapterTestSubjects()">⬅ Back to Subjects</button>
    <div class="breadcrumb">Chapter Tests &nbsp;›&nbsp; <b id="ctSubjectName"></b></div>
    <div id="ctChapterRows"></div>
  </div>

  <div id="stSubjects" class="card" style="display:none">
    <button class="back-btn" onclick="goHome()">⬅ Back</button>
    <h2>🎯 Subject Tests — Select Subject</h2>
    <p class="subtext">Pick a subject, then choose a test difficulty by marks</p>
    <div class="grid" id="stSubjectGrid"></div>
  </div>

  <div id="stMarks" class="card" style="display:none">
    <button class="back-btn" onclick="openSubjectTestSubjects()">⬅ Back to Subjects</button>
    <div class="breadcrumb">Subject Tests &nbsp;›&nbsp; <b id="stSubjectName"></b></div>
    <div class="mark-item" onclick="startSubjectTest(20)"><div><div class="mtitle">20 Marks Test</div><div class="mmeta">Quick concept check • ~35 min</div></div><div class="start-tag">Start ➜</div></div>
    <div class="mark-item" onclick="startSubjectTest(40)"><div><div class="mtitle">40 Marks Test</div><div class="mmeta">Balanced chapter coverage • ~70 min</div></div><div class="start-tag">Start ➜</div></div>
    <div class="mark-item" onclick="startSubjectTest(70)"><div><div class="mtitle">70 Marks Test</div><div class="mmeta">Full subject coverage • ~2 hrs</div></div><div class="start-tag">Start ➜</div></div>
  </div>

  <div id="genericScreen" class="card" style="display:none">
    <button class="back-btn" id="genericBackBtn">⬅ Back</button>
    <div class="generic-box">
      <div class="big" id="genericIcon">🧪</div>
      <h3 id="genericTitle">Coming Soon</h3>
      <p id="genericSubtitle">This section will be available shortly.</p>
      <span class="status-pill" id="genericPill">⏳ Will be uploaded soon</span>
    </div>
  </div>
</div>

<div class="footer">© PowerMind-369 Premium Course Layout</div>`;

let data = getActiveSubjects();
const screens = ["home", "viewer", "ctSubjects", "ctChapters", "stSubjects", "stMarks", "genericScreen"];

function getActiveSubjects(){
  if (hasClassChoices) return selectedClassChoice ? activeCourse.subjects : {};
  if (!hasStreams) return activeCourse.subjects;
  return selectedStream ? activeCourse.streams[selectedStream] : {};
}

function getSelectedClassChoice(){
  return hasClassChoices && selectedClassChoice ? activeCourse.classChoices[selectedClassChoice] : null;
}

function openSelectedClassChoice(){
  const choice = getSelectedClassChoice();
  if (!choice?.page) return;
  window.location.href = choice.page;
}

function buildClassChoiceGrid(){
  if (!hasClassChoices) return;
  const grid = document.getElementById("classChoiceGrid");
  const status = document.getElementById("classChoiceStatusText");
  const selectedChoice = getSelectedClassChoice();
  grid.innerHTML = "";
  status.textContent = selectedClassChoice
    ? `${selectedClassChoice} is locked. Open its dedicated class page below.`
    : "Select one class to open its dedicated learning page.";

  Object.entries(activeCourse.classChoices).forEach(([className, choice]) => {
    const div = document.createElement("div");
    const isLocked = selectedClassChoice === className;
    div.className = "item stream-card" + (isLocked ? " locked" : "");
    div.onclick = () => chooseClassChoice(className);
    div.innerHTML = `<span class="icon">${choice.icon}</span><div class="label">${className}</div><div class="sub">${choice.description}</div>${isLocked ? '<div class="locked-note">Locked - Open Class</div>' : ""}`;
    grid.appendChild(div);
  });

  if (selectedChoice) {
    const openBtn = document.createElement("div");
    openBtn.className = "item test-item";
    openBtn.onclick = openSelectedClassChoice;
    openBtn.innerHTML = `<span class="icon">↗</span><div class="label">Open ${selectedClassChoice}</div><div class="sub">Continue to ${selectedChoice.page}</div>`;
    grid.appendChild(openBtn);
  }
}

function chooseClassChoice(className){
  if (selectedClassChoice) {
    if (selectedClassChoice === className) openSelectedClassChoice();
    else alert(`${selectedClassChoice} is already locked. It cannot be changed from this page.`);
    return;
  }
  const ok = confirm(`You selected ${className}. This choice cannot be changed from this page. Continue?`);
  if (!ok) return;
  selectedClassChoice = className;
  localStorage.setItem(classChoiceStorageKey, className);
  data = getActiveSubjects();
  buildClassChoiceGrid();
  buildSubjectGrid();
  openSelectedClassChoice();
}

function buildStreamGrid(){
  if (!hasStreams) return;
  const grid = document.getElementById("streamGrid");
  const status = document.getElementById("streamStatusText");
  grid.innerHTML = "";
  status.textContent = selectedStream
    ? `${selectedStream} stream is locked. Your subjects and tests are loaded below.`
    : "Select one stream to load the correct subjects.";

  Object.keys(activeCourse.streams).forEach(stream => {
    const div = document.createElement("div");
    const isLocked = selectedStream === stream;
    div.className = "item stream-card" + (isLocked ? " locked" : "");
    div.onclick = () => chooseStream(stream);
    div.innerHTML = `<span class="icon">${stream === "Science" ? "⚛️" : stream === "Commerce" ? "🧾" : "🏛️"}</span><div class="label">${stream}</div><div class="sub">${Object.keys(activeCourse.streams[stream]).length} Subjects</div>${isLocked ? '<div class="locked-note">Locked</div>' : ""}`;
    grid.appendChild(div);
  });
}

function chooseStream(stream){
  if (selectedStream) {
    alert(`${selectedStream} stream is already locked. It cannot be changed from this page.`);
    return;
  }
  const ok = confirm(`You selected ${stream}. This choice cannot be changed from this page. Continue?`);
  if (!ok) return;
  selectedStream = stream;
  localStorage.setItem(streamStorageKey, stream);
  data = getActiveSubjects();
  buildStreamGrid();
  buildSubjectGrid();
}

function showScreen(id){
  screens.forEach(screen => {
    document.getElementById(screen).style.display = screen === id ? "block" : "none";
  });
}

function goHome(){ showScreen("home"); }

function buildSubjectGrid(){
  const grid = document.getElementById("subjectGrid");
  grid.innerHTML = "";
  if (hasClassChoices && !selectedClassChoice) {
    grid.innerHTML = '<div class="subtext">Choose and lock your class first. Each class opens its own dedicated page.</div>';
    return;
  }
  if (hasStreams && !selectedStream) {
    grid.innerHTML = '<div class="subtext">Choose and lock your stream first to view subjects.</div>';
    return;
  }
  Object.keys(data).forEach(subjectName => {
    const chapterCount = Object.keys(data[subjectName].chapters).length;
    const div = document.createElement("div");
    div.className = "item";
    div.onclick = () => openSubject(subjectName);
    div.innerHTML = `<span class="icon">${data[subjectName].icon}</span><div class="label">${subjectName}</div><div class="sub">${chapterCount} Chapters</div>`;
    grid.appendChild(div);
  });
}

function openSubject(subjectName, chapterName){
  showScreen("viewer");
  document.getElementById("viewerSubjectName").textContent = subjectName;
  const chapters = data[subjectName].chapters;
  const chapterList = document.getElementById("chapterList");
  chapterList.innerHTML = "";
  const firstChapter = chapterName || Object.keys(chapters)[0];

  Object.keys(chapters).forEach(chapter => {
    const btn = document.createElement("button");
    btn.className = "chapter-btn" + (chapter === firstChapter ? " active" : "");
    btn.innerHTML = `<span>${chapter}</span><span class="count">${chapters[chapter].length}</span>`;
    btn.onclick = () => {
      document.querySelectorAll(".chapter-btn").forEach(item => item.classList.remove("active"));
      btn.classList.add("active");
      renderChapter(subjectName, chapter);
    };
    chapterList.appendChild(btn);
  });

  renderChapter(subjectName, firstChapter);
}

function renderChapter(subjectName, chapterName){
  document.getElementById("chapterTitle").textContent = chapterName;
  document.getElementById("chapterDesc").textContent = `${data[subjectName].chapters[chapterName].length} video lesson(s) in this chapter`;
  const videoList = document.getElementById("videoList");
  videoList.innerHTML = "";
  data[subjectName].chapters[chapterName].forEach((video, index) => {
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <div class="video-thumb">🎥</div>
      <div class="video-info">
        <div class="vtitle">Lesson ${index + 1}: ${video}</div>
        <div class="vmeta">${subjectName} • ${chapterName}</div>
      </div>
      <div class="play-tag">▶ Watch</div>`;
    videoList.appendChild(card);
  });
}

function openChapterTestSubjects(){
  if (hasClassChoices && !selectedClassChoice) {
    alert("Please choose your class first. The selected class will open in its own page.");
    return;
  }
  if (hasStreams && !selectedStream) {
    alert("Please choose your stream first. After selection, chapter tests will load for that stream.");
    return;
  }
  showScreen("ctSubjects");
  const grid = document.getElementById("ctSubjectGrid");
  grid.innerHTML = "";
  Object.keys(data).forEach(subjectName => {
    const chapterCount = Object.keys(data[subjectName].chapters).length;
    const div = document.createElement("div");
    div.className = "item";
    div.onclick = () => openChapterTestList(subjectName);
    div.innerHTML = `<span class="icon">${data[subjectName].icon}</span><div class="label">${subjectName}</div><div class="sub">${chapterCount} Chapter Tests</div>`;
    grid.appendChild(div);
  });
}

function openChapterTestList(subjectName){
  showScreen("ctChapters");
  document.getElementById("ctSubjectName").textContent = subjectName;
  const rows = document.getElementById("ctChapterRows");
  rows.innerHTML = "";
  Object.keys(data[subjectName].chapters).forEach(chapter => {
    const row = document.createElement("div");
    row.className = "chapter-test-row";
    row.onclick = () => startChapterTest(subjectName, chapter);
    row.innerHTML = `<div><b>${chapter}</b><div class="mmeta">${data[subjectName].chapters[chapter].length} lessons covered</div></div><div class="start-tag">Start Test ➜</div>`;
    rows.appendChild(row);
  });
}

function startChapterTest(subjectName, chapter){
  showGeneric({
    icon:"📘",
    title:`${chapter} — Chapter Test`,
    subtitle:`${subjectName} • ${chapter} assessment with objective questions, short answers, and revision prompts.`,
    pill:"⏳ Will be uploaded soon",
    backFn:() => openChapterTestList(subjectName)
  });
}

function openSubjectTestSubjects(){
  if (hasClassChoices && !selectedClassChoice) {
    alert("Please choose your class first. The selected class will open in its own page.");
    return;
  }
  if (hasStreams && !selectedStream) {
    alert("Please choose your stream first. After selection, subject tests will load for that stream.");
    return;
  }
  showScreen("stSubjects");
  const grid = document.getElementById("stSubjectGrid");
  grid.innerHTML = "";
  Object.keys(data).forEach(subjectName => {
    const div = document.createElement("div");
    div.className = "item";
    div.onclick = () => openSubjectTestMarks(subjectName);
    div.innerHTML = `<span class="icon">${data[subjectName].icon}</span><div class="label">${subjectName}</div><div class="sub">Full Subject Test</div>`;
    grid.appendChild(div);
  });
}

let currentTestSubject = "";

function openSubjectTestMarks(subjectName){
  currentTestSubject = subjectName;
  showScreen("stMarks");
  document.getElementById("stSubjectName").textContent = subjectName;
}

function startSubjectTest(marks){
  showGeneric({
    icon:"🎯",
    title:`${currentTestSubject} — ${marks} Marks Test`,
    subtitle:`This ${marks}-marks test covers the most important concepts from ${currentTestSubject}.`,
    pill:"⏳ Will be uploaded soon",
    backFn:() => openSubjectTestMarks(currentTestSubject)
  });
}

function openMockTests(){
  if (hasClassChoices && !selectedClassChoice) {
    alert("Please choose your class first. The selected class will open in its own page.");
    return;
  }
  if (hasStreams && !selectedStream) {
    alert("Please choose your stream first. After selection, mock tests will load for that stream.");
    return;
  }
  showGeneric({
    icon:"🧪",
    title:activeCourse.mockTitle,
    subtitle:"Full-length timed mock tests with course-specific sections, scoring, and review will be uploaded soon.",
    pill:"⏳ Will be uploaded soon",
    backFn:goHome
  });
}

function openFinalTest(){
  if (hasClassChoices && !selectedClassChoice) {
    alert("Please choose your class first. The selected class will open in its own page.");
    return;
  }
  if (hasStreams && !selectedStream) {
    alert("Please choose your stream first. After selection, the final test will load for that stream.");
    return;
  }
  showGeneric({
    icon:"🏆",
    title:activeCourse.finalTitle,
    subtitle:"The complete final assessment covering every subject and module will be uploaded soon.",
    pill:"⏳ Will be uploaded soon",
    backFn:goHome
  });
}

function showGeneric({icon, title, subtitle, pill, backFn}){
  showScreen("genericScreen");
  document.getElementById("genericIcon").textContent = icon;
  document.getElementById("genericTitle").textContent = title;
  document.getElementById("genericSubtitle").textContent = subtitle;
  document.getElementById("genericPill").textContent = pill;
  document.getElementById("genericBackBtn").onclick = backFn;
}

buildStreamGrid();
buildClassChoiceGrid();
buildSubjectGrid();
