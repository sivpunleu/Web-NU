<script setup>
import { computed, reactive, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useCourseCatalog } from '@/composables/useCourseCatalog'
import { useNotifications } from '@/composables/useNotifications'
import {
  lessonDeliverable,
  lessonDuration,
  lessonObjectives,
  lessonPractice,
  lessonSteps,
  lessonSummary,
  lessonTitle,
} from '@/utils/lessonContent'

const { isAdmin } = useAuth()
const { adminCourses, catalogSummary, createCourse, deleteCourse, duplicateCourse, updateCourse } =
  useCourseCatalog()
const { addNotification } = useNotifications()

const editingCourseId = ref(null)

function createLessonForm(title = '') {
  return {
    title,
    duration: '៣៥ នាទី',
    summary: '',
    objectives: '',
    steps: '',
    practice: '',
    deliverable: '',
  }
}

function createEmptyForm() {
  return {
    title: '',
    category: 'Frontend',
    level: 'មូលដ្ឋាន',
    duration: '៤ សប្តាហ៍',
    price: '$20',
    instructor: 'គ្រូ SmartLearn',
    description: '',
    accent: '#2563eb',
    image: '',
    status: 'Published',
    lessons: [
      createLessonForm('Course overview'),
      createLessonForm('Guided practice'),
      createLessonForm('Final project'),
    ],
  }
}

const form = reactive(createEmptyForm())

const isEditing = computed(() => Boolean(editingCourseId.value))

