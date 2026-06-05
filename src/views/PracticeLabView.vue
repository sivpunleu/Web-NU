<script setup>
import { computed, ref, watch } from 'vue'
import EmptyState from '@/components/EmptyState.vue'
import { useCourseCatalog } from '@/composables/useCourseCatalog'
import { useLearning } from '@/composables/useLearning'
import {
  lessonDeliverable,
  lessonDuration,
  lessonPractice,
  lessonSteps,
  lessonSummary,
  lessonTitle as getLessonTitle,
} from '@/utils/lessonContent'
import { useRoute } from 'vue-router'
import { readScopedStorage, writeScopedStorage } from '@/utils/userStorage'

const LAB_STORAGE_KEY = 'smartlearn_practice_labs'

const route = useRoute()
const { allCourses, getCourseById } = useCourseCatalog()
const { isLessonComplete, markLessonComplete } = useLearning()

const selectedCourseId = ref('')
const selectedLessonIndex = ref(0)
const activeFile = ref('html')
const htmlCode = ref('')
const cssCode = ref('')
const jsCode = ref('')
const solutionCode = ref('')
const testInput = ref('')
const notes = ref('')
const savedMessage = ref('')
const previewKey = ref(0)
const checklist = ref({
  plan: false,
  code: false,
  test: false,
  submit: false,
})

const savedLabs = ref(readScopedStorage(LAB_STORAGE_KEY, {}))
const course = computed(() => getCourseById(selectedCourseId.value))
const lessons = computed(() => course.value?.lessons ?? [])
const lesson = computed(() => lessons.value[Number(selectedLessonIndex.value)])
const lessonTitle = computed(() => (lesson.value ? getLessonTitle(lesson.value) : ''))
const lessonIntro = computed(() => (lesson.value ? lessonSummary(lesson.value, course.value) : ''))
const practicePrompt = computed(() => (lesson.value ? lessonPractice(lesson.value, course.value) : ''))
const deliverable = computed(() => (lesson.value ? lessonDeliverable(lesson.value) : ''))
const practiceSteps = computed(() => (lesson.value ? lessonSteps(lesson.value) : []))
const lessonMeta = computed(() => (lesson.value ? lessonDuration(lesson.value) : ''))
const lessonNumber = computed(() => Number(selectedLessonIndex.value) + 1)
const labKey = computed(() => `${selectedCourseId.value}:${selectedLessonIndex.value}`)
const labConfig = computed(() => {
  if (course.value?.id === 'cpp-programming') {
    return {
      mode: 'console',
      language: 'C++',
      files: [
        { key: 'solution', label: 'main.cpp', icon: 'bi-file-earmark-code' },
        { key: 'input', label: 'input.txt', icon: 'bi-terminal' },
      ],
      command: 'g++ main.cpp -o app && ./app',
      sampleInput: '85',
    }
  }

  if (course.value?.id === 'python-programming') {
    return {
      mode: 'console',
      language: 'Python',
      files: [
        { key: 'solution', label: 'main.py', icon: 'bi-file-earmark-code' },
        { key: 'input', label: 'input.txt', icon: 'bi-terminal' },
      ],
      command: 'python main.py',
      sampleInput: 'HTML CSS JavaScript',
    }
  }

  if (course.value?.id === 'java-oop') {
    return {
      mode: 'console',
      language: 'Java',
      files: [
        { key: 'solution', label: 'Main.java', icon: 'bi-file-earmark-code' },
        { key: 'input', label: 'input.txt', icon: 'bi-terminal' },
      ],
      command: 'javac Main.java && java Main',
      sampleInput: 'Alex\nVue.js',
    }
  }

  if (course.value?.category === 'Backend') {
    return {
      mode: 'console',
      language: course.value.id === 'laravel-framework' ? 'Laravel/PHP' : 'PHP',
      files: [
        {
          key: 'solution',
          label: course.value.id === 'laravel-framework' ? 'routes/api.php' : 'index.php',
          icon: 'bi-file-earmark-code',
        },
        { key: 'input', label: 'request.json', icon: 'bi-braces' },
      ],
      command: course.value.id === 'laravel-framework' ? 'php artisan serve' : 'php -S localhost:8000',
      sampleInput: '{"title":"HTML និង CSS","level":"មូលដ្ឋាន"}',
    }
  }

  return {
    mode: 'web',
    language: 'HTML/CSS/JavaScript',
    files: [
      { key: 'html', label: 'HTML', icon: 'bi-filetype-html' },
      { key: 'css', label: 'CSS', icon: 'bi-filetype-css' },
      { key: 'js', label: 'JavaScript', icon: 'bi-filetype-js' },
    ],
    command: 'browser preview',
    sampleInput: '',
  }
})
const completed = computed(() => (
  course.value ? isLessonComplete(course.value.id, Number(selectedLessonIndex.value)) : false
))
const isWebLab = computed(() => labConfig.value.mode === 'web')
const codeFiles = computed(() => labConfig.value.files)
const activeFileMeta = computed(() => codeFiles.value.find((file) => file.key === activeFile.value) ?? codeFiles.value[0])
const checklistDone = computed(() => Object.values(checklist.value).filter(Boolean).length)
const checklistProgress = computed(() => Math.round((checklistDone.value / 4) * 100))
const hasCode = computed(() => Boolean(
  htmlCode.value.trim() || cssCode.value.trim() || jsCode.value.trim() || solutionCode.value.trim(),
))
const canSubmit = computed(() =>
  Boolean(hasCode.value && checklist.value.plan && checklist.value.code && checklist.value.test),
)
const backToLessonPath = computed(() => {
  if (!course.value) return '/courses'
  return `/courses/${course.value.id}/lessons/${selectedLessonIndex.value}`
})

