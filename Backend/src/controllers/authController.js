const crypto = require('crypto')
const nodemailer = require('nodemailer')

const User = require('../models/User')
const generateToken = require('../utils/generateToken')

// Gmail transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      })
    }

    const existing = await User.findOne({ email })

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      })
    }

    const allowedRoles = ['seeker', 'recruiter']
    const userRole = allowedRoles.includes(role) ? role : 'seeker'

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
    })

    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is suspended',
      })
    }

    const token = generateToken(user._id)

    res.json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/logout
const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  })
}

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedJobs', 'title location employmentType')

    res.json({
      success: true,
      data: user,
    })
  } catch (err) {
    next(err)
  }
}

// PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const fields = [
      'name',
      'phone',
      'location',
      'bio',
      'skills',
      'experience',
      'education',
      'avatar',
    ]

    const updates = {}

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    })

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    )

    res.json({
      success: true,
      data: user,
    })
  } catch (err) {
    next(err)
  }
}

// PUT /api/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both current and new password are required',
      })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters',
      })
    }

    const user = await User.findById(req.user._id).select('+password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      })
    }

    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: 'Password updated successfully',
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      })
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    })

    // Security: same response whether account exists or not
    if (!user) {
      return res.json({
        success: true,
        message:
          'If an account exists with this email, a password reset link has been sent.',
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')

    // Save hashed token in database
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    // Token expires after 15 minutes
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000

    await user.save({ validateBeforeSave: false })

    // Frontend reset page
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

    // Send email
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: user.email,
      subject: 'CareerBridge - Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
          
          <h2 style="color: #4f46e5;">
            CareerBridge
          </h2>

          <h3>Password Reset Request</h3>

          <p>
            Hello ${user.name || 'User'},
          </p>

          <p>
            We received a request to reset your CareerBridge password.
          </p>

          <p>
            Click the button below to create a new password.
          </p>

          <div style="margin: 30px 0;">
            <a
              href="${resetUrl}"
              style="
                background: #4f46e5;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                display: inline-block;
              "
            >
              Reset Password
            </a>
          </div>

          <p>
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset, you can safely ignore this email.
          </p>

          <hr />

          <p style="color: #777; font-size: 12px;">
            © CareerBridge
          </p>

        </div>
      `,
    })

    console.log(`Password reset email sent to: ${user.email}`)

    res.json({
      success: true,
      message:
        'If an account exists with this email, a password reset link has been sent.',
    })
  } catch (err) {
    console.error('Forgot password error:', err)

    // Clear reset token if email failed
    try {
      if (req.body.email) {
        const user = await User.findOne({
          email: req.body.email.toLowerCase().trim(),
        })

        if (user) {
          user.resetPasswordToken = undefined
          user.resetPasswordExpire = undefined
          await user.save({ validateBeforeSave: false })
        }
      }
    } catch (clearError) {
      console.error('Error clearing reset token:', clearError)
    }

    next(err)
  }
}

// POST /api/auth/reset-password
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required',
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters',
      })
    }

    // Hash token received from frontend
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+password')

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is invalid or has expired',
      })
    }

    // Set new password
    user.password = password

    // Clear reset token
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    // Generate login token
    const authToken = generateToken(user._id)

    res.json({
      success: true,
      message: 'Password reset successfully',
      data: {
        token: authToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
}