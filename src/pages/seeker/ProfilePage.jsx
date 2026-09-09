import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {User,Mail,Phone,MapPin,FileText,Plus,Trash2,CheckCircle,Camera} from 'lucide-react'
import { Card, Button, Input } from '../../components/common'
import { setUser } from '../../store/slices/authSlice'
import authApi from '../../services/authApi'

export const ProfilePage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    skills: user?.skills?.join(', ') || '',
    experience: user?.experience?.length
      ? user.experience
      : [{ title: '', company: '', startDate: '', endDate: '', description: '' }],
    education: user?.education?.length
      ? user.education
      : [{ degree: '', institution: '', year: '' }],
  })

  const handleSave = async () => {
    setIsLoading(true)
    setSuccessMsg('')
    setErrorMsg('')
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        bio: form.bio.trim(),
        avatar: form.avatar,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        experience: form.experience.filter((e) => e.title || e.company),
        education: form.education.filter((e) => e.degree || e.institution),
      }
      const res = await authApi.updateProfile(payload)
      dispatch(setUser(res.data.data))
      setSuccessMsg('Profile updated successfully.')
      setIsEditing(false)
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setForm({
      name: user?.name || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
      skills: user?.skills?.join(', ') || '',
      experience: user?.experience?.length
        ? user.experience
        : [{ title: '', company: '', startDate: '', endDate: '', description: '' }],
      education: user?.education?.length
        ? user.education
        : [{ degree: '', institution: '', year: '' }],
    })
    setErrorMsg('')
    setIsEditing(false)
  }

  // Experience helpers
  const updateExp = (i, field, value) => {
    const updated = form.experience.map((e, idx) => idx === i ? { ...e, [field]: value } : e)
    setForm({ ...form, experience: updated })
  }
  const addExp = () =>
    setForm({ ...form, experience: [...form.experience, { title: '', company: '', startDate: '', endDate: '', description: '' }] })
  const removeExp = (i) =>
    setForm({ ...form, experience: form.experience.filter((_, idx) => idx !== i) })

  // Education helpers
  const updateEdu = (i, field, value) => {
    const updated = form.education.map((e, idx) => idx === i ? { ...e, [field]: value } : e)
    setForm({ ...form, education: updated })
  }
  const addEdu = () =>
    setForm({ ...form, education: [...form.education, { degree: '', institution: '', year: '' }] })
  const removeEdu = (i) =>
    setForm({ ...form, education: form.education.filter((_, idx) => idx !== i) })

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
<Card>
  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
    Profile Picture
  </h2>

  <div className="flex items-center gap-5">
    <div className="relative">
      {form.avatar ? (
        <img
          src={form.avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-md">
          <User className="w-10 h-10 text-primary-600" />
        </div>
      )}

      {isEditing && (
        <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md">
          <Camera className="w-4 h-4" />

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]

              if (!file) return

              if (file.size > 2 * 1024 * 1024) {
                setErrorMsg('Profile picture must be less than 2MB')
                return
              }

              const reader = new FileReader()

              reader.onloadend = () => {
                setForm({
                  ...form,
                  avatar: reader.result,
                })
              }

              reader.readAsDataURL(file)
            }}
          />
        </label>
      )}
    </div>

    <div>
      <p className="font-medium text-gray-900 dark:text-white">
        {user?.name || 'Your Profile'}
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        JPG, PNG or WebP • Maximum 2MB
      </p>

      {isEditing && (
        <p className="text-xs text-primary-600 mt-1">
          Click the camera icon to change your photo
        </p>
      )}
    </div>
  </div>