const activeCode = computed({
  get() {
    if (activeFile.value === 'solution') return solutionCode.value
    if (activeFile.value === 'input') return testInput.value
    if (activeFile.value === 'css') return cssCode.value
    if (activeFile.value === 'js') return jsCode.value
    return htmlCode.value
  },
  set(value) {
    if (activeFile.value === 'solution') {
      solutionCode.value = value
      return
    }

    if (activeFile.value === 'input') {
      testInput.value = value
      return
    }

    if (activeFile.value === 'css') {
      cssCode.value = value
      return
    }

    if (activeFile.value === 'js') {
      jsCode.value = value
      return
    }

    htmlCode.value = value
  },
})

const previewHeading = computed(() => (isWebLab.value ? 'លទ្ធផលការអនុវត្ត' : `${labConfig.value.language} console`))
const previewKicker = computed(() => (isWebLab.value ? 'Live preview' : 'Console output'))
const runButtonLabel = computed(() => (isWebLab.value ? 'Run Preview' : 'Run Console'))
const checkCodeText = computed(() => (
  isWebLab.value
    ? 'កែ HTML/CSS/JS ឲ្យត្រូវនឹង task'
    : `សរសេរ ${labConfig.value.language} code ឲ្យត្រូវនឹង task`
))
const checkTestText = computed(() => (
  isWebLab.value
    ? 'Run preview ហើយពិនិត្យ responsive/result'
    : 'Run console ហើយពិនិត្យ input/output'
))

const previewDocument = computed(() => {
  const safeScript = jsCode.value.replace(/<\/script>/gi, '<\\/script>')

  return `<!doctype html>
<html lang="km">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>${cssCode.value}</style>
  </head>
  <body>
    ${htmlCode.value}
    <script>${safeScript}<\/script>
  </body>
</html>`
})

