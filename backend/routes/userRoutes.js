import express from 'express'
const router = express.Router()
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  checkForExistingUser,
  sendPasswordResetEmail,
  updateUserPassword,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(protect, admin, getUsers)
router.route('/').post(registerUser)
router.route('/emailcheck').get(checkForExistingUser)
router.route('/forgotpassword').post(sendPasswordResetEmail)
router.route('/updatepassword/:token').put(updateUserPassword)
router.route('/login').post(authUser)
router.route('/profile').get(protect, getUserProfile)
router.route('/profile').put(protect, updateUserProfile)
router.route('/:id').delete(protect, admin, deleteUser)
router.route('/:id').get(protect, admin, getUserById)
router.route('/:id').put(protect, admin, updateUser)

export default router
