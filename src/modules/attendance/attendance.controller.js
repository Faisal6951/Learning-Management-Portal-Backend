const attendanceService = require('./attendance.service')

const markAttendance = async (req, res) => {
  try {
    const { courseId, date, records } = req.body

    if (!courseId || !date || !records || !records.length) {
      return res.status(400).json({
        success: false,
        message: 'courseId, date and records array are required'
      })
    }

    const result = await attendanceService.markAttendance(
      req.user.userId,
      { courseId, date, records }
    )

    res.status(201).json({ success: true, message: result.message, total: result.total })

  } catch (error) {
    if (error.message === 'COURSE_NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }
    if (error.message === 'UNAUTHORIZED_COURSE') {
      return res.status(403).json({ success: false, message: 'This course is not assigned to you' })
    }
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

const getCourseAttendance = async (req, res) => {
  try {
    const result = await attendanceService.getCourseAttendance(
      req.user.userId,
      req.params.id
    )
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    if (error.message === 'COURSE_NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }
    if (error.message === 'UNAUTHORIZED_COURSE') {
      return res.status(403).json({ success: false, message: 'This course is not assigned to you' })
    }
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

const getStudentCourseAttendance = async (req, res) => {
  try {
    const result = await attendanceService.getStudentCourseAttendance(
      req.user.userId,
      req.params.id
    )
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    if (error.message === 'NOT_ENROLLED') {
      return res.status(403).json({ success: false, message: 'You are not enrolled in this course' })
    }
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

const getStudentAllAttendance = async (req, res) => {
  try {
    const result = await attendanceService.getStudentAllAttendance(req.user.userId)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

module.exports = {
  markAttendance,
  getCourseAttendance,
  getStudentCourseAttendance,
  getStudentAllAttendance
}