const consoleOutput = computed(() => {
  const input = testInput.value.trim() || labConfig.value.sampleInput
  const score = Number(input.match(/-?\d+/)?.[0] ?? 85)

  if (course.value?.id === 'cpp-programming') {
    if (Number(selectedLessonIndex.value) === 1) {
      return `Input scores: 78 92 66 85\nAverage: 80.25\nHighest: 92\nLowest: 66`
    }

    if (Number(selectedLessonIndex.value) === 2) {
      return `Before update: 70\nAfter update: 85\nScore updated by reference`
    }

    if (Number(selectedLessonIndex.value) === 3) {
      return `Student: Alex\nCourse: C++ Programming\nEnrollment status: active`
    }

    return `Enter score: ${score}\nResult: ${score >= 50 ? 'Pass' : 'Fail'}`
  }

  if (course.value?.id === 'python-programming') {
    return `Records loaded: 3\nFiltered courses: HTML និង CSS, JavaScript\nReport saved successfully`
  }

  if (course.value?.id === 'java-oop') {
    return `Student: Alex\nCourse: Vue.js\nEnrollment created with OOP model`
  }

  if (course.value?.category === 'Backend') {
    return `Request accepted\nValidation passed\nResponse: 201 Created`
  }

  return ''
})

function buildWebStarterLab() {
  const safeTitle = lessonTitle.value || 'Practice Lab'
  const safeCourse = course.value?.title || 'SmartLearn'

  return {
    html: `<main class="lab-card">
  <span class="eyebrow">${safeCourse}</span>
  <h1>${safeTitle}</h1>
  <p>${practicePrompt.value || 'បង្កើត UI តូចមួយ ដើម្បីអនុវត្ត concept របស់មេរៀននេះ។'}</p>

  <section class="task-list">
    <article>
      <strong>01</strong>
      <span>Plan the layout</span>
    </article>
    <article>
      <strong>02</strong>
      <span>Build the interface</span>
    </article>
    <article>
      <strong>03</strong>
      <span>Test the result</span>
    </article>
  </section>

  <button type="button" data-action>Run interaction</button>
  <p data-status class="status">Ready for practice</p>
</main>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  color: #111827;
  background: #eef6ff;
  font-family: system-ui, sans-serif;
}

.lab-card {
  width: min(92vw, 560px);
  border: 1px solid #d9e2ef;
  border-radius: 8px;
  padding: 28px;
  background: #ffffff;
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.1);
}

.eyebrow {
  color: #2563eb;
  font-weight: 800;
}

h1 {
  margin: 10px 0;
}

p {
  color: #667085;
  line-height: 1.7;
}

.task-list {
  display: grid;
  gap: 10px;
  margin: 22px 0;
}

.task-list article {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #d9e2ef;
  border-radius: 8px;
  padding: 12px;
}

.task-list strong {
  color: #059669;
}

button {
  border: 0;
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  background: #2563eb;
  font-weight: 800;
}

.status {
  margin-bottom: 0;
}`,
    js: `const button = document.querySelector('[data-action]')
const status = document.querySelector('[data-status]')

button?.addEventListener('click', () => {
  status.textContent = 'Interaction works. Continue improving your solution.'
})`,
  }
}

