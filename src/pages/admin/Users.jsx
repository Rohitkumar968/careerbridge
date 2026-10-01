import React, { useEffect, useMemo, useState } from 'react'
import {
  Search,
  Trash2,
  Edit,
  X,
  Users as UsersIcon,
  UserCheck,
  UserX,
  Shield,
  RefreshCw,
  Ban,
} from 'lucide-react'

import {
  Button,
  Input,
  Card,
  LoadingSpinner,
} from '../../components/common'

import api from '../../services/api'

const initialForm = {
  name: '',
  email: '',
  role: 'seeker',
  isActive: true,
}

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  // =====================================================
  // LOAD USERS
  // =====================================================

  const loadUsers = async () => {
    try {
      setLoading(true)

      const response = await api.get('/admin/users', {
        params: {
          page: 1,
          limit: 100,
          ...(roleFilter ? { role: roleFilter } : {}),
          ...(search.trim()
            ? { keyword: search.trim() }
            : {}),
        },
      })

      setUsers(response?.data?.data || [])
    } catch (error) {
      console.error('Load users error:', error)

      alert(
        error?.response?.data?.message ||
          'Could not load users'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [roleFilter])

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = async () => {
    await loadUsers()
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // =====================================================
  // FILTERED USERS
  // =====================================================

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) {
      return users
    }

    return users.filter((user) => {
      const name = user.name || ''
      const email = user.email || ''

      return (
        name.toLowerCase().includes(keyword) ||
        email.toLowerCase().includes(keyword)
      )
    })
  }, [users, search])

  // =====================================================
  // EDIT USER
  // =====================================================

  const handleEdit = (user) => {
    setEditingUser(user)

    setForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'seeker',
      isActive: user.isActive !== false,
    })
  }

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // =====================================================
  // UPDATE USER
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!editingUser?._id) {
      alert('User ID not found')
      return
    }

    try {
      setSaving(true)

      const response = await api.put(
        `/admin/users/${editingUser._id}`,
        {
          name: form.name,
          email: form.email,
          role: form.role,
          isActive: form.isActive,
        }
      )

      const updatedUser = response?.data?.data

      if (updatedUser) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === updatedUser._id
              ? updatedUser
              : user
          )
        )
      } else {
        await loadUsers()
      }

      setEditingUser(null)
      setForm(initialForm)

      alert('User updated successfully')
    } catch (error) {
      console.error('Update user error:', error)

      alert(
        error?.response?.data?.message ||
          'Could not update user'
      )
    } finally {
      setSaving(false)
    }
  }

  // =====================================================
  // ACTIVATE / SUSPEND USER
  // =====================================================

  const handleToggleStatus = async (user) => {
    if (!user?._id) {
      alert('User ID not found')
      return
    }

    const action = user.isActive
      ? 'suspend'
      : 'activate'

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${user.name}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await api.put(
        `/admin/users/${user._id}/status`
      )

      const updatedStatus =
        response?.data?.data?.isActive

      setUsers((prev) =>
        prev.map((item) =>
          item._id === user._id
            ? {
                ...item,
                isActive: updatedStatus,
              }
            : item
        )
      )

      alert(
        updatedStatus
          ? 'User activated successfully'
          : 'User suspended successfully'
      )
    } catch (error) {
      console.error(
        'Update user status error:',
        error
      )

      alert(
        error?.response?.data?.message ||
          'Could not update user status'
      )
    }
  }

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDelete = async (user) => {
    if (!user?._id) {
      alert('User ID not found')
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${user.name}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      await api.delete(
        `/admin/users/${user._id}`
      )

      setUsers((prev) =>
        prev.filter(
          (item) => item._id !== user._id
        )
      )

      alert('User deleted successfully')
    } catch (error) {
      console.error('Delete user error:', error)

      alert(
        error?.response?.data?.message ||
          'Could not delete user'
      )
    }
  }

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeEdit = () => {
    if (saving) return

    setEditingUser(null)
    setForm(initialForm)
  }

  // =====================================================
  // STATS
  // =====================================================

  const totalUsers = users.length

  const activeUsers = users.filter(
    (user) => user.isActive
  ).length

  const inactiveUsers = users.filter(
    (user) => !user.isActive
  ).length

  const seekers = users.filter(
    (user) =>
      user.role === 'seeker' ||
      user.role === 'job_seeker'
  ).length

  const recruiters = users.filter(
    (user) => user.role === 'recruiter'
  ).length

  const admins = users.filter(
    (user) => user.role === 'admin'
  ).length

  // =====================================================
  // ROLE LABEL
  // =====================================================

  const getRoleLabel = (role) => {
    if (role === 'job_seeker') {
      return 'Job Seeker'
    }

    if (role === 'seeker') {
      return 'Seeker'
    }

    if (role === 'recruiter') {
      return 'Recruiter'
    }

    if (role === 'admin') {
      return 'Admin'
    }

    return role || 'Unknown'
  }

  // =====================================================
  // ROLE BADGE
  // =====================================================

  const getRoleClass = (role) => {
    if (
      role === 'seeker' ||
      role === 'job_seeker'
    ) {
      return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
    }

    if (role === 'recruiter') {
      return 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
    }

    if (role === 'admin') {
      return 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
    }

    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Users Management
          </h1>

          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage CareerBridge users and accounts
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadUsers}
          className="flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Refresh
        </Button>

      </div>


      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <Card className="p-5">

        <div className="flex flex-col gap-3 md:flex-row">

          <div className="relative flex-1">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <Input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onKeyDown={handleSearchKeyDown}
              placeholder="Search by name or email..."
              className="pl-11"
            />

          </div>

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="">
              All Roles
            </option>

            <option value="seeker">
              Seeker
            </option>

            <option value="job_seeker">
              Job Seeker
            </option>

            <option value="recruiter">
              Recruiter
            </option>

            <option value="admin">
              Admin
            </option>
          </select>

          <Button
            onClick={handleSearch}
            className="flex items-center justify-center gap-2"
          >
            <Search size={18} />
            Search
          </Button>

        </div>

      </Card>


      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Card className="p-5">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950">
              <UsersIcon size={25} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Users
              </p>

              <p className="text-2xl font-bold">
                {totalUsers}
              </p>
            </div>

          </div>

        </Card>


        <Card className="p-5">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-green-50 p-3 text-green-600 dark:bg-green-950">
              <UserCheck size={25} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Active Users
              </p>

              <p className="text-2xl font-bold">
                {activeUsers}
              </p>
            </div>

          </div>

        </Card>


        <Card className="p-5">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-red-50 p-3 text-red-600 dark:bg-red-950">
              <UserX size={25} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Inactive Users
              </p>

              <p className="text-2xl font-bold">
                {inactiveUsers}
              </p>
            </div>

          </div>

        </Card>


        <Card className="p-5">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-purple-50 p-3 text-purple-600 dark:bg-purple-950">
              <Shield size={25} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Recruiters
              </p>

              <p className="text-2xl font-bold">
                {recruiters}
              </p>
            </div>

          </div>

        </Card>

      </div>


      {/* =================================================
          EXTRA ROLE STATS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Seekers
            </span>

            <span className="text-lg font-bold">
              {seekers}
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Recruiters
            </span>

            <span className="text-lg font-bold">
              {recruiters}
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Admins
            </span>

            <span className="text-lg font-bold">
              {admins}
            </span>
          </div>
        </Card>

      </div>


      {/* =================================================
          USER LIST
      ================================================= */}

      <div className="space-y-4">

        {filteredUsers.length === 0 ? (

          <Card className="p-10 text-center">

            <UsersIcon
              size={45}
              className="mx-auto mb-4 text-gray-400"
            />

            <h3 className="text-lg font-semibold">
              No users found
            </h3>

            <p className="mt-1 text-gray-500">
              Try changing your search or filter.
            </p>

          </Card>

        ) : (

          filteredUsers.map((user) => (

            <Card
              key={user._id}
              className="p-6"
            >

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                {/* USER INFO */}

                <div className="flex min-w-0 items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {(user.name || 'U')
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">

                    <h2 className="truncate text-lg font-bold text-gray-900 dark:text-white">
                      {user.name || 'Unnamed User'}
                    </h2>

                    <p className="truncate text-sm text-gray-500">
                      {user.email || 'No email'}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleClass(
                          user.role
                        )}`}
                      >
                        {getRoleLabel(user.role)}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          user.isActive
                            ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                            : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {user.isActive
                          ? 'Active'
                          : 'Inactive'}
                      </span>

                    </div>

                    {user.createdAt && (
                      <p className="mt-2 text-xs text-gray-400">
                        Joined{' '}
                        {new Date(
                          user.createdAt
                        ).toLocaleDateString(
                          'en-GB',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </p>
                    )}

                  </div>

                </div>


                {/* ACTIONS */}

                <div className="flex flex-wrap gap-2">

                  <Button
                    variant="outline"
                    onClick={() =>
                      handleEdit(user)
                    }
                    className="flex items-center gap-2"
                  >
                    <Edit size={17} />
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      handleToggleStatus(user)
                    }
                    className="flex items-center gap-2"
                  >
                    <Ban size={17} />

                    {user.isActive
                      ? 'Suspend'
                      : 'Activate'}
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() =>
                      handleDelete(user)
                    }
                    className="flex items-center gap-2"
                  >
                    <Trash2 size={17} />
                    Delete
                  </Button>

                </div>

              </div>

            </Card>

          ))

        )}

      </div>


      {/* =================================================
          EDIT USER MODAL
      ================================================= */}

      {editingUser && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">

            {/* HEADER */}

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit User
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update user information
                </p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={22} />
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleUpdate}
              className="space-y-5"
            >

              {/* NAME */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Name
                </label>

                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="User name"
                  required
                />

              </div>


              {/* EMAIL */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  required
                />

              </div>


              {/* ROLE */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Role
                </label>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="seeker">
                    Seeker
                  </option>

                  <option value="job_seeker">
                    Job Seeker
                  </option>

                  <option value="recruiter">
                    Recruiter
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>

              </div>


              {/* STATUS */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Account Status
                </label>

                <select
                  value={
                    form.isActive
                      ? 'active'
                      : 'inactive'
                  }
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isActive:
                        e.target.value ===
                        'active',
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t pt-5">

                <Button
                  type="button"
                  variant="outline"
                  onClick={closeEdit}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? 'Updating...'
                    : 'Update User'}
                </Button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

export default AdminUsers