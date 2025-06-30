// Authentication JavaScript functionality
document.addEventListener('DOMContentLoaded', function () {
	initializeAuth()
})

function initializeAuth() {
	const loginForm = document.getElementById('loginForm')
	const registerForm = document.getElementById('registerForm')
	const forgotPasswordForm = document.getElementById('forgotPasswordForm')
	const toggleLoginPassword = document.getElementById('toggleLoginPassword')
	const toggleRegisterPassword = document.getElementById(
		'toggleRegisterPassword'
	)
	const phoneInput = document.getElementById('phone')

	// Password visibility toggles
	if (toggleLoginPassword) {
		toggleLoginPassword.addEventListener('click', function () {
			togglePasswordVisibility('loginPassword', this)
		})
	}

	if (toggleRegisterPassword) {
		toggleRegisterPassword.addEventListener('click', function () {
			togglePasswordVisibility('registerPassword', this)
		})
	}

	// Phone number formatting
	if (phoneInput) {
		phoneInput.addEventListener('input', formatPhoneNumber)
	}

	// Form submissions
	if (loginForm) {
		loginForm.addEventListener('submit', handleLogin)
	}

	if (registerForm) {
		registerForm.addEventListener('submit', handleRegister)
	}

	if (forgotPasswordForm) {
		document
			.getElementById('sendResetEmail')
			.addEventListener('click', handleForgotPassword)
	}

	// Real-time validation
	setupRealTimeValidation()
}

function togglePasswordVisibility(inputId, button) {
	const input = document.getElementById(inputId)
	const icon = button.querySelector('i')

	if (input.type === 'password') {
		input.type = 'text'
		icon.classList.remove('bi-eye')
		icon.classList.add('bi-eye-slash')
	} else {
		input.type = 'password'
		icon.classList.remove('bi-eye-slash')
		icon.classList.add('bi-eye')
	}
}

function formatPhoneNumber(event) {
	let value = event.target.value.replace(/\D/g, '')

	if (value.startsWith('7')) {
		value = value.substring(1)
	} else if (value.startsWith('8')) {
		value = value.substring(1)
	}

	if (value.length > 0) {
		if (value.length <= 3) {
			value = `+7 (${value}`
		} else if (value.length <= 6) {
			value = `+7 (${value.substring(0, 3)}) ${value.substring(3)}`
		} else if (value.length <= 8) {
			value = `+7 (${value.substring(0, 3)}) ${value.substring(
				3,
				6
			)}-${value.substring(6)}`
		} else {
			value = `+7 (${value.substring(0, 3)}) ${value.substring(
				3,
				6
			)}-${value.substring(6, 8)}-${value.substring(8, 10)}`
		}
	}

	event.target.value = value
}

function setupRealTimeValidation() {
	// Email validation
	const emailInputs = document.querySelectorAll('input[type="email"]')
	emailInputs.forEach(input => {
		input.addEventListener('blur', function () {
			validateEmail(this)
		})
	})

	// Password validation
	const registerPassword = document.getElementById('registerPassword')
	const confirmPassword = document.getElementById('confirmPassword')

	if (registerPassword) {
		registerPassword.addEventListener('input', function () {
			validatePassword(this)
			if (confirmPassword.value) {
				validatePasswordConfirmation(confirmPassword)
			}
		})
	}

	if (confirmPassword) {
		confirmPassword.addEventListener('input', function () {
			validatePasswordConfirmation(this)
		})
	}

	// Required fields
	const requiredInputs = document.querySelectorAll('input[required]')
	requiredInputs.forEach(input => {
		input.addEventListener('blur', function () {
			validateRequired(this)
		})
	})
}

function validateEmail(input) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	const isValid = emailRegex.test(input.value)

	updateValidationState(input, isValid)
	return isValid
}

function validatePassword(input) {
	const minLength = 8
	const hasLetter = /[a-zA-Z]/.test(input.value)
	const hasNumber = /\d/.test(input.value)
	const isValid = input.value.length >= minLength && hasLetter && hasNumber

	updateValidationState(input, isValid)
	return isValid
}

function validatePasswordConfirmation(input) {
	const password = document.getElementById('registerPassword').value
	const isValid = input.value === password && input.value.length > 0

	updateValidationState(input, isValid)
	return isValid
}

function validateRequired(input) {
	const isValid = input.value.trim().length > 0
	updateValidationState(input, isValid)
	return isValid
}

function updateValidationState(input, isValid) {
	if (isValid) {
		input.classList.remove('is-invalid')
		input.classList.add('is-valid')
	} else {
		input.classList.remove('is-valid')
		input.classList.add('is-invalid')
	}
}