function buildCppStarterLab() {
  const lessonIndex = Number(selectedLessonIndex.value)

  if (lessonIndex === 1) {
    return {
      solution: `#include <iostream>
#include <vector>
using namespace std;

double averageScore(const vector<int>& scores) {
  int total = 0;
  for (int score : scores) {
    total += score;
  }
  return static_cast<double>(total) / scores.size();
}

int main() {
  vector<int> scores = {78, 92, 66, 85};
  int highest = scores[0];
  int lowest = scores[0];

  for (int score : scores) {
    if (score > highest) highest = score;
    if (score < lowest) lowest = score;
  }

  cout << "Average: " << averageScore(scores) << endl;
  cout << "Highest: " << highest << endl;
  cout << "Lowest: " << lowest << endl;
  return 0;
}`,
      input: '78 92 66 85',
    }
  }

  if (lessonIndex === 2) {
    return {
      solution: `#include <iostream>
using namespace std;

void updateScore(int& score, int bonus) {
  score += bonus;
}

int main() {
  int studentScore = 70;

  cout << "Before update: " << studentScore << endl;
  updateScore(studentScore, 15);
  cout << "After update: " << studentScore << endl;

  return 0;
}`,
      input: '70 15',
    }
  }

  if (lessonIndex === 3) {
    return {
      solution: `#include <iostream>
#include <string>
using namespace std;

class Student {
private:
  string name;
  string course;

public:
  Student(string studentName, string courseTitle) {
    name = studentName;
    course = courseTitle;
  }

  void displayEnrollment() {
    cout << "Student: " << name << endl;
    cout << "Course: " << course << endl;
    cout << "Enrollment status: active" << endl;
  }
};

int main() {
  Student student("Alex", "C++ Programming");
  student.displayEnrollment();
  return 0;
}`,
      input: 'Alex\nC++ Programming',
    }
  }

  return {
    solution: `#include <iostream>
using namespace std;

int main() {
  int score;

  cout << "Enter score: ";
  cin >> score;

  if (score >= 50) {
    cout << "Result: Pass" << endl;
  } else {
    cout << "Result: Fail" << endl;
  }

  return 0;
}`,
    input: '85',
  }
}

function buildConsoleStarterLab() {
  if (course.value?.id === 'cpp-programming') return buildCppStarterLab()

  if (course.value?.id === 'python-programming') {
    return {
      solution: `courses = ["HTML និង CSS", "JavaScript", "Vue.js"]

def show_courses(records):
    for index, course in enumerate(records, start=1):
        print(f"{index}. {course}")

show_courses(courses)
print("Report saved successfully")`,
      input: 'HTML CSS JavaScript',
    }
  }

  if (course.value?.id === 'java-oop') {
    return {
      solution: `public class Main {
  public static void main(String[] args) {
    Student student = new Student("Alex", "Vue.js");
    student.displayEnrollment();
  }
}

class Student {
  private String name;
  private String course;

  Student(String name, String course) {
    this.name = name;
    this.course = course;
  }

  void displayEnrollment() {
    System.out.println("Student: " + name);
    System.out.println("Course: " + course);
    System.out.println("Enrollment created with OOP model");
  }
}`,
      input: 'Alex\nVue.js',
    }
  }

  return {
    solution: `<?php
$request = [
  'title' => 'HTML និង CSS',
  'level' => 'មូលដ្ឋាន',
];

if (!$request['title']) {
  http_response_code(422);
  echo 'Validation failed';
  exit;
}

echo 'Request accepted';
echo PHP_EOL . 'Response: 201 Created';
`,
    input: labConfig.value.sampleInput,
  }
}

function buildStarterLab() {
  return isWebLab.value ? buildWebStarterLab() : buildConsoleStarterLab()
}

function loadLab(useStarter = false) {
  if (!course.value || !lesson.value) return

  const savedLab = useStarter ? null : savedLabs.value[labKey.value]
  const savedLabMatchesMode = savedLab && (savedLab.mode ? savedLab.mode === labConfig.value.mode : isWebLab.value)
  const starter = savedLabMatchesMode ? savedLab : buildStarterLab()

  htmlCode.value = starter.html || ''
  cssCode.value = starter.css || ''
  jsCode.value = starter.js || ''
  solutionCode.value = starter.solution || ''
  testInput.value = starter.input || ''
  notes.value = starter.notes || ''
  checklist.value = starter.checklist ?? {
    plan: false,
    code: false,
    test: false,
    submit: false,
  }
  activeFile.value = codeFiles.value[0]?.key ?? 'html'
  savedMessage.value = savedLabMatchesMode && !useStarter ? 'បានបើក draft ចុងក្រោយរបស់អ្នក។' : ''
  previewKey.value += 1
}

