import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiClient } from '../services/apiClient.js';

export const useDataStore = defineStore('data', () => {
    const patients = ref([]);
    const appointments = ref([]);
    const rooms = ref([]);
    const doctors = ref([]);
    const users = ref([]);
    const loading = ref(false);

    const fetchPatients = async () => {
        loading.value = true;
        try {
            const response = await apiClient.get('/patients')
            patients.value = response.data
        } catch (err) {
            console.error('Error fetching patients:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchAppointments = async (filters = {}) => {
        loading.value = true
        try {
            const params = new URLSearchParams(filters)
            const response = await apiClient.get(`/appointments?${params}`)
            appointments.value = response.data
        } catch (err) {
            console.error('Error fetching appointments:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchRooms = async () => {
        loading.value = true
        try {
            const response = await apiClient.get('/rooms')
            rooms.value = response.data
        } catch (err) {
            console.error('Error fetching rooms:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchDoctors = async () => {
        loading.value = true
        try {
            const response = await apiClient.get('/doctors')
            doctors.value = response.data
        } catch (err) {
            console.error('Error fetching doctors:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchUsers = async () => {
        loading.value = true;
        try {
            const response = await apiClient.get('/users')
            users.value = response.data
        } catch (err) {
            console.error('Error fetching users:', err)
        } finally {
            loading.value = false
        }
    }

    return {
        patients,
        appointments,
        rooms,
        doctors,
        users,
        loading,
        fetchPatients,
        fetchAppointments,
        fetchRooms,
        fetchDoctors,
        fetchUsers
    }
})