function handleLogin(event) {
	event.preventDefault()

	const form = event.target
	const email = document.getElementById('loginEmail').value
	const password = document.getElementById('loginPassword').value
	const rememberMe = document.getElementById('rememberMe').checked

	// Validate form
	if (!validateLoginForm()) {
		return
	}

	// Show loading state
	setFormLoading(form, true)

	// Simulate API call
	setTimeout(() => {
		// Simulate successful login
		setFormLoading(form, false)

		// Store user data (in real app, this would come from server)
		const userData = {
			email: email,
			name: 'Пользователь',
			isAuthenticated: true,
		}

		if (rememberMe) {
			localStorage.setItem('userData', JSON.stringify(userData))
		} else {
			sessionStorage.setItem('userData', JSON.stringify(userData))
		}

		showAlert('success', 'Вы успешно вошли в систему!')

		// Redirect after delay
		setTimeout(() => {
			window.location.href = 'index.html'
		}, 1500)
	}, 2000)
}

function handleRegister(event) {
	event.preventDefault()

	const form = event.target

	// Validate form
	if (!validateRegisterForm()) {
		return
	}

	// Show loading state
	setFormLoading(form, true)

	// Simulate API call
	setTimeout(() => {
		setFormLoading(form, false)
		showAlert(
			'success',
			'Аккаунт успешно создан! Проверьте email для подтверждения.'
		)

		// Switch to login tab
		setTimeout(() => {
			const loginTab = document.getElementById('login-tab')
			loginTab.click()
		}, 2000)
	}, 2000)
}

function handleForgotPassword() {
	const email = document.getElementById('resetEmail').value

	if (!email || !validateEmail(document.getElementById('resetEmail'))) {
		showAlert('error', 'Введите корректный email адрес')
		return
	}

	// Simulate API call
	setTimeout(() => {
		showAlert(
			'success',
			'Инструкции по восстановлению пароля отправлены на указанный email'
		)

		// Close modal
		const modal = bootstrap.Modal.getInstance(
			document.getElementById('forgotPasswordModal')
		)
		modal.hide()

		// Clear form
		document.getElementById('resetEmail').value = ''
	}, 1000)
}

function validateLoginForm() {
	const email = document.getElementById('loginEmail')
	const password = document.getElementById('loginPassword')

	let isValid = true

	if (!validateEmail(email)) {
		isValid = false
	}

	if (!validateRequired(password)) {
		isValid = false
	}

	return isValid
}

function validateRegisterForm() {
	const firstName = document.getElementById('firstName')
	const lastName = document.getElementById('lastName')
	const email = document.getElementById('registerEmail')
	const password = document.getElementById('registerPassword')
	const confirmPassword = document.getElementById('confirmPassword')
	const agreeTerms = document.getElementById('agreeTerms')

	let isValid = true

	if (!validateRequired(firstName)) {
		isValid = false
	}

	if (!validateRequired(lastName)) {
		isValid = false
	}

	if (!validateEmail(email)) {
		isValid = false
	}

	if (!validatePassword(password)) {
		isValid = false
	}

	if (!validatePasswordConfirmation(confirmPassword)) {
		isValid = false
	}

	if (!agreeTerms.checked) {
		agreeTerms.classList.add('is-invalid')
		isValid = false
	} else {
		agreeTerms.classList.remove('is-invalid')
	}

	return isValid
}

function setFormLoading(form, isLoading) {
	const submitBtn = form.querySelector('button[type="submit"]')
	const textSpan = submitBtn.querySelector('.login-text, .register-text')
	const loadingSpan = submitBtn.querySelector('.loading')

	if (isLoading) {
		submitBtn.disabled = true
		textSpan.classList.add('d-none')
		loadingSpan.classList.remove('d-none')
	} else {
		submitBtn.disabled = false
		textSpan.classList.remove('d-none')
		loadingSpan.classList.add('d-none')
	}
}

function showAlert(type, message) {
	const alertElement = document.getElementById(
		type === 'success' ? 'successAlert' : 'errorAlert'
	)
	const messageElement = document.getElementById(
		type === 'success' ? 'successMessage' : 'errorMessage'
	)

	messageElement.textContent = message
	alertElement.style.display = 'block'

	// Auto-hide after 5 seconds
	setTimeout(() => {
		alertElement.style.display = 'none'
	}, 5000)
}

// Check if user is already logged in
function checkAuthStatus() {
	const userData =
		localStorage.getItem('userData') || sessionStorage.getItem('userData')

	if (userData) {
		// User is logged in, redirect to account page or show different UI
		// For demo purposes, we'll just show an alert
		showAlert('info', 'Вы уже авторизованы в системе')
	}
}

// Initialize auth status check
document.addEventListener('DOMContentLoaded', function () {
	// Uncomment to check auth status on page load
	// checkAuthStatus();
})