function saveLabDraft(message = 'បានរក្សាទុក draft របស់អ្នក។') {
  if (!course.value || !lesson.value) return

  savedLabs.value = {
    ...savedLabs.value,
    [labKey.value]: {
      mode: labConfig.value.mode,
      html: htmlCode.value,
      css: cssCode.value,
      js: jsCode.value,
      solution: solutionCode.value,
      input: testInput.value,
      notes: notes.value,
      checklist: checklist.value,
      updatedAt: new Date().toISOString(),
    },
  }

  writeScopedStorage(LAB_STORAGE_KEY, savedLabs.value)
  savedMessage.value = message
}

function toggleCheck(key) {
  if (key !== 'plan') return

  checklist.value = {
    ...checklist.value,
    [key]: !checklist.value[key],
  }
}

function markCodeTouched() {
  if (checklist.value.code) return
  checklist.value = {
    ...checklist.value,
    code: true,
  }
}

function runPreview() {
  previewKey.value += 1
  checklist.value = {
    ...checklist.value,
    test: true,
  }
  savedMessage.value = isWebLab.value ? 'Preview បាន refresh រួចហើយ។' : 'Console output បាន refresh រួចហើយ។'
}

function resetStarter() {
  loadLab(true)
  savedMessage.value = 'Starter lab ត្រូវបាន reset រួចហើយ។'
}

function submitLab() {
  if (!canSubmit.value || !course.value) return

  checklist.value = {
    ...checklist.value,
    submit: true,
  }

  saveLabDraft('បាន submit lab និងរក្សាទុកការអនុវត្តរបស់អ្នក។')
  markLessonComplete(course.value.id, Number(selectedLessonIndex.value))
}

watch(
  () => [route.params.courseId, route.params.lessonIndex, allCourses.value.length],
  () => {
    if (!allCourses.value.length) return

    const routeCourseId = typeof route.params.courseId === 'string' ? route.params.courseId : ''
    const fallbackCourseId = selectedCourseId.value && getCourseById(selectedCourseId.value)
      ? selectedCourseId.value
      : allCourses.value[0].id
    const nextCourseId = getCourseById(routeCourseId) ? routeCourseId : fallbackCourseId
    const nextCourse = getCourseById(nextCourseId)
    const routeLessonIndex = Number(route.params.lessonIndex)
    const maxLessonIndex = Math.max((nextCourse?.lessons.length ?? 1) - 1, 0)

    selectedCourseId.value = nextCourseId
    selectedLessonIndex.value = Number.isInteger(routeLessonIndex) && routeLessonIndex >= 0
      ? Math.min(routeLessonIndex, maxLessonIndex)
      : Math.min(Number(selectedLessonIndex.value) || 0, maxLessonIndex)
  },
  { immediate: true },
)

watch(selectedCourseId, () => {
  if (!course.value) return
  if (!course.value.lessons[Number(selectedLessonIndex.value)]) {
    selectedLessonIndex.value = 0
  }
})

watch(
  codeFiles,
  (files) => {
    if (!files.some((file) => file.key === activeFile.value)) {
      activeFile.value = files[0]?.key ?? 'html'
    }
  },
  { immediate: true },
)

watch(labKey, () => {
  loadLab(false)
})
</script>

