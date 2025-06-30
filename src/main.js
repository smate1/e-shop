// Main JavaScript functionality for e-commerce site
// import './main.css' - removed for browser compatibility

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	initializeCommonFeatures()
})

function initializeCommonFeatures() {
	// Initialize tooltips
	initializeTooltips()

	// Initialize cart functionality
	initializeCart()

	// Initialize search functionality
	initializeSearch()

	// Initialize user session
	checkUserSession()

	// Initialize smooth scrolling
	initializeSmoothScrolling()

	// Initialize form validation
	initializeFormValidation()
}

function initializeTooltips() {
	// Initialize Bootstrap tooltips
	const tooltipTriggerList = document.querySelectorAll(
		'[data-bs-toggle="tooltip"]'
	)
	const tooltipList = [...tooltipTriggerList].map(
		tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl)
	)
}

function initializeCart() {
	// Cart functionality
	const cartItems = getCartItems()
	updateCartCount(cartItems.length)

	// Add to cart buttons
	document.addEventListener('click', e => {
		if (e.target.matches('.add-to-cart')) {
			e.preventDefault()
			const productId = e.target.dataset.productId
			const productName = e.target.dataset.productName
			const productPrice = e.target.dataset.productPrice

			addToCart(productId, productName, productPrice)
			showCartNotification(productName)
		}
	})
}

function initializeSearch() {
	// Global search functionality
	const searchInputs = document.querySelectorAll(
		'input[type="search"], .search-input'
	)

	for (const input of searchInputs) {
		input.addEventListener('keypress', function (e) {
			if (e.key === 'Enter') {
				e.preventDefault()
				performGlobalSearch(this.value)
			}
		})
	}

	// Search suggestions (mock data)
	const searchSuggestions = [
		'телефон',
		'ноутбук',
		'наушники',
		'планшет',
		'часы',
		'футболка',
		'джинсы',
		'кроссовки',
		'рюкзак',
		'куртка',
	]

	// Add search autocomplete functionality
	for (const input of searchInputs) {
		setupSearchAutocomplete(input, searchSuggestions)
	}
}

function checkUserSession() {
	// Check if user is logged in
	const userData =
		localStorage.getItem('userData') || sessionStorage.getItem('userData')

	if (userData) {
		const user = JSON.parse(userData)
		updateUserInterface(user)
	}
}

function initializeSmoothScrolling() {
	// Smooth scrolling for anchor links
	for (const anchor of document.querySelectorAll('a[href^="#"]')) {
		anchor.addEventListener('click', function (e) {
			e.preventDefault()
			const target = document.querySelector(this.getAttribute('href'))
			if (target) {
				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				})
			}
		})
	}
}

function initializeFormValidation() {
	// Custom form validation
	const forms = document.querySelectorAll('form[data-validate="true"]')

	for (const form of forms) {
		form.addEventListener('submit', function (e) {
			if (!validateForm(this)) {
				e.preventDefault()
				e.stopPropagation()
			}
			this.classList.add('was-validated')
		})
	}
}

// Cart functions
function getCartItems() {
	const items = localStorage.getItem('cartItems')
	return items ? JSON.parse(items) : []
}

function addToCart(productId, productName, productPrice) {
	const cartItems = getCartItems()
	const existingItem = cartItems.find(item => item.id === productId)

	if (existingItem) {
		existingItem.quantity += 1
	} else {
		cartItems.push({
			id: productId,
			name: productName,
			price: productPrice,
			quantity: 1,
		})
	}

	localStorage.setItem('cartItems', JSON.stringify(cartItems))
	updateCartCount(cartItems.length)
}

function updateCartCount(count) {
	const cartBadges = document.querySelectorAll('.cart-count')
	for (const badge of cartBadges) {
		badge.textContent = count.toString()
		badge.style.display = count > 0 ? 'inline' : 'none'
	}
}