</Card>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your personal information</p>
        </div>
        {!isEditing && (
          <Button variant="primary" onClick={() => { setSuccessMsg(''); setIsEditing(true) }}>
            Edit Profile
          </Button>
        )}
      </div>

      {/* Feedback banners */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-400">{successMsg}</p>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{errorMsg}</p>
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isEditing ? (
            <>
              <Input
                label="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <p className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 text-sm">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed here</p>
              </div>
              <Input
                label="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
              <Input
                label="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="City, State"
              />
            </>
          ) : (
            <>
              <InfoRow icon={<User className="w-4 h-4" />} label="Name" value={user?.name} />
              <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={user?.email} />
              <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={user?.phone} placeholder="Not set" />
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="Location" value={user?.location} placeholder="Not set" />
            </>
          )}
        </div>

        {/* Bio */}
        <div className="mt-4">
          {isEditing ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                <FileText className="w-4 h-4" /> Bio
              </p>
              <p className="text-gray-800 dark:text-gray-200 text-sm">
                {user?.bio || <span className="text-gray-400 italic">Not set</span>}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Skills */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills</h2>
        {isEditing ? (
          <div>
            <Input
              label="Skills (comma-separated)"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="React, Node.js, MongoDB, TypeScript"
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {user?.skills?.length > 0
              ? user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              : <p className="text-gray-400 italic text-sm">No skills added yet</p>}
          </div>
        )}
      </Card>

      {/* Experience */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Experience</h2>
          {isEditing && (
            <Button variant="outline" size="sm" onClick={addExp}>
              <Plus className="w-4 h-4" /> Add
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            {form.experience.map((exp, i) => (
              <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
                <div className="flex justify-end">
                  <button onClick={() => removeExp(i)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input label="Job Title" value={exp.title} onChange={(e) => updateExp(i, 'title', e.target.value)} placeholder="Software Engineer" />
                  <Input label="Company" value={exp.company} onChange={(e) => updateExp(i, 'company', e.target.value)} placeholder="Acme Corp" />
                  <Input label="Start Date" value={exp.startDate} onChange={(e) => updateExp(i, 'startDate', e.target.value)} placeholder="2022-01" />
                  <Input label="End Date" value={exp.endDate} onChange={(e) => updateExp(i, 'endDate', e.target.value)} placeholder="2024-06 or Present" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExp(i, 'description', e.target.value)}
                    rows={2}
                    placeholder="Describe your responsibilities..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {user?.experience?.length > 0
              ? user.experience.map((exp, i) => (
                  <div key={i} className="flex gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{exp.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                      {(exp.startDate || exp.endDate) && (
                        <p className="text-xs text-gray-400 mt-1">{exp.startDate} — {exp.endDate || 'Present'}</p>
                      )}
                      {exp.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{exp.description}</p>}
                    </div>
                  </div>
                ))
              : <p className="text-gray-400 italic text-sm">No experience added yet</p>}
          </div>
        )}
      </Card>

      {/* Education */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h2>
          {isEditing && (
            <Button variant="outline" size="sm" onClick={addEdu}>
              <Plus className="w-4 h-4" /> Add
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            {form.education.map((edu, i) => (
              <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
                <div className="flex justify-end">
                  <button onClick={() => removeEdu(i)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input label="Degree" value={edu.degree} onChange={(e) => updateEdu(i, 'degree', e.target.value)} placeholder="B.Sc. Computer Science" />
                  <Input label="Institution" value={edu.institution} onChange={(e) => updateEdu(i, 'institution', e.target.value)} placeholder="State University" />
                  <Input label="Year" value={edu.year} onChange={(e) => updateEdu(i, 'year', e.target.value)} placeholder="2021" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {user?.education?.length > 0
              ? user.education.map((edu, i) => (
                  <div key={i} className="flex gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{edu.degree}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution}</p>
                      {edu.year && <p className="text-xs text-gray-400 mt-1">{edu.year}</p>}
                    </div>
                  </div>
                ))
              : <p className="text-gray-400 italic text-sm">No education added yet</p>}
          </div>
        )}
      </Card>

      {/* Save / Cancel */}
      {isEditing && (
        <div className="flex gap-3 pb-4">
          <Button variant="primary" onClick={handleSave} loading={isLoading}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}

// Small read-only row helper
const InfoRow = ({ icon, label, value, placeholder = '' }) => (
  <div>
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
      {icon} {label}
    </p>
    <p className="text-gray-900 dark:text-white text-sm">
      {value || <span className="text-gray-400 italic">{placeholder}</span>}
    </p>
  </div>
)

export default ProfilePage
