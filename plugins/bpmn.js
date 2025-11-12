let error_message = 'پاسخی از سمت سرور دریافت نشد'

export default async ({ $axios, $toast, store }, inject) => {
    inject('reqBpmn', (url, method = 'get', data = {}, config = {}) => {
        return new Promise((resolve, reject) => {
            const requestData = {
                url: url,
                method: method.toLowerCase(),
                data: data
            }

            // Add default parameters for specific endpoints
            if (method.toLowerCase() === 'get') {
                if (url === '/tasks') {
                    // Default filters for tasks - assigned to current user
                    if (!data.filter) {
                        requestData.data.filter = 'assigned_to_me'
                    }
                    if (!data.status) {
                        requestData.data.status = 'in_progress,pending'
                    }
                    if (!data.perPage) {
                        requestData.data.perPage = 50
                    }
                }
                
                if (url === '/start_processes') {
                    // Default parameters for processes
                    if (!data.status) {
                        requestData.data.status = 'active'
                    }
                    if (!data.perPage) {
                        requestData.data.perPage = 1000
                    }
                }
            }

            $axios
                .$post('/bpmn/request', requestData, config)
                .then((response) => {
                    if (response && (response.status === 200 || response.status === 201)) {
                        resolve(response.data || response)
                    } else if (response && response.status >= 400) {
                        const errorMsg = response.message || error_message
                        $toast.error(errorMsg)
                        
                        if (response.status === 401) {
                            store.dispatch('auth/error401')
                        }
                        reject(new Error(errorMsg))
                    } else {
                        // If no status field, assume success
                        resolve(response)
                    }
                })
                .catch((error) => {
                    try {
                        if (error && error.response && error.response.data && error.response.data.message) {
                            $toast.error(error.response.data.message)
                        } else if (error.message) {
                            $toast.error(error.message)
                        } else {
                            $toast.error(error_message)
                        }
                    } catch (e) {
                        $toast.error(error_message)
                    }
                    reject(error)
                })
        })
    })
}