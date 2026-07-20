import { navigateTo } from './router.js'
import { handleLogout } from './components/sidebar.js'
import { openModal, closeModal, showToast } from './utils.js'
import {
  toggleActionMenu, editMentoring,
  changeMentoringStatus, deleteMentoring,
  submitMentoring, toggleModalityField,
  openParticipantsModal, closeParticipantsModal,
} from './pages/mentoring.js'
import { submitObservation } from './pages/observations.js'
import { setRating, submitFeedback } from './pages/feedback.js'
import { initLogin } from './pages/login.js'
import { initDashboard } from './pages/dashboard.js'
import { initMentoring } from './pages/mentoring.js'
import { initObservations } from './pages/observations.js'
import { initFeedback } from './pages/feedback.js'

window.navigateTo = navigateTo
window.handleLogout = handleLogout
window.openModal = openModal
window.closeModal = closeModal
window.showToast = showToast
window.toggleActionMenu = toggleActionMenu
window.editMentoring = editMentoring
window.changeMentoringStatus = changeMentoringStatus
window.deleteMentoring = deleteMentoring
window.submitMentoring = submitMentoring
window.toggleModalityField = toggleModalityField
window.openParticipantsModal = openParticipantsModal
window.closeParticipantsModal = closeParticipantsModal
window.submitObservation = submitObservation
window.setRating = setRating
window.submitFeedback = submitFeedback
window.initLogin = initLogin
window.initDashboard = initDashboard
window.initMentoring = initMentoring
window.initObservations = initObservations
window.initFeedback = initFeedback