function splitLines(value) {
  return String(value ?? '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function toLessonForm(lesson) {
  return {
    title: lessonTitle(lesson),
    duration: lessonDuration(lesson),
    summary: lessonSummary(lesson),
    objectives: lessonObjectives(lesson).join('\n'),
    steps: lessonSteps(lesson).join('\n'),
    practice: lessonPractice(lesson),
    deliverable: lessonDeliverable(lesson),
  }
}

function formLessonsPayload() {
  return form.lessons
    .map((lesson) => ({
      title: lesson.title.trim(),
      duration: lesson.duration.trim(),
      summary: lesson.summary.trim(),
      objectives: splitLines(lesson.objectives),
      steps: splitLines(lesson.steps),
      practice: lesson.practice.trim(),
      deliverable: lesson.deliverable.trim(),
    }))
    .filter((lesson) => lesson.title)
}

function resetForm() {
  Object.assign(form, createEmptyForm())
  editingCourseId.value = null
}

function submitCourse() {
  if (!form.title.trim() || !form.description.trim()) return

  const payload = {
    ...form,
    lessons: formLessonsPayload(),
  }
  const savedCourse = isEditing.value
    ? updateCourse(editingCourseId.value, payload)
    : createCourse(payload)

  if (!savedCourse) return

  addNotification({
    title: isEditing.value ? 'បានកែវគ្គសិក្សា' : 'បានបង្កើតវគ្គថ្មី',
    message: `${savedCourse.title} ត្រូវបានរក្សាទុកជា ${savedCourse.status}។`,
    type: 'success',
    to: '/admin',
  })

  resetForm()
}

function editCourse(course) {
  editingCourseId.value = course.id
  Object.assign(form, {
    title: course.title,
    category: course.category,
    level: course.level,
    duration: course.duration,
    price: course.price,
    instructor: course.instructor,
    description: course.description,
    accent: course.accent,
    image: course.image,
    status: course.status,
    lessons: course.lessons.map(toLessonForm),
  })
}

function addLesson() {
  form.lessons.push(createLessonForm(`Lesson ${form.lessons.length + 1}`))
}

function removeLesson(index) {
  if (form.lessons.length <= 1) return
  form.lessons.splice(index, 1)
}

function removeCourse(course) {
  deleteCourse(course.id)
  if (editingCourseId.value === course.id) resetForm()

  addNotification({
    title: 'បានលុបវគ្គសិក្សា',
    message: `${course.title} ត្រូវបានដកចេញពី admin catalog។`,
    type: 'warning',
    to: '/admin',
  })
}

function togglePublish(course) {
  const nextStatus = course.status === 'Draft' ? 'Published' : 'Draft'
  updateCourse(course.id, { status: nextStatus })
}

function copyCourse(course) {
  const copiedCourse = duplicateCourse(course.id)
  if (!copiedCourse) return

  addNotification({
    title: 'បានចម្លងវគ្គសិក្សា',
    message: `${copiedCourse.title} ត្រូវបានបង្កើតជា Draft។`,
    type: 'info',
    to: '/admin',
  })
}
</script>

<template>
  <section class="admin-page py-5">
    <div class="container">
      <div v-if="!isAdmin" class="empty-panel text-center">
        <i class="bi bi-shield-lock display-5 text-primary"></i>
        <h1 class="h3 fw-bold mt-3">Admin only</h1>
        <p class="text-secondary">ចូលគណនីជា admin ដោយប្រើ `admin@smartlearn.kh` និង password `admin123`។</p>
        <RouterLink class="btn btn-primary" to="/login">ចូលគណនី Admin</RouterLink>
      </div>

      <template v-else>
        <div class="admin-hero mb-4" data-aos="fade-up">
          <div>
            <span class="section-kicker text-white-50">Instructor/Admin</span>
            <h1>គ្រប់គ្រងវគ្គសិក្សា</h1>
            <p>បង្កើត កែប្រែ Publish ឬលុបវគ្គសិក្សា។ Course ដែល Published នឹងបង្ហាញក្នុង Course Catalog។</p>
          </div>
          <RouterLink class="btn btn-light" to="/courses">
            <i class="bi bi-eye me-2"></i>មើល Catalog
          </RouterLink>
        </div>

        <div class="row g-3 mb-4">
          <div class="col-md-3">
            <div class="dashboard-card">
              <span>Published</span>
              <strong>{{ catalogSummary.publishedCourses }}</strong>
            </div>
          </div>
          <div class="col-md-3">
            <div class="dashboard-card dashboard-card--green">
              <span>Drafts</span>
              <strong>{{ catalogSummary.draftCourses }}</strong>
            </div>
          </div>
          <div class="col-md-3">
            <div class="dashboard-card dashboard-card--amber">
              <span>Students</span>
              <strong>{{ catalogSummary.totalStudents }}</strong>
            </div>
          </div>
          <div class="col-md-3">
            <div class="dashboard-card">
              <span>Avg rating</span>
              <strong>{{ catalogSummary.averageRating }}</strong>
            </div>
          </div>
        </div>

        <div class="admin-grid">
          <form class="content-panel admin-course-form" @submit.prevent="submitCourse">
            <div class="d-flex justify-content-between align-items-start gap-3 mb-4">
              <div>
                <span class="section-kicker">{{ isEditing ? 'Edit Course' : 'New Course' }}</span>
                <h2 class="h4 fw-bold mt-2 mb-0">
                  {{ isEditing ? 'កែវគ្គសិក្សា' : 'បង្កើតវគ្គសិក្សាថ្មី' }}
                </h2>
              </div>
              <button v-if="isEditing" class="btn btn-outline-secondary btn-sm" type="button" @click="resetForm">
                បោះបង់
              </button>
            </div>

            <div class="row g-3">
              <div class="col-12">
                <label class="form-label" for="admin-title">ចំណងជើង</label>
                <input id="admin-title" v-model="form.title" class="form-control" type="text" required />
              </div>

              <div class="col-md-6">
                <label class="form-label" for="admin-category">ប្រភេទ</label>
                <select id="admin-category" v-model="form.category" class="form-select">
                  <option>Frontend</option>
                  <option>Backend</option>
                  <option>Design</option>
                  <option>Data</option>
                  <option>Security</option>
                  <option>Mobile</option>
                  <option>DevOps</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label" for="admin-level">កម្រិត</label>
                <select id="admin-level" v-model="form.level" class="form-select">
                  <option>មូលដ្ឋាន</option>
                  <option>មធ្យម</option>
                  <option>ខ្ពស់</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label" for="admin-duration">រយៈពេល</label>
                <input id="admin-duration" v-model="form.duration" class="form-control" type="text" />
              </div>

              <div class="col-md-6">
                <label class="form-label" for="admin-price">តម្លៃ</label>
                <input id="admin-price" v-model="form.price" class="form-control" type="text" />
              </div>

              <div class="col-md-6">
                <label class="form-label" for="admin-instructor">គ្រូបង្រៀន</label>
                <input id="admin-instructor" v-model="form.instructor" class="form-control" type="text" />
              </div>

              <div class="col-md-6">
                <label class="form-label" for="admin-status">ស្ថានភាព</label>
                <select id="admin-status" v-model="form.status" class="form-select">
                  <option>Published</option>
                  <option>Draft</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label" for="admin-accent">ពណ៌</label>
                <input id="admin-accent" v-model="form.accent" class="form-control form-control-color" type="color" />
              </div>

              <div class="col-md-6">
                <label class="form-label" for="admin-image">Image URL</label>
                <input id="admin-image" v-model="form.image" class="form-control" type="url" placeholder="Optional" />
              </div>

              <div class="col-12">
                <label class="form-label" for="admin-description">សេចក្តីពិពណ៌នា</label>
                <textarea id="admin-description" v-model="form.description" class="form-control" rows="4" required></textarea>
              </div>

              <div class="col-12">
                <div class="admin-lesson-editor-header">
                  <div>
                    <label class="form-label mb-1">មេរៀនលម្អិត</label>
                    <p class="form-text mb-0">បញ្ចូល title, summary, objectives និង practice សម្រាប់មេរៀននីមួយៗ។</p>
                  </div>
                  <button class="btn btn-outline-primary btn-sm" type="button" @click="addLesson">
                    <i class="bi bi-plus-lg me-1"></i>បន្ថែម
                  </button>
                </div>

                <div class="admin-lesson-editor">
                  <article v-for="(lesson, index) in form.lessons" :key="index" class="admin-lesson-card">
                    <div class="admin-lesson-card__header">
                      <span>{{ index + 1 }}</span>
                      <strong>Lesson {{ index + 1 }}</strong>
                      <button
                        class="btn btn-outline-danger btn-sm"
                        type="button"
                        :disabled="form.lessons.length <= 1"
                        @click="removeLesson(index)"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>

                    <div class="row g-3">
                      <div class="col-md-8">
                        <label class="form-label" :for="`admin-lesson-title-${index}`">ចំណងជើងមេរៀន</label>
                        <input
                          :id="`admin-lesson-title-${index}`"
                          v-model="lesson.title"
                          class="form-control"
                          type="text"
                          required
                        />
                      </div>

                      <div class="col-md-4">
                        <label class="form-label" :for="`admin-lesson-duration-${index}`">រយៈពេល</label>
                        <input
                          :id="`admin-lesson-duration-${index}`"
                          v-model="lesson.duration"
                          class="form-control"
                          type="text"
                        />
                      </div>

                      <div class="col-12">
                        <label class="form-label" :for="`admin-lesson-summary-${index}`">សង្ខេប</label>
                        <textarea
                          :id="`admin-lesson-summary-${index}`"
                          v-model="lesson.summary"
                          class="form-control"
                          rows="2"
                        ></textarea>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label" :for="`admin-lesson-objectives-${index}`">គោលដៅរៀន</label>
                        <textarea
                          :id="`admin-lesson-objectives-${index}`"
                          v-model="lesson.objectives"
                          class="form-control"
                          rows="4"
                          placeholder="មួយបន្ទាត់សម្រាប់មួយចំណុច"
                        ></textarea>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label" :for="`admin-lesson-steps-${index}`">ជំហានអនុវត្ត</label>
                        <textarea
                          :id="`admin-lesson-steps-${index}`"
                          v-model="lesson.steps"
                          class="form-control"
                          rows="4"
                          placeholder="មួយបន្ទាត់សម្រាប់មួយជំហាន"
                        ></textarea>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label" :for="`admin-lesson-practice-${index}`">Practice</label>
                        <textarea
                          :id="`admin-lesson-practice-${index}`"
                          v-model="lesson.practice"
                          class="form-control"
                          rows="3"
                        ></textarea>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label" :for="`admin-lesson-deliverable-${index}`">Deliverable</label>
                        <textarea
                          :id="`admin-lesson-deliverable-${index}`"
                          v-model="lesson.deliverable"
                          class="form-control"
                          rows="3"
                        ></textarea>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>

            <button class="btn btn-primary mt-4" type="submit">
              <i class="bi bi-save me-2"></i>{{ isEditing ? 'រក្សាទុកការកែប្រែ' : 'បង្កើតវគ្គ' }}
            </button>
          </form>

          <div class="content-panel">
            <div class="d-flex justify-content-between align-items-start gap-3 mb-4">
              <div>
                <span class="section-kicker">Admin Catalog</span>
                <h2 class="h4 fw-bold mt-2 mb-0">វគ្គដែលបង្កើតដោយ Admin</h2>
              </div>
              <span class="badge text-bg-primary">{{ adminCourses.length }}</span>
            </div>

            <div v-if="adminCourses.length" class="admin-course-list">
              <article v-for="course in adminCourses" :key="course.id" class="admin-course-row admin-course-row--rich">
                <img v-if="course.image" :src="course.image" :alt="course.title" />
                <div>
                  <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                    <h3 class="h6 fw-bold mb-0">{{ course.title }}</h3>
                    <span class="badge" :class="course.status === 'Draft' ? 'text-bg-secondary' : 'text-bg-success'">
                      {{ course.status }}
                    </span>
                  </div>
                  <p class="text-secondary mb-0">{{ course.category }} • {{ course.duration }} • {{ course.lessons.length }} lessons</p>
                </div>

                <div class="admin-course-actions">
                  <button class="btn btn-outline-primary btn-sm" type="button" @click="editCourse(course)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-outline-success btn-sm" type="button" @click="togglePublish(course)">
                    <i class="bi" :class="course.status === 'Draft' ? 'bi-cloud-upload' : 'bi-eye-slash'"></i>
                  </button>
                  <button class="btn btn-outline-secondary btn-sm" type="button" @click="copyCourse(course)">
                    <i class="bi bi-copy"></i>
                  </button>
                  <button class="btn btn-outline-danger btn-sm" type="button" @click="removeCourse(course)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </article>
            </div>

            <p v-else class="text-secondary mb-0">មិនទាន់មាន course ដែលបង្កើតដោយ admin ទេ។</p>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