<template>
  <section v-if="course && lesson" class="practice-lab-page py-5">
    <div class="container">
      <RouterLink class="text-decoration-none fw-bold" :to="backToLessonPath">
        <i class="bi bi-arrow-left me-2"></i>ត្រឡប់ទៅមេរៀន
      </RouterLink>

      <div class="practice-lab-hero mt-4">
        <div class="practice-lab-hero__content">
          <span class="section-kicker">Interactive Practice Lab</span>
          <h1>{{ lessonTitle }}</h1>
          <p>{{ lessonIntro }}</p>

          <div class="practice-lab-hero__meta">
            <span><i class="bi bi-journal-code"></i>{{ course.title }}</span>
            <span><i class="bi bi-play-circle"></i>មេរៀនទី {{ lessonNumber }}</span>
            <span><i class="bi bi-clock"></i>{{ lessonMeta }}</span>
          </div>
        </div>

        <div class="practice-lab-score">
          <i class="bi bi-terminal"></i>
          <strong>{{ checklistProgress }}%</strong>
          <span>Lab checklist</span>
          <div class="progress" role="progressbar" :aria-valuenow="checklistProgress">
            <div class="progress-bar" :style="{ width: `${checklistProgress}%` }"></div>
          </div>
        </div>
      </div>

      <div class="practice-lab-toolbar">
        <label class="form-label mb-0">
          <span>វគ្គសិក្សា</span>
          <select v-model="selectedCourseId" class="form-select">
            <option v-for="item in allCourses" :key="item.id" :value="item.id">
              {{ item.title }}
            </option>
          </select>
        </label>

        <label class="form-label mb-0">
          <span>មេរៀន</span>
          <select v-model.number="selectedLessonIndex" class="form-select">
            <option v-for="(item, index) in lessons" :key="getLessonTitle(item)" :value="index">
              {{ index + 1 }}. {{ getLessonTitle(item) }}
            </option>
          </select>
        </label>

        <RouterLink class="btn btn-outline-primary" :to="backToLessonPath">
          <i class="bi bi-camera-video me-2"></i>មើលមេរៀន
        </RouterLink>
      </div>

      <div class="practice-lab-grid">
        <div class="practice-lab-main">
          <section class="practice-lab-panel practice-lab-editor">
            <div class="practice-lab-panel__header">
              <div>
                <span class="section-kicker">Code editor</span>
                <h2>{{ activeFileMeta.label }}</h2>
              </div>

              <div class="practice-lab-actions">
                <button class="btn btn-outline-secondary btn-sm" type="button" @click="resetStarter">
                  <i class="bi bi-arrow-counterclockwise me-1"></i>Reset
                </button>
                <button class="btn btn-primary btn-sm" type="button" @click="runPreview">
                  <i class="bi bi-play-fill me-1"></i>{{ runButtonLabel }}
                </button>
              </div>
            </div>

            <div class="practice-lab-file-tabs" aria-label="Code files">
              <button
                v-for="file in codeFiles"
                :key="file.key"
                class="practice-lab-file-tab"
                :class="{ active: activeFile === file.key }"
                type="button"
                @click="activeFile = file.key"
              >
                <i class="bi" :class="file.icon"></i>
                <span>{{ file.label }}</span>
              </button>
            </div>

            <textarea
              v-model="activeCode"
              class="practice-code-editor"
              spellcheck="false"
              :aria-label="`${activeFileMeta.label} code editor`"
              @input="markCodeTouched"
            ></textarea>
          </section>

          <section class="practice-lab-panel practice-preview-panel">
            <div class="practice-lab-panel__header">
              <div>
                <span class="section-kicker">{{ previewKicker }}</span>
                <h2>{{ previewHeading }}</h2>
              </div>
              <span class="practice-live-badge">
                <i class="bi" :class="isWebLab ? 'bi-lightning-charge-fill' : 'bi-terminal'"></i>
                {{ isWebLab ? 'Live' : 'Console' }}
              </span>
            </div>

            <iframe
              v-if="isWebLab"
              :key="previewKey"
              class="practice-preview-frame"
              title="Practice lab preview"
              sandbox="allow-scripts"
              :srcdoc="previewDocument"
            ></iframe>

            <div v-else :key="previewKey" class="practice-console-frame">
              <div class="practice-console-toolbar">
                <span>$ {{ labConfig.command }}</span>
              </div>
              <pre>{{ consoleOutput }}</pre>
              <div class="practice-console-input">
                <strong>Input</strong>
                <span>{{ testInput || labConfig.sampleInput }}</span>
              </div>
            </div>
          </section>
        </div>

        <aside class="practice-lab-side">
          <section class="practice-lab-panel">
            <span class="section-kicker">Lab task</span>
            <h2>អ្វីត្រូវធ្វើ</h2>
            <p class="text-secondary">{{ practicePrompt }}</p>

            <div class="practice-deliverable">
              <i class="bi bi-clipboard-check"></i>
              <span>{{ deliverable }}</span>
            </div>

            <ol class="practice-step-list">
              <li v-for="step in practiceSteps" :key="step">{{ step }}</li>
            </ol>
          </section>

          <section class="practice-lab-panel">
            <div class="practice-lab-panel__header">
              <div>
                <span class="section-kicker">Checklist</span>
                <h2>តាមដានការអនុវត្ត</h2>
              </div>
              <strong>{{ checklistDone }}/4</strong>
            </div>

            <div class="practice-check-list">
              <button class="practice-check-item" type="button" @click="toggleCheck('plan')">
                <i class="bi" :class="checklist.plan ? 'bi-check-circle-fill' : 'bi-circle'"></i>
                <span>
                  <strong>Plan</strong>
                  <small>សរសេរគ្រោង solution មុនចាប់ផ្តើម</small>
                </span>
              </button>
              <button class="practice-check-item" type="button" disabled>
                <i class="bi" :class="checklist.code ? 'bi-check-circle-fill' : 'bi-circle'"></i>
                <span>
                  <strong>Code</strong>
                  <small>{{ checkCodeText }}</small>
                </span>
              </button>
              <button class="practice-check-item" type="button" disabled>
                <i class="bi" :class="checklist.test ? 'bi-check-circle-fill' : 'bi-circle'"></i>
                <span>
                  <strong>Test</strong>
                  <small>{{ checkTestText }}</small>
                </span>
              </button>
              <button class="practice-check-item" type="button" disabled>
                <i class="bi" :class="checklist.submit ? 'bi-check-circle-fill' : 'bi-circle'"></i>
                <span>
                  <strong>Submit</strong>
                  <small>រក្សាទុក final work និង mark lesson complete</small>
                </span>
              </button>
            </div>
          </section>

          <section class="practice-lab-panel">
            <span class="section-kicker">Reflection</span>
            <h2>កំណត់ចំណាំ</h2>
            <textarea
              v-model="notes"
              class="form-control"
              rows="5"
              placeholder="សរសេរអ្វីដែលបានរៀន បញ្ហាដែលជួប ឬអ្វីត្រូវកែលម្អ..."
            ></textarea>

            <div class="d-grid gap-2 mt-3">
              <button class="btn btn-outline-primary" type="button" @click="saveLabDraft()">
                <i class="bi bi-save me-2"></i>រក្សាទុក Draft
              </button>
              <button class="btn btn-success" type="button" :disabled="!canSubmit" @click="submitLab">
                <i class="bi me-2" :class="completed ? 'bi-check-circle-fill' : 'bi-send'"></i>
                {{ completed ? 'Lesson បានបញ្ចប់' : 'Submit Lab' }}
              </button>
            </div>

            <p v-if="savedMessage" class="practice-save-message mb-0">
              <i class="bi bi-check2-circle"></i>{{ savedMessage }}
            </p>
          </section>
        </aside>
      </div>
    </div>
  </section>

  <section v-else class="py-5">
    <div class="container">
      <EmptyState
        icon="bi-terminal"
        title="មិនទាន់មាន Lab"
        message="សូមជ្រើសរើសវគ្គសិក្សា និងមេរៀន ដើម្បីចាប់ផ្តើម practice lab។"
      >
        <RouterLink class="btn btn-primary" to="/courses">មើលវគ្គសិក្សា</RouterLink>
      </EmptyState>
    </div>
  </section>
</template>
