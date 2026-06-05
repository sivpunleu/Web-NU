export function lessonTitle(lesson) {
  if (typeof lesson === 'string') return lesson
  return lesson?.title || 'Untitled lesson'
}

export function lessonSummary(lesson, course = {}) {
  if (lesson && typeof lesson === 'object' && lesson.summary) return lesson.summary
  return `ស្វែងយល់ពី ${lessonTitle(lesson)} ក្នុងបរិបទ ${course.title || 'វគ្គសិក្សា'} ហើយភ្ជាប់ទៅការអនុវត្តពិត។`
}

export function lessonDuration(lesson) {
  if (lesson && typeof lesson === 'object' && lesson.duration) return lesson.duration
  return '៣៥ នាទី'
}

export function lessonObjectives(lesson, course = {}) {
  if (lesson && typeof lesson === 'object' && lesson.objectives?.length) return lesson.objectives

  return [
    `ពន្យល់បានថា ${lessonTitle(lesson)} ជួយអ្វីក្នុង ${course.category || 'workflow'}។`,
    'ស្គាល់ពាក្យគន្លឹះ និងការប្រើប្រាស់ជាក់ស្តែង។',
    'រៀបចំ checklist មុនចាប់ផ្តើមអនុវត្ត។',
  ]
}

export function lessonSteps(lesson) {
  if (lesson && typeof lesson === 'object' && lesson.steps?.length) return lesson.steps

  return [
    'ពិនិត្យ concept និង example សំខាន់ៗ។',
    'អនុវត្តតាម guided exercise មួយជំហានម្តង។',
    'ត្រួតពិនិត្យលទ្ធផល និងកត់ចំណុចដែលត្រូវកែលម្អ។',
  ]
}

export function lessonPractice(lesson, course = {}) {
  if (lesson && typeof lesson === 'object' && lesson.practice) return lesson.practice
  return `បង្កើត mini task មួយសម្រាប់ ${lessonTitle(lesson)} ហើយភ្ជាប់ទៅ project របស់ ${course.title || 'វគ្គនេះ'}។`
}

export function lessonDeliverable(lesson) {
  if (lesson && typeof lesson === 'object' && lesson.deliverable) return lesson.deliverable
  return 'ឯកសារ note ខ្លី និងលទ្ធផលអនុវត្តមួយដែលអាចបន្តទៅមេរៀនបន្ទាប់បាន។'
}

export function lessonResources(lesson) {
  if (lesson && typeof lesson === 'object' && lesson.resources?.length) return lesson.resources

  return [
    {
      icon: 'bi-file-earmark-text',
      title: 'Lesson notes',
      meta: 'សង្ខេប concept និង checklist សម្រាប់រៀនឡើងវិញ',
    },
    {
      icon: 'bi-code-slash',
      title: 'Practice starter',
      meta: 'Template សម្រាប់អនុវត្តតាមមេរៀននេះ',
    },
    {
      icon: 'bi-link-45deg',
      title: 'Reference links',
      meta: 'ឯកសារយោង និង example បន្ថែម',
    },
  ]
}

export function lessonChapters(lesson) {
  if (lesson && typeof lesson === 'object' && lesson.chapters?.length) return lesson.chapters

  return [
    { time: '00:00', title: 'មើលទិដ្ឋភាពទូទៅនៃមេរៀន' },
    { time: '08:30', title: `ពន្យល់ concept សំខាន់ៗក្នុង ${lessonTitle(lesson)}` },
    { time: '22:00', title: 'Guided practice និងការត្រួតពិនិត្យលទ្ធផល' },
  ]
}

export function normalizeLesson(lesson, course = {}) {
  const base = lesson && typeof lesson === 'object' ? lesson : { title: String(lesson || '').trim() }

  return {
    ...base,
    title: lessonTitle(base),
    summary: lessonSummary(base, course),
    duration: lessonDuration(base),
    objectives: lessonObjectives(base, course),
    steps: lessonSteps(base),
    practice: lessonPractice(base, course),
    deliverable: lessonDeliverable(base),
    resources: lessonResources(base),
    chapters: lessonChapters(base),
  }
}