function showCartNotification(productName) {
	// Create notification
	const notification = document.createElement('div')
	notification.className =
		'alert alert-success alert-dismissible fade show position-fixed'
	notification.style.cssText =
		'top: 20px; right: 20px; z-index: 9999; min-width: 300px;'
	notification.innerHTML = `
        <i class="bi bi-check-circle me-2"></i>
        <strong>${productName}</strong> добавлен в корзину
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

	document.body.appendChild(notification)

	// Auto remove after 3 seconds
	setTimeout(() => {
		if (notification.parentNode) {
			notification.remove()
		}
	}, 3000)
}

// Search functions
function performGlobalSearch(query) {
	if (query.trim()) {
		window.location.href = `empty-search.html?q=${encodeURIComponent(query)}`
	}
}

function setupSearchAutocomplete(input, suggestions) {
	let currentFocus = -1

	input.addEventListener('input', function () {
		const value = this.value.toLowerCase()
		closeAllLists()

		if (!value) return

		const autocompleteList = document.createElement('div')
		autocompleteList.className =
			'autocomplete-list position-absolute bg-white border rounded shadow-sm w-100'
		autocompleteList.style.zIndex = '1000'

		const filteredSuggestions = suggestions
			.filter(suggestion => suggestion.toLowerCase().includes(value))
			.slice(0, 5)

		filteredSuggestions.forEach((suggestion, index) => {
			const item = document.createElement('div')
			item.className = 'autocomplete-item p-2 cursor-pointer'
			item.textContent = suggestion

			item.addEventListener('click', () => {
				input.value = suggestion
				closeAllLists()
				performGlobalSearch(suggestion)
			})

			autocompleteList.appendChild(item)
		})

		if (filteredSuggestions.length > 0) {
			input.parentNode?.appendChild(autocompleteList)
		}

		currentFocus = -1
	})

	input.addEventListener('keydown', e => {
		const autocompleteList =
			input.parentNode?.querySelector('.autocomplete-list')
		if (!autocompleteList) return

		const items = autocompleteList.querySelectorAll('.autocomplete-item')

		if (e.key === 'ArrowDown') {
			currentFocus++
			addActive(items)
		} else if (e.key === 'ArrowUp') {
			currentFocus--
			addActive(items)
		} else if (e.key === 'Enter') {
			e.preventDefault()
			if (currentFocus > -1 && items[currentFocus]) {
				items[currentFocus].click()
			}
		}
	})

	function addActive(items) {
		removeActive(items)
		if (currentFocus >= items.length) currentFocus = 0
		if (currentFocus < 0) currentFocus = items.length - 1
		items[currentFocus].classList.add('active', 'bg-light')
	}

	function removeActive(items) {
		for (const item of items) {
			item.classList.remove('active', 'bg-light')
		}
	}

	function closeAllLists() {
		for (const list of document.querySelectorAll('.autocomplete-list')) {
			list.remove()
		}
	}

	// Close lists when clicking outside
	document.addEventListener('click', e => {
		if (!input.contains(e.target)) {
			closeAllLists()
		}
	})
}

// User interface updates
function updateUserInterface(user) {
	const userElements = document.querySelectorAll('.user-name')
	for (const element of userElements) {
		element.textContent = user.name || user.email
	}

	const loginButtons = document.querySelectorAll('.login-button')
	for (const button of loginButtons) {
		button.textContent = 'Личный кабинет'
		button.setAttribute('href', 'empty-orders.html')
	}
}

// Form validation
function validateForm(form) {
	let isValid = true
	const inputs = form.querySelectorAll(
		'input[required], select[required], textarea[required]'
	)

	for (const input of inputs) {
		if (!input.value.trim()) {
			input.classList.add('is-invalid')
			isValid = false
		} else {
			input.classList.remove('is-invalid')
			input.classList.add('is-valid')
		}

		// Email validation
		if (input.type === 'email' && input.value.trim()) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			if (!emailRegex.test(input.value)) {
				input.classList.add('is-invalid')
				isValid = false
			}
		}
	}

	return isValid
}

// Utility functions
function showAlert(type, message) {
	const alertDiv = document.createElement('div')
	alertDiv.className = `alert alert-${
		type === 'error' ? 'danger' : type
	} alert-dismissible fade show position-fixed`
	alertDiv.style.cssText =
		'top: 20px; right: 20px; z-index: 9999; min-width: 300px;'
	alertDiv.innerHTML = `
        <i class="bi bi-${getAlertIcon(type)} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

	document.body.appendChild(alertDiv)

	// Auto remove after 5 seconds
	setTimeout(() => {
		if (alertDiv.parentNode) {
			alertDiv.remove()
		}
	}, 5000)
}

function getAlertIcon(type) {
	switch (type) {
		case 'success':
			return 'check-circle'
		case 'error':
			return 'x-circle'
		case 'warning':
			return 'exclamation-triangle'
		case 'info':
			return 'info-circle'
		default:
			return 'info-circle'
	}
}

// Lazy loading for images
function initializeLazyLoading() {
	const images = document.querySelectorAll('img[data-src]')

	const imageObserver = new IntersectionObserver((entries, observer) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				const img = entry.target
				img.src = img.dataset.src
				img.classList.remove('lazy')
				imageObserver.unobserve(img)
			}
		}
	})

	for (const img of images) {
		imageObserver.observe(img)
	}
}

// Performance monitoring
function trackPagePerformance() {
	window.addEventListener('load', () => {
		setTimeout(() => {
			const perfData = performance.getEntriesByType('navigation')[0]
			console.log(
				'Page Load Time:',
				perfData.loadEventEnd - perfData.loadEventStart
			)
			console.log(
				'DOM Content Loaded:',
				perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart
			)
		}, 0)
	})
}

// Initialize performance tracking
trackPagePerformance()

// Make functions available globally for other scripts
window.showAlert = showAlert
window.initializeLazyLoading = initializeLazyLoading
