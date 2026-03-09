import { apiClient } from './apiClient.js'

export const authService = {
    login: (username, password) => apiClient.post('/auth/login', { username, password }),
    createUser: (data) => apiClient.post('/auth/create-user', data),
    changePassword: (oldPassword, newPassword) => apiClient.post('/auth/change-password', { oldPassword, newPassword }),
    me: () => apiClient.get('/auth/me')
}

export const patientService = {
    getAll: (search = '', filter = '') => apiClient.get('/patients', { params: { search, filter } }),
    getById: (id) => apiClient.get(`/patients/${id}`),
    create: (data) => apiClient.post('/patients', data),
    update: (id, data) => apiClient.put(`/patients/${id}`, data),
    delete: (id) => apiClient.delete(`/patients/${id}`)
}

export const appointmentService = {
    getAll: (doctor_id = '', patient_id = '') => apiClient.get('/appointments', { params: { doctor_id, patient_id } }),
    getById: (id) => apiClient.get(`/appointments/${id}`),
    create: (data) => apiClient.post('/appointments', data),
    update: (id, data) => apiClient.put(`/appointments/${id}`, data),
    delete: (id) => apiClient.delete(`/appointments/${id}`)
}

export const roomService = {
    getAll: () => apiClient.get('/rooms'),
    getById: (id) => apiClient.get(`/rooms/${id}`),
    create: (data) => apiClient.post('/rooms', data),
    update: (id, data) => apiClient.put(`/rooms/${id}`, data),
    delete: (id) => apiClient.delete(`/rooms/${id}`)
}

export const doctorService = {
    getAll: () => apiClient.get('/doctors'),
    getById: (id) => apiClient.get(`/doctors/${id}`),
    create: (data) => apiClient.post('/doctors', data),
    update: (id, data) => apiClient.put(`/doctors/${id}`, data),
    delete: (id) => apiClient.delete(`/doctors/${id}`)
}

export const userService = {
    getAll: () => apiClient.get('/users'),
    getById: (id) => apiClient.get(`/users/${id}`),
    update: (id, data) => apiClient.put(`/users/${id}`, data),
    delete: (id) => apiClient.delete(`/users/${id}`)
}

export const adminsService = {
    getAll: () => apiClient.get('/admins'),
    getById: (id) => apiClient.get(`/admins/${id}`),
    create: (data) => apiClient.post('/admins', data),
    update: (id, data) => apiClient.put(`/admins/${id}`, data),
    delete: (id) => apiClient.delete(`/admins/${id}`)
}
