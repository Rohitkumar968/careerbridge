const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    // =========================
    // BASIC USER INFORMATION
    // =========================
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },

    // =========================
    // USER ROLE
    // =========================
    role: {
      type: String,
      enum: ['seeker', 'job_seeker', 'recruiter', 'admin'],
      default: 'seeker',
    },

    // =========================
    // PROFILE
    // =========================
    avatar: {
      type: String,
      default: '',
    },

    phone: {
      type: String,
      default: '',
    },

    location: {
      type: String,
      default: '',
    },

    bio: {
      type: String,
      default: '',
    },

    skills: [
      {
        type: String,
      },
    ],

    // =========================
    // EXPERIENCE
    // =========================
    experience: [
      {
        title: String,
        company: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    // =========================
    // EDUCATION
    // =========================
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],

    // =========================
    // RESUME
    // =========================
    resume: {
      type: String,
      default: '',
    },

    // =========================
    // SAVED JOBS
    // =========================
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],

    // =========================
    // ACCOUNT STATUS
    // =========================
    isActive: {
      type: Boolean,
      default: true,
    },

    // =========================
    // PASSWORD RESET
    // =========================
    resetPasswordToken: {
      type: String,
      default: null,
      select: false,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  }
)

// =========================
// HASH PASSWORD BEFORE SAVE
// =========================
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  this.password = await bcrypt.hash(this.password, 12)

  next()
})

// =========================
// COMPARE PASSWORD
// =========================
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)